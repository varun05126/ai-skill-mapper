import React, { useState } from "react";
import axios from "axios";
import { generateSkillsWithAssistant } from "./services/groqService";

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
      const res = await generateSkillsWithAssistant(company, jobRole);
      setResult(res);
    } catch (err) {
      console.error("Frontend Error:", err);
      setError("Error generating results. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto font-sans">
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
        <div className="mt-8 space-y-6">
          <div className="bg-blue-50 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">Required Technical Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.skills && result.skills.map((skill, idx) => (
                <div key={idx} className="bg-white p-4 rounded border-l-4 border-blue-600 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-800">{skill.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{skill.description}</p>
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{skill.category}</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">{skill.level}</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-700">⭐ Importance: {skill.importance}/5</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-green-700 mb-4">📚 Recommended Learning Path</h2>
            <ol className="list-decimal list-inside space-y-2">
              {result.learning_path && result.learning_path.map((skill, idx) => (
                <li key={idx} className="text-gray-800 text-lg">{skill}</li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
