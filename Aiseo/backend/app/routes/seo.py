from app.models.keyword import Keyword
from app.core.database import get_db
from app.core.security import get_current_user
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.services.llm import generate_blog  # 🔥 Groq service

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
# Blog Writer (Groq LLM)
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
    """
    Generates an SEO-optimized blog using Groq LLM.
    Falls back safely if LLM fails.
    """
    try:
        return generate_blog(
            keyword=data.keyword,
            tone=data.tone,
            length=data.length,
        )

    except Exception as e:
        print("BLOG LLM ERROR:", e)

        # 🔒 Safe fallback (never crash API)
        return {
            "title": f"{data.keyword.title()} – Complete SEO Guide",
            "meta_description": "AI generation failed. Showing fallback content.",
            "outline": [],
            "content": "Blog generation failed. Please try again later.",
        }
