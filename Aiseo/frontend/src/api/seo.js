export const keywordResearch = async (keyword, token) => {
  const res = await fetch("http://127.0.0.1:8000/seo/keyword-research", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ keyword }),
  });

  if (!res.ok) throw new Error("Failed to fetch keyword data");
  return res.json();
};
