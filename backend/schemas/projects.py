from pydantic import BaseModel
from typing import List, Dict


class KanbanBoard(BaseModel):
    todo: List[Dict[str, str]]
    inProgress: List[Dict[str, str]]
    done: List[Dict[str, str]]


class ProjectDetails(BaseModel):
    title: str
    description: str
    area: str
    skills: str
    created_by: str = None
    created_at: str = None
    # updated_at: str = None
    status: str = None
    # project_start_date: str = None
    # project_end_date: str = None
    # project_duration: int = None
    # project_budget: int = None
    team: List[str] = []
    # project_tasks: List[str] = []
    # project_resources: List[str] = []


class CalenderEvent(BaseModel):
    event_type: str
    event_title: str
    event_date: str
