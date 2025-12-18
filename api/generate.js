export default async function handler(req, res) {
  try {
    const { company, jobRole } = await req.json();

    const prompt = `
You are an AI that identifies industry skill requirements, detects gaps in school education,
and generates vocational training modules.

Input:
Industry: ${company}
Job Role: ${jobRole}

Output ONLY JSON:
{
  "industrySkills": [],
  "schoolGaps": [],
  "bridgeModules": [],
  "expectedStudentOutcomes": [],
  "flow": "Industry → Gaps → Training Modules → School → Students → Skill Certification"
}
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://example.com",
        "X-Title": "Skill Mapper"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content || "";

    const clean = text.replace(/```json/g,'').replace(/```/g,'').trim();
    res.status(200).json(JSON.parse(clean));

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
