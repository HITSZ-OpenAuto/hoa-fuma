import asyncio
import base64
import json
import os
from dataclasses import dataclass
from pathlib import Path

from githubkit import GitHub

access_token = os.environ["PERSONAL_ACCESS_TOKEN"]
g = GitHub(access_token)


@dataclass
class Course:
    course_code: str
    course_name: str


@dataclass
class Plan:
    plan_id: str
    major_code: str
    major_name: str
    plan_year: str
    plan_courses: list[Course]


def create_plan_dir(plan: Plan) -> None:
    plan_dir = Path(f"content/docs/{plan.plan_year}/{plan.major_code}")
    plan_dir.mkdir(parents=True, exist_ok=True)


async def update_plan_course(plan: Plan, repos_set: set[str]) -> None:
    proc = await asyncio.create_subprocess_exec(
        "hoa",
        "courses",
        plan.plan_id,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )
    stdout, _ = await proc.communicate()
    courses: list[str] = stdout.decode().splitlines()

    for line in courses:
        course = line.split()
        if len(course) >= 2 and course[0] in repos_set:
            plan.plan_courses.append(
                Course(course_code=course[0], course_name=course[1])
            )


def create_course_page(plan: Plan) -> None:
    for c in plan.plan_courses:
        course_path = Path(
            f"content/docs/{plan.plan_year}/{plan.major_code}/{c.course_code}.mdx"
        )

        source_path = Path(f"repos/{c.course_code}.mdx")

        with source_path.open(mode="r", encoding="utf-8") as f:
            source_content = f.read()

        with course_path.open(mode="w", encoding="utf-8") as f:
            s: str = ""
            s += "---\n"
            s += f"title: {c.course_name}\n"
            s += "---\n\n"
            s += source_content
            f.write(s)


async def fetch_repo_readme(owner: str, repo: str) -> None:
    p = Path("repos")
    file_path = p / f"{repo}.mdx"
    if not file_path.exists():
        try:
            resp = await g.rest.repos.async_get_content(owner, repo, "README.md")
            contents = resp.parsed_data
        except Exception as e:
            print(f"Error fetching {owner}/{repo}: {e}")
            return
        encoded_content = getattr(contents, "content", None)
        if encoded_content:
            decoded_bytes = base64.b64decode(encoded_content.replace("\n", ""))
            content = decoded_bytes.decode("utf-8")
            with file_path.open(mode="w", encoding="utf-8") as f:
                f.write(content)


def create_metadata(plan: Plan) -> None:
    year_path = Path(f"content/docs/{plan.plan_year}/meta.json")
    with year_path.open(mode="w", encoding="utf-8") as f:
        year_info: dict = {"title": f"{plan.plan_year}"}
        json.dump(year_info, f)

    major_path = Path(f"content/docs/{plan.plan_year}/{plan.major_code}/meta.json")
    with major_path.open(mode="w", encoding="utf-8") as f:
        major_info: str = f"""{{
    "title": "{plan.major_name}",
    "root": true,
    "defaultOpen": true
}}"""
        f.write(major_info)


async def main() -> None:
    docs_dir = Path("content/docs")
    docs_dir.mkdir(parents=True, exist_ok=True)

    repos_dir = Path("repos")
    repos_dir.mkdir(exist_ok=True)

    repos_list: list[str] = []

    print("Reading exsiting repos")
    with Path("repos_list.txt").open(encoding="utf-8") as f:
        repos_list = [line.strip() for line in f]
    repos_set = set(repos_list)

    plans: list[Plan] = []
    proc = await asyncio.create_subprocess_exec(
        "hoa",
        "plans",
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )
    stdout, _ = await proc.communicate()
    plans_list = stdout.decode().splitlines()

    for i in plans_list:
        parts = i.split()
        if len(parts) >= 4:
            plan_id, plan_year, major_code, major_name = parts[:4]
            plans.append(
                Plan(
                    plan_id=plan_id,
                    major_code=major_code,
                    major_name=major_name,
                    plan_year=plan_year,
                    plan_courses=[],
                )
            )

    print("Adding courses..")
    await asyncio.gather(*(update_plan_course(p, repos_set) for p in plans))

    print("Creating dirs...")
    for p in plans:
        create_plan_dir(plan=p)

    print("Downloading repo pages...")
    await asyncio.gather(
        *(fetch_repo_readme(owner="HITSZ-OpenAuto", repo=r) for r in repos_list)
    )

    print("Creating course pages...")
    for p in plans:
        create_course_page(plan=p)

    print("Creating meta.json...")
    for p in plans:
        create_metadata(plan=p)


if __name__ == "__main__":
    asyncio.run(main())
