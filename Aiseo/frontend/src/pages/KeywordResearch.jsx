import React, { useEffect, useState } from "react";
import axios from "axios";

export default function KeywordResearch() {
  console.log("KeywordResearch RENDERED");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  const token = localStorage.getItem("token");

  // -----------------------------
  // Fetch keyword history
  // -----------------------------
 const fetchHistory = async () => {
  try {
    const res = await axios.get(
      " https://aiseo-dq1q.onrender.com/seo/history",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    
    console.log("HISTORY RESPONSE:", res.data); // 👈 ADD THIS
    setHistory(res.data);
  } catch (err) {
    console.error("Failed to load history", err);
  }
};


  useEffect(() => {
    fetchHistory();
  }, []);

  // -----------------------------
  // Keyword search
  // -----------------------------
  const handleSearch = async (kw = keyword) => {
    if (!kw) return;

    setLoading(true);
    setError(null);

    try {
      

      const res = await axios.post(
        " https://aiseo-dq1q.onrender.com/seo/keyword-research",
        { keyword: kw },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setKeyword(kw);
      setResult(res.data);
      fetchHistory(); // refresh history
    } catch (err) {
      setError("Failed to analyze keyword");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Keyword Research</h1>

      {/* Recent Searches */}
      <div className="mt-6">
  <h2 className="text-xl font-bold mb-3">Keyword History</h2>

  {history.length === 0 ? (
    <p>No history found</p>
  ) : (
    <ul className="space-y-3">
      {history.map((item) => (
        <li
          key={item.id}
          className="border rounded-lg p-4 flex justify-between"
        >
          <div>
            <p className="font-semibold">{item.keyword}</p>
            <p className="text-sm text-gray-500">
              Intent: {item.intent}
            </p>
          </div>

          <div className="text-right">
            <p>Volume: {item.search_volume}</p>
            <p>Difficulty: {item.difficulty}</p>
          </div>
        </li>
      ))}
    </ul>
  )}
</div>


      {/* Search Bar */}
      <div className="flex gap-4 mb-8">
        <input
          className="flex-1 border rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter a keyword (e.g. best laptops for students)"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button
          onClick={() => handleSearch()}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl text-lg hover:bg-blue-700 transition"
        >
          {loading ? "Analyzing..." : "Search"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="bg-white rounded-2xl shadow p-8 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">{result.keyword}</h2>
            <span className="px-4 py-1 text-sm rounded-full bg-blue-100 text-blue-700">
              {result.intent}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Metric title="Search Volume" value={result.search_volume} />
            <Metric title="Difficulty" value={result.difficulty} />
            <Metric title="Intent" value={result.intent} />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Related Keywords</h3>
            <div className="flex flex-wrap gap-3">
              {result.related_keywords.map((k, i) => (
                <span
                  key={i}
                  className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 cursor-pointer"
                >
                  {k}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// -----------------------------
// Metric Card
// -----------------------------
function Metric({ title, value }) {
  return (
    <div className="bg-gray-50 rounded-xl p-6 text-center shadow-sm">
      <p className="text-gray-500 text-sm mb-2">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
