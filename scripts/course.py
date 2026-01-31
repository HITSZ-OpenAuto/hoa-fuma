import asyncio
import json
from pathlib import Path
from typing import Callable, Coroutine

from rich.progress import Progress, TaskID

from models import Course, Plan
from tree_utils import flat_to_tree, tree_to_jsx


def _yaml_quote(s: str) -> str:
    if s == "":
        return "''"
    # quote if it contains YAML special chars or leading/trailing spaces
    special = [
        ":",
        "#",
        "{",
        "}",
        "[",
        "]",
        ",",
        "&",
        "*",
        "?",
        "|",
        ">",
        "-",
        "!",
        "%",
        "@",
        "`",
        "\n",
    ]
    if s.strip() != s or any(ch in s for ch in special):
        return json.dumps(s, ensure_ascii=False)
    return s


def _to_yaml(value: object, indent: int = 0) -> str:
    pad = "  " * indent

    if value is None:
        return ""

    if isinstance(value, bool):
        return "true" if value else "false"

    if isinstance(value, (int, float)):
        return str(value)

    if isinstance(value, str):
        return _yaml_quote(value)

    if isinstance(value, list):
        if not value:
            return "[]"
        lines: list[str] = []
        for item in value:
            if isinstance(item, (dict, list)):
                lines.append(f"{pad}-")
                lines.append(_to_yaml(item, indent + 1))
            else:
                lines.append(f"{pad}- {_to_yaml(item, 0)}")
        return "\n".join(lines)

    if isinstance(value, dict):
        lines: list[str] = []
        for k, v in value.items():
            if isinstance(v, dict):
                lines.append(f"{pad}{k}:")
                nested = _to_yaml(v, indent + 1)
                if nested:
                    lines.append(nested)
            elif isinstance(v, list):
                # For empty lists, keep it on the same line: `key: []`
                if not v:
                    lines.append(f"{pad}{k}: []")
                else:
                    lines.append(f"{pad}{k}:")
                    nested = _to_yaml(v, indent + 1)
                    if nested:
                        lines.append(nested)
            else:
                rendered = _to_yaml(v, 0)
                if rendered == "":
                    lines.append(f"{pad}{k}:")
                else:
                    lines.append(f"{pad}{k}: {rendered}")
        return "\n".join(lines)

    return _yaml_quote(str(value))


def _semester_bucket(recommended: str | None) -> tuple[str, str] | None:
    """Map HOA 'recommended_year_semester' to (folder, title)."""
    if not recommended:
        return None

    # Examples seen: "第一学年秋季"
    mapping = {
        "第一学年秋季": ("fresh-autumn", "大一·秋"),
        "第一学年春季": ("fresh-spring", "大一·春"),
        "第二学年秋季": ("sophomore-autumn", "大二·秋"),
        "第二学年春季": ("sophomore-spring", "大二·春"),
        "第三学年秋季": ("junior-autumn", "大三·秋"),
        "第三学年春季": ("junior-spring", "大三·春"),
        "第四学年秋季": ("senior-autumn", "大四·秋"),
        "第四学年春季": ("senior-spring", "大四·春"),
    }
    return mapping.get(recommended)


def _build_frontmatter(*, title: str, info: dict[str, object]) -> str:
    payload: dict[str, object] = {
        "title": title,
        # Keep 'description:' present even if empty (matches the example)
        "description": "",
        "course": info,
    }
    return f"---\n{_to_yaml(payload)}\n---"


def _extract_course_info(raw: dict[str, object]) -> dict[str, object]:
    """Best-effort extraction from `hoa info ... --json`.

    The CLI schema may change; we try common keys and only emit fields we can find.
    """

    # Also check the nested "course" object where some fields are stored
    raw_course = raw.get("course")
    course_data: dict[str, object] = raw_course if isinstance(raw_course, dict) else {}

    def g(*keys: str) -> object:
        for k in keys:
            # Check top-level first
            if k in raw and raw[k] not in (None, ""):
                return raw[k]
            # Then check nested course object
            if k in course_data and course_data[k] not in (None, ""):
                return course_data[k]
        return None

    def num(x: object) -> int:
        if x in (None, ""):
            return 0
        if isinstance(x, bool):
            return int(x)
        if isinstance(x, (int, float)):
            return int(x)
        if isinstance(x, str):
            try:
                return int(float(x))
            except Exception:
                return 0
        return 0

    hour_raw = g("hour_distribution", "hourDistribution", "hours") or {}
    grade_details = g("grade_details")

    hour_dict = hour_raw if isinstance(hour_raw, dict) else {}

    hour = {
        "theory": num(hour_dict.get("theory") or hour_dict.get("lecture")),
        "lab": num(hour_dict.get("lab")),
        "practice": num(hour_dict.get("practice")),
        "exercise": num(hour_dict.get("exercise")),
        "computer": num(hour_dict.get("computer")),
        "tutoring": num(hour_dict.get("tutoring")),
    }

    def parse_percent(value: object) -> int:
        """Parse percentage from string like '10%' or number."""
        if isinstance(value, (int, float)):
            return int(value)
        if isinstance(value, str):
            # Remove % sign and parse
            cleaned = value.replace("%", "").strip()
            try:
                return int(float(cleaned))
            except Exception:
                return 0
        return 0

    # Parse grade_details array from CLI
    grading_scheme = []
    if grade_details and isinstance(grade_details, list):
        for item in grade_details:
            if isinstance(item, dict):
                name = str(item.get("name", ""))
                percent = parse_percent(item.get("percent", 0))
                if name and percent > 0:
                    grading_scheme.append({"name": name, "percent": percent})

    return {
        "credit": num(g("credit", "credits")),
        "assessmentMethod": g("assessmentMethod", "assessment_method", "assessment")
        or "",
        "courseNature": g("courseNature", "course_nature", "nature") or "",
        "hourDistribution": hour,
        "gradingScheme": grading_scheme,
    }


