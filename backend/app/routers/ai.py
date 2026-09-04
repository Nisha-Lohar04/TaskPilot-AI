from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.database.session import get_db
from app.models.task import Task
from app.models.user import User


router = APIRouter(
    prefix="/ai",
    tags=["AI Assistant"],
)


@router.post("/chat")
def ai_chat(
    data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    message = data.get("message", "").strip()

    if not message:
        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty",
        )

    message_lower = message.lower()

    tasks = (
        db.query(Task)
        .filter(Task.user_id == current_user.id)
        .all()
    )

    # -----------------------------------
    # COMPLETED TASKS
    # -----------------------------------

    if any(
        phrase in message_lower
        for phrase in [
            "completed tasks",
            "finished tasks",
            "done tasks",
            "tasks completed",
        ]
    ):

        completed_tasks = [
            task
            for task in tasks
            if task.status.lower() == "completed"
        ]

        if not completed_tasks:
            return {
                "type": "answer",
                "message": "You don't have any completed tasks yet.",
            }

        task_list = "\n".join(
            [
                f"• {task.title}"
                for task in completed_tasks
            ]
        )

        return {
            "type": "answer",
            "message": (
                f"You have {len(completed_tasks)} completed task(s):\n\n"
                f"{task_list}"
            ),
        }

    # -----------------------------------
    # REMAINING / PENDING TASKS
    # -----------------------------------

    if any(
        phrase in message_lower
        for phrase in [
            "remaining tasks",
            "tasks remaining",
            "pending tasks",
            "incomplete tasks",
            "tasks left",
            "what is left",
            "what's left",
            "remaining to complete",
            "remaining to be completed",
        ]
    ):

        remaining_tasks = [
            task
            for task in tasks
            if task.status.lower() != "completed"
        ]

        if not remaining_tasks:
            return {
                "type": "answer",
                "message": (
                    "Great work! 🎉 You don't have any remaining tasks."
                ),
            }

        task_list = "\n".join(
            [
                f"• {task.title} — {task.status}"
                for task in remaining_tasks
            ]
        )

        return {
            "type": "answer",
            "message": (
                f"You have {len(remaining_tasks)} remaining task(s):\n\n"
                f"{task_list}"
            ),
        }

    # -----------------------------------
    # SHOW ALL TASKS
    # -----------------------------------

    if any(
        phrase in message_lower
        for phrase in [
            "all tasks",
            "show my tasks",
            "list my tasks",
            "my tasks",
        ]
    ):

        if not tasks:
            return {
                "type": "answer",
                "message": "You don't have any tasks yet.",
            }

        task_list = "\n".join(
            [
                f"• {task.title} — {task.status}"
                for task in tasks
            ]
        )

        return {
            "type": "answer",
            "message": (
                f"Here are all your tasks:\n\n{task_list}"
            ),
        }

    # -----------------------------------
    # TASK SUMMARY
    # -----------------------------------

    if any(
        phrase in message_lower
        for phrase in [
            "summary",
            "task summary",
            "summarize my tasks",
        ]
    ):

        total = len(tasks)

        completed = len(
            [
                task
                for task in tasks
                if task.status.lower() == "completed"
            ]
        )

        pending = len(
            [
                task
                for task in tasks
                if task.status.lower() == "pending"
            ]
        )

        in_progress = len(
            [
                task
                for task in tasks
                if task.status.lower() == "in progress"
            ]
        )

        return {
            "type": "answer",
            "message": (
                f"Task Summary:\n\n"
                f"• Total: {total}\n"
                f"• Pending: {pending}\n"
                f"• In Progress: {in_progress}\n"
                f"• Completed: {completed}"
            ),
        }

    # -----------------------------------
    # CREATE TASK
    # -----------------------------------

    new_task = Task(
        title=message,
        description="Created using TaskPilot AI Assistant",
        priority="Medium",
        category="AI Generated",
        status="Pending",
        user_id=current_user.id,
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return {
        "type": "task_created",
        "message": (
            f"I created a new task: {new_task.title}"
        ),
        "task": {
            "id": new_task.id,
            "title": new_task.title,
            "status": new_task.status,
        },
    }