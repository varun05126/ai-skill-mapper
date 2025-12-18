export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { company, jobRole } = req.body;

    const prompt = `
You are an AI. Return ONLY valid JSON. No text outside JSON.

Requirements:
- No explanation.
- No backticks.
- No comments.
- Only JSON object.

JSON Format:
{
  "industrySkills": [],
  "schoolGaps": [],
  "bridgeModules": [],
  "expectedStudentOutcomes": [],
  "flow": ""
}

Generate the JSON for:
Industry = ${company}
Job Role = ${jobRole}
`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0
      })
    });

    const json = await response.json();
    let raw = json?.choices?.[0]?.message?.content || "";

    // Remove accidental wrappers
    raw = raw.replace(/```json|```/g, "").trim();

    // Try parsing safely
    const parsed = JSON.parse(raw);

    return res.status(200).json(parsed);

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({ error: "Server error: " + err.message });
  }
}