async def _process_course(
    course: Course,
    plan: Plan,
    repos_dir: Path,
    major_dir: Path,
    run_hoa: Callable[..., Coroutine[None, None, list[str]]],
    hoa_sem: asyncio.Semaphore | None,
    progress: Progress,
    task_id: TaskID,
) -> None:
    """Process a single course - can run concurrently."""
    path = repos_dir / f"{course.code}.mdx"
    json_path = repos_dir / f"{course.code}.json"

    # Remove first two lines (title)
    content = "\n".join(path.read_text().splitlines()[2:])

    # Query HOA for course info
    info_lines = await run_hoa("info", plan.id, course.code, "--json", sem=hoa_sem)
    raw_info: dict[str, object] = {}
    if info_lines:
        try:
            raw_info = json.loads("\n".join(info_lines))
        except Exception:
            raw_info = {}

    # recommended_year_semester is nested inside the "course" object in HOA response
    raw_course = raw_info.get("course")
    course_data: dict[str, object] = raw_course if isinstance(raw_course, dict) else {}
    recommended = course_data.get("recommended_year_semester") or course_data.get(
        "recommendedYearSemester"
    )
    bucket = _semester_bucket(recommended if isinstance(recommended, str) else None)
    if bucket:
        semester_folder, semester_title = bucket
        target_dir = major_dir / semester_folder
        target_dir.mkdir(parents=True, exist_ok=True)
        index_path = target_dir / "index.mdx"
        if not index_path.exists():
            index_path.write_text(f"---\ntitle: {semester_title}\n---\n")
    else:
        target_dir = major_dir

    # Generate FileTree from JSON
    flat_data = json.loads(json_path.read_text())
    tree = flat_to_tree(flat_data, course.code)
    tree_jsx = tree_to_jsx(tree)
    filetree_content = f'\n\n## 资源下载\n\n<Files url="https://github.com/HITSZ-OpenAuto/{course.code}">\n{tree_jsx}\n</Files>'

    extracted = _extract_course_info(raw_info)
    frontmatter = _build_frontmatter(title=course.name, info=extracted)

    (target_dir / f"{course.code}.mdx").write_text(
        f"{frontmatter}\n\n<CourseInfo />\n\n{content}{filetree_content}"
    )
    progress.advance(task_id)


async def generate_pages(
    plans: list[Plan],
    *,
    run_hoa: Callable[..., Coroutine[None, None, list[str]]],
    hoa_sem: asyncio.Semaphore | None = None,
) -> None:
    """Generate course pages and metadata from plans.

    Expected plan shape: .id, .year, .major_code, .major_name, .courses (with .code, .name)
    """

    years = set()
    repos_dir = Path("repos")
    docs_dir = Path("content/docs")

    # Calculate total courses for progress bar
    total_courses = sum(len(plan.courses) for plan in plans)

    with Progress() as progress:
        task = progress.add_task("Generating pages...", total=total_courses)

        for plan in plans:
            years.add(plan.year)
            major_dir = docs_dir / plan.year / plan.major_code
            major_dir.mkdir(parents=True, exist_ok=True)

            # Write major metadata
            (major_dir / "meta.json").write_text(
                json.dumps(
                    {"title": plan.major_name, "root": True, "defaultOpen": True},
                    indent=2,
                    ensure_ascii=False,
                )
            )

            # Generate course pages concurrently
            await asyncio.gather(
                *(
                    _process_course(
                        course,
                        plan,
                        repos_dir,
                        major_dir,
                        run_hoa,
                        hoa_sem,
                        progress,
                        task,
                    )
                    for course in plan.courses
                ),
                return_exceptions=True,
            )

    # Write year metadata and index once per year
    for year in years:
        year_dir = docs_dir / year
        meta_path = year_dir / "meta.json"
        meta_path.write_text(json.dumps({"title": year}, indent=2, ensure_ascii=False))

        # Create year index with Cards for semesters
        index_path = year_dir / "index.mdx"
        cards_content = """---
title: 目录
---

<Cards>
  <Card title="大一·秋" href="./fresh-autumn" />
  <Card title="大一·春" href="./fresh-spring" />
  <Card title="大二·秋" href="./sophomore-autumn" />
  <Card title="大二·春" href="./sophomore-spring" />
  <Card title="大三·秋" href="./junior-autumn" />
  <Card title="大三·春" href="./junior-spring" />
  <Card title="大四·秋" href="./senior-autumn" />
  <Card title="大四·春" href="./senior-spring" />
</Cards>
"""
        index_path.write_text(cards_content)
