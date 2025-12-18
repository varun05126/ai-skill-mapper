import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [company, setCompany] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    if (!company.trim() || !jobRole.trim()) {
      setError("Please enter both company and job role.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await axios.post(
        "https://ai-skill-mapper.vercel.app/api/generate",
        { company, jobRole },
        { headers: { "Content-Type": "application/json" } }
      );

      setResult(res.data);
    } catch (err) {
      console.error("Frontend Error:", err);
      setError("Error generating results. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto font-sans">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
        🏫 Industry–School Skill Mapper
      </h1>

      <div className="space-y-4 bg-gray-100 p-5 rounded-lg shadow">
        <input
          className="w-full p-2 border rounded"
          placeholder="🏭 Enter Industry / Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />

        <input
          className="w-full p-2 border rounded"
          placeholder="👔 Enter Job Role"
          value={jobRole}
          onChange={(e) => setJobRole(e.target.value)}
        />

        <button
          onClick={generate}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
        >
          {loading ? "Generating…" : "Generate"}
        </button>
      </div>

      {error && (
        <p className="text-red-600 mt-4 text-center">{error}</p>
      )}

      {result && (
        <pre className="mt-6 p-4 bg-white shadow rounded text-sm overflow-auto">
{JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}