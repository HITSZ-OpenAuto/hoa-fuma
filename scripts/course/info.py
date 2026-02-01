"""Course information extraction from HOA API responses."""


def parse_percent(value: object) -> int:
    """Parse percentage from string like '10%' or number."""
    if isinstance(value, (int, float)):
        return int(value)
    if isinstance(value, str):
        cleaned = value.replace("%", "").strip()
        try:
            return int(float(cleaned))
        except Exception:
            return 0
    return 0


def to_int(x: object) -> int:
    """Convert value to integer, handling various types."""
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


def extract_course_info(raw: dict[str, object]) -> dict[str, object]:
    """Extract course information from HOA API response.

    Expected raw format may have course info at top level or nested in 'course' object.
    """
    raw_course = raw.get("course")
    course_data: dict[str, object] = raw_course if isinstance(raw_course, dict) else {}

    def get(*keys: str) -> object:
        """Get value from top-level or nested course object."""
        for k in keys:
            if k in raw and raw[k] not in (None, ""):
                return raw[k]
            if k in course_data and course_data[k] not in (None, ""):
                return course_data[k]
        return None

    # Extract hour distribution
    hour_raw = get("hour_distribution", "hourDistribution", "hours") or {}
    hour_dict = hour_raw if isinstance(hour_raw, dict) else {}

    hour = {
        "theory": to_int(hour_dict.get("theory") or hour_dict.get("lecture")),
        "lab": to_int(hour_dict.get("lab")),
        "practice": to_int(hour_dict.get("practice")),
        "exercise": to_int(hour_dict.get("exercise")),
        "computer": to_int(hour_dict.get("computer")),
        "tutoring": to_int(hour_dict.get("tutoring")),
    }

    # Extract grading scheme
    grade_details = get("grade_details")
    grading_scheme = []
    if grade_details and isinstance(grade_details, list):
        for item in grade_details:
            if isinstance(item, dict):
                name = str(item.get("name", ""))
                percent = parse_percent(item.get("percent", 0))
                if name and percent > 0:
                    grading_scheme.append({"name": name, "percent": percent})

    return {
        "credit": to_int(get("credit", "credits")),
        "assessmentMethod": get("assessmentMethod", "assessment_method", "assessment")
        or "",
        "courseNature": get("courseNature", "course_nature", "nature") or "",
        "hourDistribution": hour,
        "gradingScheme": grading_scheme,
    }
