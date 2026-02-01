import asyncio
import json
from pathlib import Path
from typing import Callable, Coroutine

from rich.progress import Progress, TaskID

from course.info import extract_course_info
from lib.constants import SEMESTER_MAPPING, build_major_index, build_semester_index
from lib.tree_utils import flat_to_tree, tree_to_jsx
from lib.yaml_utils import build_frontmatter
from models import Course, Plan


def _semester_bucket(recommended: str | None) -> tuple[str, str] | None:
    """Map HOA 'recommended_year_semester' to (folder, title)."""
    if not recommended:
        return None
    return SEMESTER_MAPPING.get(recommended)


async def _process_course(
    course: Course,
    plan: Plan,
    repos_dir: Path,
    major_dir: Path,
    run_hoa: Callable[..., Coroutine[None, None, list[str]]],
    hoa_sem: asyncio.Semaphore | None,
    progress: Progress,
    task_id: TaskID,
    courses_by_semester: dict[Path, list[tuple[str, str]]],
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
        # Track course for semester index generation
        if target_dir not in courses_by_semester:
            courses_by_semester[target_dir] = []
        courses_by_semester[target_dir].append((course.code, course.name))
    else:
        target_dir = major_dir

    # Generate FileTree from JSON
    flat_data = json.loads(json_path.read_text())
    tree = flat_to_tree(flat_data, course.code)
    tree_jsx = tree_to_jsx(tree)
    filetree_content = f'\n\n## 资源下载\n\n<Files url="https://github.com/HITSZ-OpenAuto/{course.code}">\n{tree_jsx}\n</Files>'

    extracted = extract_course_info(raw_info)
    frontmatter = build_frontmatter(title=course.name, info=extracted)

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

    # Track majors by year for year index generation
    majors_by_year: dict[str, list[tuple[str, str]]] = {}

    # Calculate total courses for progress bar
    total_courses = sum(len(plan.courses) for plan in plans)

    with Progress() as progress:
        task = progress.add_task("Generating pages...", total=total_courses)

        for plan in plans:
            years.add(plan.year)

            # Track major for this year
            if plan.year not in majors_by_year:
                majors_by_year[plan.year] = []
            majors_by_year[plan.year].append((plan.major_code, plan.major_name))

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

            # Track courses by semester for this major
            courses_by_semester: dict[Path, list[tuple[str, str]]] = {}

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
                        courses_by_semester,
                    )
                    for course in plan.courses
                ),
                return_exceptions=True,
            )

            # Generate semester index pages with course cards
            for sem_dir, courses in courses_by_semester.items():
                sem_title = sem_dir.name.replace("-", " ").title()
                # Find the proper title from SEMESTER_MAPPING
                for folder, title in SEMESTER_MAPPING.values():
                    if folder == sem_dir.name:
                        sem_title = title
                        break

                cards = ["---", f"title: {sem_title}", "---", "", "<Cards>"]
                for code, name in courses:
                    cards.append(
                        f'  <Card title="{name}" href="/docs/{plan.year}/{plan.major_code}/{sem_dir.name}/{code}" />'
                    )
                cards.append("</Cards>")
                (sem_dir / "index.mdx").write_text("\n".join(cards))

            # Create major index with Cards for semesters
            (major_dir / "index.mdx").write_text(
                build_semester_index(plan.year, plan.major_code)
            )

    # Write year metadata and index once per year
    for year in years:
        year_dir = docs_dir / year
        meta_path = year_dir / "meta.json"
        meta_path.write_text(json.dumps({"title": year}, indent=2, ensure_ascii=False))

        # Create year index with Cards for majors
        index_path = year_dir / "index.mdx"
        index_path.write_text(build_major_index(year, majors_by_year.get(year, [])))
