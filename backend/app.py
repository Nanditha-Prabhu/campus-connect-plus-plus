from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import (
    users_router, 
    statistics_router, 
    search_router, 
    projects_router, 
    kanban_router,
    ai_router
)


# Create FastAPI instance
app = FastAPI()

# Add CORS | https://fastapi.tiangolo.com/tutorial/cors/#use-corsmiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add routes
app.include_router(users_router, prefix="/users")
app.include_router(search_router, prefix="/search")
app.include_router(projects_router, prefix="/projects")
app.include_router(kanban_router, prefix="/kanban")
app.include_router(ai_router, prefix="/ai")
app.include_router(statistics_router, prefix="/statistics")
