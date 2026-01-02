import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../components/Authcontext";
import Header from "../components/Header";
import { keywordResearch } from "../api/seo";
import axios from "axios";

export default function DashBoard() {
  const { user, isAuthenticated } = useAuth();

  // tool control
  const [activeTool, setActiveTool] = useState("dashboard");

  // keyword research state
  const [keyword, setKeyword] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // blog writer state
  const [blog, setBlog] = useState(null);
  const [blogLoading, setBlogLoading] = useState(false);
  const [tone, setTone] = useState("informative");
  const [length, setLength] = useState(800);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  /* ------------------------------
     Keyword History
  ------------------------------ */
  const fetchHistory = async () => {
    try {
      const res = await axios.get(" https://aiseo-dq1q.onrender.com/seo/history", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch history");
    }
  };

  /* ------------------------------
     Keyword Research
  ------------------------------ */
  const handleSearch = async () => {
    if (!keyword) return;
    setLoading(true);
    try {
      const data = await keywordResearch(
        keyword,
        localStorage.getItem("token")
      );
      setResult(data);
      fetchHistory();
    } catch (err) {
      alert("Failed to fetch keyword data");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------
     Blog Writer (MOCK)
  ------------------------------ */
  const handleBlogGenerate = async () => {
    if (!keyword) return;
    setBlogLoading(true);

    try {
      const res = await axios.post(
        " https://aiseo-dq1q.onrender.com/seo/blog-writer",
        { keyword, tone, length },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setBlog(res.data);
    } catch (err) {
      alert("Failed to generate blog");
    } finally {
      setBlogLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:block">
        <div className="p-6 text-2xl font-bold text-blue-600">AISEO</div>

        <nav className="px-4 space-y-3 text-gray-700">
          <p className="text-xs uppercase text-gray-400">Tools</p>

          <button
            onClick={() => setActiveTool("dashboard")}
            className={`block w-full text-left hover:text-blue-600 ${
              activeTool === "dashboard" ? "text-blue-600 font-semibold" : ""
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => {
              setActiveTool("keyword");
              fetchHistory();
            }}
            className={`block w-full text-left hover:text-blue-600 ${
              activeTool === "keyword" ? "text-blue-600 font-semibold" : ""
            }`}
          >
            Keyword Research
          </button>

          <button
            onClick={() => setActiveTool("blog")}
            className={`block w-full text-left hover:text-blue-600 ${
              activeTool === "blog" ? "text-blue-600 font-semibold" : ""
            }`}
          >
            Blog Writer
          </button>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1">
        <Header />

        {/* Dashboard */}
        {activeTool === "dashboard" && (
          <div className="max-w-7xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-2">
              Hello {user?.email?.split("@")[0]} 👋
            </h1>
            <p className="text-gray-600 mb-6">
              What would you like to create today?
            </p>
          </div>
        )}

        {/* Keyword Research */}
        {activeTool === "keyword" && (
          <div className="max-w-7xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">Keyword Research</h1>

            <div className="flex gap-4 mb-8">
              <input
                className="flex-1 border rounded-xl px-4 py-3"
                placeholder="Enter a keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <button
                onClick={handleSearch}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl"
              >
                {loading ? "Analyzing..." : "Search"}
              </button>
            </div>

            {result && (
              <div className="bg-white rounded-xl shadow p-6 mb-10">
                <h2 className="text-xl font-semibold mb-4">
                  {result.keyword}
                </h2>

                <div className="grid grid-cols-3 gap-6 mb-6">
                  <Metric title="Search Volume" value={result.search_volume} />
                  <Metric title="Difficulty" value={result.difficulty} />
                  <Metric title="Intent" value={result.intent} />
                </div>

                <ul className="list-disc ml-6">
                  {result.related_keywords.map((k, i) => (
                    <li key={i}>{k}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* History */}
            <h2 className="text-xl font-semibold mb-4">Recent Searches</h2>
            {history.length === 0 ? (
              <p>No history yet</p>
            ) : (
              <ul className="space-y-3">
                {history.map((item) => (
                  <li
                    key={item.id}
                    onClick={() => {
                      setKeyword(item.keyword);
                      handleSearch();
                    }}
                    className="bg-white border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                  >
                    {item.keyword}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Blog Writer */}
        {activeTool === "blog" && (
          <div className="max-w-7xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">AI Blog Writer</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <input
                className="border rounded-lg p-3"
                placeholder="Enter keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />

              <select
                className="border rounded-lg p-3"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              >
                <option value="informative">Informative</option>
                <option value="professional">Professional</option>
                <option value="marketing">Marketing</option>
              </select>

              <select
                className="border rounded-lg p-3"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
              >
                <option value={500}>500 words</option>
                <option value={800}>800 words</option>
                <option value={1200}>1200 words</option>
              </select>
            </div>

            <button
              onClick={handleBlogGenerate}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl"
            >
              {blogLoading ? "Generating..." : "Generate Blog"}
            </button>

            {blog && (
              <div className="mt-10 bg-white rounded-xl shadow p-8 space-y-6">
                <h2 className="text-2xl font-bold">{blog.title}</h2>
                <p className="italic text-gray-600">
                  {blog.meta_description}
                </p>

                <ul className="list-disc ml-6">
                  {blog.outline.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>

                <div className="whitespace-pre-line">{blog.content}</div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

/* Helpers */

function Metric({ title, value }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 text-center">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
