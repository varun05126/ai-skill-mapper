export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { company, jobRole } = req.body;

    const prompt = `
You are an AI that identifies industry skill requirements, detects gaps in school education,
and generates vocational training modules.

Industry: ${company}
Job Role: ${jobRole}

Return ONLY JSON with:
- industrySkills
- schoolGaps
- bridgeModules
- expectedStudentOutcomes
- flow
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content || "";

    const clean = text.replace(/```json/g, "").replace(/```/g, "").trim();

    return res.status(200).json(JSON.parse(clean));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}