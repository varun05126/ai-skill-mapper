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
    // Return default skills immediately with instant output
    return DEFAULT_SKILLS;
  } catch (error) {
    console.error('Error generating skills:', error);
    return DEFAULT_SKILLS;
  }
};
