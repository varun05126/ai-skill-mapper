import axios from 'axios';

const COMET_API_KEY = import.meta.env.VITE_PPLX_API_KEY;
const COMET_API_URL = 'https://api.perplexity.ai/chat/completions';

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
    if (!COMET_API_KEY) {
      console.warn('Using default skills - API key not configured');
      return DEFAULT_SKILLS;
    }

    const response = await axios.post(
      COMET_API_URL,
      {
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content:
              'You are an expert career advisor. Return ONLY valid JSON with no markdown or explanations.'
          },
          {
            role: 'user',
            content: `List 8 top skills for a ${jobRole} at ${company}. Return ONLY JSON: {"skills": [{"name": "skill", "category": "frontend/backend/database/devops/programming", "level": "Beginner/Intermediate/Advanced", "importance": 1-5, "description": "brief"}], "learning_path": ["skill1", "skill2"]}`
          }
        ],
        temperature: 0.3,
        max_tokens: 1024
      },
      {
        headers: {
          Authorization: `Bearer ${COMET_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content.trim();

    let jsonStr = content;
    if (content.includes('```')) {
      jsonStr = content
        .split('```')[1]
        .replace('json', '')
        .trim();
    }

    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Assistant API Error:', error.message);
    return DEFAULT_SKILLS;
  }
};
