"""YAML serialization utilities."""

import json


def yaml_quote(s: str) -> str:
    """Quote a string if it contains YAML special characters or whitespace."""
    if s == "":
        return "''"

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


def to_yaml(value: object, indent: int = 0) -> str:
    """Convert a Python object to YAML string format."""
    pad = "  " * indent

    if value is None:
        return ""

    if isinstance(value, bool):
        return "true" if value else "false"

    if isinstance(value, (int, float)):
        return str(value)

    if isinstance(value, str):
        return yaml_quote(value)

    if isinstance(value, list):
        if not value:
            return "[]"
        lines: list[str] = []
        for item in value:
            if isinstance(item, (dict, list)):
                lines.append(f"{pad}-")
                lines.append(to_yaml(item, indent + 1))
            else:
                lines.append(f"{pad}- {to_yaml(item, 0)}")
        return "\n".join(lines)

    if isinstance(value, dict):
        lines: list[str] = []
        for k, v in value.items():
            if isinstance(v, dict):
                lines.append(f"{pad}{k}:")
                nested = to_yaml(v, indent + 1)
                if nested:
                    lines.append(nested)
            elif isinstance(v, list):
                if not v:
                    lines.append(f"{pad}{k}: []")
                else:
                    lines.append(f"{pad}{k}:")
                    nested = to_yaml(v, indent + 1)
                    if nested:
                        lines.append(nested)
            else:
                rendered = to_yaml(v, 0)
                if rendered == "":
                    lines.append(f"{pad}{k}:")
                else:
                    lines.append(f"{pad}{k}: {rendered}")
        return "\n".join(lines)

    return yaml_quote(str(value))


def build_frontmatter(*, title: str, info: dict[str, object]) -> str:
    """Build YAML frontmatter for a course page."""
    payload: dict[str, object] = {
        "title": title,
        "description": "",
        "course": info,
    }
    return f"---\n{to_yaml(payload)}\n---"
