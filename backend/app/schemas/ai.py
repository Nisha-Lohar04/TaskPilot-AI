from datetime import date
from typing import Optional

from pydantic import BaseModel, Field


class TaskAnalysisRequest(BaseModel):

    text: str = Field(
        min_length=3,
        max_length=2000,
    )


class TaskAnalysisResponse(BaseModel):

    title: str

    description: Optional[str] = None

    priority: str

    category: str

    status: str

    due_date: Optional[date] = None