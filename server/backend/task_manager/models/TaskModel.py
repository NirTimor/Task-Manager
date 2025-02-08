from typing import Optional
from pydantic import BaseModel


class TaskModel(BaseModel):
    title: str
    description: str
    priority: str
    is_completed: Optional[bool] = False
    user_id: Optional[str]


class UpdateTaskStatusRequest(BaseModel):
    is_completed: bool
