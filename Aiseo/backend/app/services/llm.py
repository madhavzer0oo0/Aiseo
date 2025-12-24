import os
import json
import re
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

MODEL_NAME = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")


def safe_extract_json(text: str) -> dict:
    """
    Extract JSON object from LLM output safely.
    Returns None if not found or invalid.
    """
    if not text or not text.strip():
        return None

    match = re.search(r"\{[\s\S]*\}", text)
    if not match:
        return None

    try:
        return json.loads(match.group())
    except json.JSONDecodeError:
        return None


def generate_blog(keyword: str, tone: str, length: int) -> dict:
    prompt = f"""
You are an expert SEO content writer.

IMPORTANT RULES:
- Respond with ONLY valid JSON
- Do NOT add explanations
- Do NOT add markdown outside JSON
- Do NOT wrap in ``` blocks

JSON FORMAT:
{{
  "title": "string",
  "meta_description": "string",
  "outline": ["string"],
  "content": "markdown formatted blog"
}}

Write a {length}-word SEO-optimized blog about "{keyword}".
Tone: {tone}.
"""

    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {"role": "system", "content": "You output strict JSON only."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.6,
        max_tokens=1600,
    )

    raw_text = response.choices[0].message.content
    parsed = safe_extract_json(raw_text)

    if not parsed:
        raise ValueError(f"Invalid LLM JSON output: {raw_text}")

    return parsed
