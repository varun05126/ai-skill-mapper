import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [company, setCompany] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [result, setResult] = useState(null);

  const generate = async () => {
    const res = await axios.post("/api/generate", { company, jobRole });
    setResult(res.data);
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
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Generate
        </button>
      </div>

      {result && (
        <pre className="mt-6 p-4 bg-white shadow rounded text-sm">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}