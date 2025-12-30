import axios from 'axios';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

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
    if (!GROQ_API_KEY) {
      console.warn('Using default skills – API key not configured');
      return DEFAULT_SKILLS;
    }

    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'system',
            content: 'You are an expert career advisor. Return ONLY valid JSON with no markdown or explanations.'
          },
          {
            role: 'user',
            content: `List 8 top skills for a ${jobRole} at ${company}. Return ONLY JSON: {"skills": [{"name": "skill", "category": "category", "level": "level", "importance": 5, "description": "desc"}], "learning_path": ["skill1", "skill2"]}`
          }
        ],
        temperature: 0.3,
        max_tokens: 1024
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
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
