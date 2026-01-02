from app.models.keyword import Keyword
from app.core.database import get_db
from app.core.security import get_current_user
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends
from pydantic import BaseModel

# 🔍 SerpApi services
from app.services.serpapi import get_serp_data, estimate_metrics

# 🔥 LLM services
from app.services.llm import generate_blog
from app.services.keyword_llm import analyze_keyword

router = APIRouter(prefix="/seo", tags=["SEO"])


# ---------------------------
# Keyword Research (SerpApi + LLM + Heuristics)
# ---------------------------
@router.post("/keyword-research")
def keyword_research(
    data: dict,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    keyword = data["keyword"]

    # 🔍 SerpApi: real Google data
    try:
        serp_data = get_serp_data(keyword)
    except Exception as e:
        print("SERPAPI ERROR:", e)
        serp_data = {}

    # 📊 Heuristic metrics from SERP
    metrics = estimate_metrics(serp_data) if serp_data else {}

    # 🔥 LLM: intent + clustering
    try:
        llm_data = analyze_keyword(keyword) or {}
    except Exception as e:
        print("KEYWORD LLM ERROR:", e)
        llm_data = {}

    result = {
        "keyword": keyword,

        # ✅ ESTIMATED (now dynamic, not static)
        "search_volume": metrics.get("search_volume", 0),
        "difficulty": metrics.get("difficulty", 0),
        "metrics_type": "estimated",

        # 🧠 LLM-powered understanding
        "intent": llm_data.get("intent", "Informational"),
        "content_type": llm_data.get("content_type", "Guide"),

        # 🔍 Real Google suggestions
        "related_keywords": serp_data.get(
            "related_searches",
            llm_data.get(
                "related_keywords",
                [
                    f"{keyword} guide",
                    f"best {keyword}",
                    f"{keyword} for beginners",
                    f"{keyword} tips",
                ],
            ),
        ),

        # 🔍 Google PAA
        "people_also_ask": serp_data.get("people_also_ask", []),

        # 🧠 Semantic clusters
        "keyword_clusters": llm_data.get("keyword_clusters", {}),
    }

    # 🔒 Save only stable fields to DB
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
    try:
        return generate_blog(
            keyword=data.keyword,
            tone=data.tone,
            length=data.length,
        )

    except Exception as e:
        print("BLOG LLM ERROR:", e)

        return {
            "title": f"{data.keyword.title()} – Complete SEO Guide",
            "meta_description": "AI generation failed. Showing fallback content.",
            "outline": [],
            "content": "Blog generation failed. Please try again later.",
        }
