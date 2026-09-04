from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware

from app.database.session import Base, engine

from app.models import User, Task

from app.routers import auth, tasks, ai

from app.core.config import settings


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="TaskPilot AI API",
    version="1.0.0",
    description="Backend API for the TaskPilot AI task management platform",
)


origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    settings.FRONTEND_URL,
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router)
app.include_router(tasks.router)
app.include_router(ai.router)


@app.get("/", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "message": "TaskPilot AI API is running",
    }


@app.get("/health", tags=["Health"])
def health():
    return {
        "status": "healthy",
    }