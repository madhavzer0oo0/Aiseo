from app.models.keyword import Keyword
from app.core.database import get_db
from app.core.security import get_current_user
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends
from pydantic import BaseModel

router = APIRouter(prefix="/seo", tags=["SEO"])


# ---------------------------
# Keyword Research
# ---------------------------
@router.post("/keyword-research")
def keyword_research(
    data: dict,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    keyword = data["keyword"]

    result = {
        "keyword": keyword,
        "search_volume": 5400,
        "difficulty": 42,
        "intent": "Informational",
        "related_keywords": [
            f"{keyword} guide",
            f"best {keyword}",
            f"{keyword} for beginners",
            f"{keyword} tips",
        ],
    }

    keyword_entry = Keyword(
        keyword=keyword,
        search_volume=result["search_volume"],
        difficulty=result["difficulty"],
        intent=result["intent"],
        user_id=current_user.id,
    )

    db.add(keyword_entry)
    db.commit()

    return result


# ---------------------------
# Keyword History
# ---------------------------
@router.get("/history")
def keyword_history(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    keywords = (
        db.query(Keyword)
        .filter(Keyword.user_id == current_user.id)
        .order_by(Keyword.created_at.desc())
        .limit(10)
        .all()
    )

    return [
        {
            "id": k.id,
            "keyword": k.keyword,
            "search_volume": k.search_volume,
            "difficulty": k.difficulty,
            "intent": k.intent,
            "created_at": k.created_at,
        }
        for k in keywords
    ]


# ---------------------------
# Blog Writer (MOCK)
# ---------------------------
class BlogRequest(BaseModel):
    keyword: str
    tone: str = "informative"
    length: int = 800


@router.post("/blog-writer")
def blog_writer(
    data: BlogRequest,
    current_user=Depends(get_current_user),
):
    return {
        "title": f"{data.keyword.title()} – Complete SEO Guide",
        "meta_description": f"Learn everything about {data.keyword} with this SEO optimized guide.",
        "outline": [
            f"What is {data.keyword}?",
            f"Why {data.keyword} matters",
            f"How to use {data.keyword}",
            f"Common mistakes",
            f"Best practices",
        ],
        "content": f"""
## What is {data.keyword}?
{data.keyword} is an important concept in SEO.

## Why {data.keyword} matters
It helps improve visibility and rankings.

## How to use {data.keyword}
Use it naturally in headings and content.

## Common mistakes
Avoid keyword stuffing.

## Best practices
Focus on quality and user intent.
"""
    }
