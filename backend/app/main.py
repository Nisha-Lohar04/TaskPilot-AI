from fastapi import FastAPI

from app.database.session import Base, engine
from app.models import User, Task
from app.routers import auth, tasks


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="AI Task Manager API",
    version="1.0.0",
    description="Backend API for the AI Task Manager platform",
)


app.include_router(auth.router)
app.include_router(tasks.router)


@app.get("/", tags=["Health"])
def health_check():
    return {
        "status": "healthy"
    }