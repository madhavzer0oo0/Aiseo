import os
import json
import re
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

MODEL_NAME = "llama-3.1-8b-instant"


def extract_json(text: str):
    match = re.search(r"\{[\s\S]*\}", text)
    if not match:
        return None
    try:
        return json.loads(match.group())
    except json.JSONDecodeError:
        return None


def analyze_keyword(keyword: str) -> dict:
    prompt = f"""
You are an SEO expert.

Analyze the keyword: "{keyword}"

Return ONLY valid JSON in this format:
{{
  "intent": "Informational | Navigational | Commercial Investigation | Transactional",
  "content_type": "Guide | Comparison | Review | Listicle | How-To",
  "related_keywords": ["string"],
  "keyword_clusters": {{
    "Buying Intent": ["string"],
    "Informational": ["string"],
    "Long-tail": ["string"]
  }}
}}
"""

    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=400,
    )

    return extract_json(response.choices[0].message.content)
