import os
from serpapi import GoogleSearch

SERPAPI_KEY = os.getenv("SERPAPI_KEY")


def get_serp_data(keyword: str) -> dict:
    """
    Fetch Google SERP data for a keyword
    """
    params = {
        "engine": "google",
        "q": keyword,
        "api_key": SERPAPI_KEY,
        "num": 10,
    }

    search = GoogleSearch(params)
    results = search.get_dict()

    related_searches = [
        item["query"]
        for item in results.get("related_searches", [])
        if "query" in item
    ]

    people_also_ask = [
        item["question"]
        for item in results.get("people_also_ask", [])
        if "question" in item
    ]

    return {
    "related_searches": related_searches,
    "people_also_ask": people_also_ask,
    "organic_results": results.get("organic_results", []),
    "ads": results.get("ads", []),
}

def estimate_metrics(serp_data: dict) -> dict:
    """
    Estimate keyword difficulty & volume heuristically
    """
    ads = len(serp_data.get("ads", []))
    paa = len(serp_data.get("people_also_ask", []))
    organic = len(serp_data.get("organic_results", []))

    difficulty = min(100, 30 + ads * 15 + paa * 5)
    volume = 1000 + organic * 500 + paa * 300

    return {
        "difficulty": difficulty,
        "search_volume": volume
    }
