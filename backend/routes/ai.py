from fastapi import APIRouter
from ._ai_helper_functions import search_assistant


router = APIRouter(tags=["AI"])


@router.get("/search")
async def search(query: str, num_results: int = 5):
    """
    Search for research papers based on the query.
    """
    return search_assistant(query, num_results)
