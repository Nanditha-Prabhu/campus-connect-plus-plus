from .user import router as users_router
from .statistics import router as statistics_router
from .search import router as search_router
from .projects import router as projects_router
from .kanban import router as kanban_router
from .ai import router as ai_router


# Exporting the routers for use in the main FastAPI app
__all__ = [
    "users_router",
    "statistics_router",
    "search_router",
    "projects_router",
    "kanban_router",
    "ai_router",
]
