from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.database.session import get_db
from app.models.user import User


router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"],
)


@router.get("/")
def get_tasks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return {
        "message": "Authenticated successfully",
        "user": current_user.username,
    }