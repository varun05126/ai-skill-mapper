// HuggingFace Inference API - Free Tier with Mistral Model
// Fast, reliable, no authentication required for basic tier

const HF_API_KEY = import.meta.env.VITE_HF_API_KEY || 'free-tier';
const HF_MODEL = 'mistralai/Mistral-7B-Instruct-v0.1';
const HF_API_URL = `https://api-inference.huggingface.co/models/${HF_MODEL}`;

const DEFAULT_SKILLS = {
  skills: [
    { name: 'React', category: 'frontend', level: 'Intermediate', importance: 5, description: 'Build interactive UIs' },
    { name: 'Node.js', category: 'backend', level: 'Intermediate', importance: 5, description: 'Server-side JavaScript' },
    { name: 'JavaScript', category: 'programming', level: 'Advanced', importance: 5, description: 'Core programming language' },
    { name: 'REST APIs', category: 'backend', level: 'Intermediate', importance: 4, description: 'Web service design' },
    { name: 'SQL', category: 'database', level: 'Intermediate', importance: 4, description: 'Database management' },
    { name: 'Git', category: 'devops', level: 'Intermediate', importance: 4, description: 'Version control' },
    { name: 'HTML/CSS', category: 'frontend', level: 'Advanced', importance: 4, description: 'Web fundamentals' },
    { name: 'Docker', category: 'devops', level: 'Beginner', importance: 3, description: 'Containerization' }
  ],
  learning_path: ['JavaScript', 'React', 'Node.js', 'SQL', 'REST APIs']
};

export const generateSkillsWithAssistant = async (company, jobRole) => {
  try {
    const prompt = `You are a career advisor expert. Analyze the following job requirement and suggest exactly 6 specific technical skills needed. Return ONLY valid JSON with no markdown or explanation:\n\nCompany: ${company}\nJob Role: ${jobRole}\n\nReturn this exact JSON structure (no other text):\n{"skills": [{"name": "Skill", "category": "programming/frontend/backend/database/devops", "level": "Beginner/Intermediate/Advanced", "importance": 5, "description": "Brief description"}], "learning_path": ["Skill1", "Skill2", "Skill3"]}`;

    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': HF_API_KEY !== 'free-tier' ? `Bearer ${HF_API_KEY}` : undefined,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7,
          top_p: 0.9
        }
      })
    });

    if (!response.ok) {
      console.warn('API call failed, using default skills');
      return DEFAULT_SKILLS;
    }

    const data = await response.json();
    const text = Array.isArray(data) ? data[0]?.generated_text || '' : data?.generated_text || '';
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.warn('JSON parse failed');
        return DEFAULT_SKILLS;
      }
    }
    
    return DEFAULT_SKILLS;
  } catch (error) {
    console.error('Error generating skills:', error);
    return DEFAULT_SKILLS;
  }
};
