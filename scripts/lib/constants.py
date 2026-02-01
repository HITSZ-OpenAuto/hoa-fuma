"""Constants used in course page generation."""

# Mapping from HOA semester names to folder and display names
SEMESTER_MAPPING = {
    "第一学年秋季": ("fresh-autumn", "大一·秋"),
    "第一学年春季": ("fresh-spring", "大一·春"),
    "第二学年秋季": ("sophomore-autumn", "大二·秋"),
    "第二学年春季": ("sophomore-spring", "大二·春"),
    "第三学年秋季": ("junior-autumn", "大三·秋"),
    "第三学年春季": ("junior-spring", "大三·春"),
    "第四学年秋季": ("senior-autumn", "大四·秋"),
    "第四学年春季": ("senior-spring", "大四·春"),
}

# Semester display order for index pages
SEMESTER_CARDS = [
    ("fresh-autumn", "大一·秋"),
    ("fresh-spring", "大一·春"),
    ("sophomore-autumn", "大二·秋"),
    ("sophomore-spring", "大二·春"),
    ("junior-autumn", "大三·秋"),
    ("junior-spring", "大三·春"),
    ("senior-autumn", "大四·秋"),
    ("senior-spring", "大四·春"),
]


def build_semester_index(year: str, major_code: str) -> str:
    """Build the semester index card content for a major."""
    cards = ["---", "title: 目录", "---", "", "<Cards>"]
    for folder, title in SEMESTER_CARDS:
        cards.append(
            f'  <Card title="{title}" href="/docs/{year}/{major_code}/{folder}" />'
        )
    cards.append("</Cards>")
    return "\n".join(cards)


def build_major_index(year: str, majors: list[tuple[str, str]]) -> str:
    """Build the major index card content for a year."""
    cards = ["---", "title: 目录", "---", "", "<Cards>"]
    for code, name in majors:
        cards.append(f'  <Card title="{name}" href="/docs/{year}/{code}" />')
    cards.append("</Cards>")
    return "\n".join(cards)
