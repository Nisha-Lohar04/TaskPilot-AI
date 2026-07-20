from fastapi import FastAPI

from .database import engine, Base
from . import models

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Task Manager API",
    description="Backend API for AI Task Manager",
    version="1.0.0"
)


@app.get("/")
def home():
    return {
        "message": "Welcome to AI Task Manager API 🚀"
    }