"""Data models for the course page generator."""

from dataclasses import dataclass, field


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
