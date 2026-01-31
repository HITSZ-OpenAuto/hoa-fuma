import asyncio
import base64
import json
import os
import sys
from dataclasses import dataclass, field
from pathlib import Path

from dotenv import load_dotenv
from githubkit import GitHub
from rich.progress import Progress, TaskID

from course import generate_pages


@dataclass
class Course:
    code: str
    name: str


@dataclass
class Plan:
    id: str
    year: str
    major_code: str
    major_name: str
    courses: list[Course] = field(default_factory=list)


async def run_hoa(*args: str, sem: asyncio.Semaphore | None = None) -> list[str]:
    """Helper to run 'hoa' CLI commands and return output lines."""
    async with (sem or asyncio.Lock()):
        proc = await asyncio.create_subprocess_exec(
            "hoa", *args, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE
        )
        stdout, _ = await proc.communicate()
        return stdout.decode().splitlines()


async def fetch_repo_data(
    github: GitHub,
    repo: str,
    sem: asyncio.Semaphore | None = None,
    progress: Progress | None = None,
    task_id: TaskID | None = None,
) -> str:
    """Fetch README and worktree.json from GitHub and cache them locally in 'repos/'."""
    path = Path("repos") / f"{repo}.mdx"
    json_path = Path("repos") / f"{repo}.json"

    # Fetch README if not exists
    if not path.exists():
        try:
            async with (sem or asyncio.Lock()):
                resp = await github.rest.repos.async_get_content(
                    "HITSZ-OpenAuto", repo, "README.md"
                )
            encoded = getattr(resp.parsed_data, "content", "").replace("\n", "")
            path.write_text(base64.b64decode(encoded).decode("utf-8"))
        except Exception as e:
            print(f"Error fetching README for {repo}: {e}")

    # Fetch worktree.json if not exists
    if not json_path.exists():
        try:
            async with (sem or asyncio.Lock()):
                resp = await github.rest.repos.async_get_content(
                    "HITSZ-OpenAuto", repo, "worktree.json", ref="worktree"
                )
            encoded = getattr(resp.parsed_data, "content", "").replace("\n", "")
            json_path.write_text(base64.b64decode(encoded).decode("utf-8"))
        except Exception as e:
            print(f"Error fetching worktree.json for {repo}: {e}")

    if progress is not None and task_id is not None:
        progress.advance(task_id)

    return path.read_text() if path.exists() else ""


async def update_plan(
    plan: Plan,
    repos_set: set[str],
    sem: asyncio.Semaphore | None = None,
    progress: Progress | None = None,
    task_id: TaskID | None = None,
) -> None:
    """Fetch courses for a specific plan and filter by existing repos."""
    lines = await run_hoa("courses", plan.id, sem=sem)
    for line in lines:
        parts = line.split()
        if len(parts) >= 2 and parts[0] in repos_set:
            plan.courses.append(Course(parts[0], parts[1]))
    if progress is not None and task_id is not None:
        progress.advance(task_id)


def resolve_github_token() -> str | None:
    """Resolve a GitHub token without requiring the user to manually export a PAT.

    Priority:
    1) PERSONAL_ACCESS_TOKEN (explicit)
    2) GITHUB_TOKEN (common in GitHub Actions)
    3) `gh auth token` (local dev machines with GitHub CLI logged in)
    """

    token = os.environ.get("PERSONAL_ACCESS_TOKEN")
    if token:
        return token

    token = os.environ.get("GITHUB_TOKEN")
    if token:
        return token

    try:
        import subprocess

        out = subprocess.check_output(["gh", "auth", "token"], stderr=subprocess.DEVNULL)
        token = out.decode().strip()
        return token or None
    except Exception:
        return None


async def main() -> None:
    load_dotenv()
    token = resolve_github_token()
    if not token:
        sys.exit(
            "Error: no GitHub token found. Set PERSONAL_ACCESS_TOKEN (recommended for CI) "
            "or GITHUB_TOKEN, or login via `gh auth login`."
        )

    github = GitHub(token)
    Path("repos").mkdir(exist_ok=True)

    repos_list = {
        line.strip()
        for line in Path("repos_list.txt").read_text().splitlines()
        if line.strip()
    }

    github_sem = asyncio.Semaphore(20)

    print("Reading plans...")
    plans = []
    for line in await run_hoa("plans"):
        p = line.split()
        if len(p) >= 4:
            plans.append(Plan(id=p[0], year=p[1], major_code=p[2], major_name=p[3]))

    hoa_sem = asyncio.Semaphore(10)
    with Progress() as progress:
        task = progress.add_task("Fetching courses...", total=len(plans))
        await asyncio.gather(
            *(
                update_plan(p, repos_list, sem=hoa_sem, progress=progress, task_id=task)
                for p in plans
            )
        )

    with Progress() as progress:
        task = progress.add_task("Fetching repos...", total=len(repos_list))
        await asyncio.gather(
            *(
                fetch_repo_data(github, r, sem=github_sem, progress=progress, task_id=task)
                for r in repos_list
            )
        )

    print("Generating pages...")
    await generate_pages(plans, run_hoa=run_hoa, hoa_sem=hoa_sem)

    print("Done!")


if __name__ == "__main__":
    asyncio.run(main())
