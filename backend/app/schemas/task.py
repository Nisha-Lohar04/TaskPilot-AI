from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class TaskCreate(BaseModel):

    title: str = Field(
        min_length=1,
        max_length=255,
    )

    description: Optional[str] = None

    priority: str = Field(
        default="Medium"
    )

    category: str = Field(
        default="Other"
    )

    status: str = Field(
        default="Pending"
    )

    due_date: Optional[date] = None


class TaskUpdate(BaseModel):

    title: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=255,
    )

    description: Optional[str] = None

    priority: Optional[str] = None

    category: Optional[str] = None

    status: Optional[str] = None

    due_date: Optional[date] = None


class TaskResponse(BaseModel):

    id: int

    title: str

    description: Optional[str]

    priority: str

    category: str

    status: str

    due_date: Optional[date]

    user_id: int

    created_at: datetime

    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )