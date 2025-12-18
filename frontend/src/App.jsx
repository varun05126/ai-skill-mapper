import { useState } from 'react';
import axios from 'axios';

export default function App() {
  const [company, setCompany] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [data, setData] = useState(null);
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
    console.error("Frontend error:", err);
    setError("Something went wrong. Please try again.");
  }

  setLoading(false);
};

  return (
    <div className="p-6 max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-xl">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">
        Industry–School Skill Mapper
      </h1>

      <div className="space-y-4">
        <input
          className="w-full p-3 border rounded"
          placeholder="🏭 Enter company name"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />

        <input
          className="w-full p-3 border rounded"
          placeholder="👔 Enter job role"
          value={jobRole}
          onChange={(e) => setJobRole(e.target.value)}
        />

        <button
          onClick={generate}
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
        >
          {loading ? "Generating…" : "Generate"}
        </button>
      </div>

      {error && (
        <p className="text-red-600 mt-4 text-center">{error}</p>
      )}

      {data && (
        <pre className="mt-6 bg-gray-100 p-4 rounded text-sm overflow-auto">
{JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}