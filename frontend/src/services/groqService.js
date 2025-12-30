// Fast Skill Mapper using Replicate API (Free Tier) - Ultra-fast responses
// Replicate provides free inference on many open-source models

const REPLICATE_API_KEY = import.meta.env.VITE_REPLICATE_API_KEY;
const REPLICATE_API_URL = 'https://api.replicate.com/v1/predictions';

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

// Skill mappings database for instant responses
const COMPANY_ROLE_SKILLS = {
  'amazon_backend_engineer': {
    skills: [
      { name: 'Java', category: 'programming', level: 'Advanced', importance: 5, description: 'Primary backend language' },
      { name: 'AWS', category: 'devops', level: 'Advanced', importance: 5, description: 'Amazon cloud services' },
      { name: 'Database Design', category: 'database', level: 'Advanced', importance: 5, description: 'Scale databases' },
      { name: 'Python', category: 'programming', level: 'Intermediate', importance: 4, description: 'Scripting & automation' },
      { name: 'Microservices', category: 'backend', level: 'Advanced', importance: 5, description: 'Service architecture' },
      { name: 'System Design', category: 'backend', level: 'Advanced', importance: 5, description: 'Large scale systems' }
    ],
    learning_path: ['Java', 'AWS', 'Database Design', 'Microservices', 'System Design']
  },
  'google_frontend_engineer': {
    skills: [
      { name: 'React', category: 'frontend', level: 'Advanced', importance: 5, description: 'UI library' },
      { name: 'TypeScript', category: 'programming', level: 'Advanced', importance: 5, description: 'Typed JavaScript' },
      { name: 'Web Performance', category: 'frontend', level: 'Advanced', importance: 5, description: 'Fast loading' },
      { name: 'CSS', category: 'frontend', level: 'Advanced', importance: 4, description: 'Styling' },
      { name: 'Testing', category: 'devops', level: 'Advanced', importance: 4, description: 'Jest, Cypress' },
      { name: 'Accessibility', category: 'frontend', level: 'Intermediate', importance: 4, description: 'A11y standards' }
    ],
    learning_path: ['React', 'TypeScript', 'Web Performance', 'Testing', 'Accessibility']
  },
  'microsoft_fullstack_engineer': {
    skills: [
      { name: 'C#/.NET', category: 'programming', level: 'Advanced', importance: 5, description: 'Microsoft stack' },
      { name: 'Azure', category: 'devops', level: 'Advanced', importance: 5, description: 'Cloud platform' },
      { name: 'React/Angular', category: 'frontend', level: 'Advanced', importance: 5, description: 'Frontend frameworks' },
      { name: 'SQL Server', category: 'database', level: 'Intermediate', importance: 4, description: 'Database' },
      { name: 'DevOps', category: 'devops', level: 'Intermediate', importance: 4, description: 'CI/CD pipelines' }
    ],
    learning_path: ['C#/.NET', 'Azure', 'React', 'SQL Server', 'DevOps']
  }
};

export const generateSkillsWithAssistant = async (company, jobRole) => {
  try {
    // Ultra-fast: Check if we have cached response for this company/role combo
    const key = `${company.toLowerCase().replace(/\s+/g, '_')}_${jobRole.toLowerCase().replace(/\s+/g, '_')}`;
    if (COMPANY_ROLE_SKILLS[key]) {
      return COMPANY_ROLE_SKILLS[key];
    }

    // If Replicate API is available, use it for custom queries
    if (REPLICATE_API_KEY) {
      try {
        const response = await fetch(REPLICATE_API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${REPLICATE_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            version: 'e5582ad07a78cdff1665260639e46a513409d3a3bdc4fc550b1a974a9ef063e',
            input: {
              prompt: `List key skills for ${company} ${jobRole} as JSON only: {"skills": [{"name": "", "category": "", "level": "", "importance": 5, "description": ""}], "learning_path": []}`
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const output = data.output?.join('') || '';
          const jsonMatch = output.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
          }
        }
      } catch (apiError) {
        console.warn('API timeout, using cached defaults');
      }
    }

    // Fast fallback: Return appropriate default based on role
    if (jobRole.toLowerCase().includes('frontend')) {
      return COMPANY_ROLE_SKILLS['google_frontend_engineer'];
    } else if (jobRole.toLowerCase().includes('backend')) {
      return COMPANY_ROLE_SKILLS['amazon_backend_engineer'];
    } else if (jobRole.toLowerCase().includes('fullstack')) {
      return COMPANY_ROLE_SKILLS['microsoft_fullstack_engineer'];
    }

    return DEFAULT_SKILLS;
  } catch (error) {
    console.error('Error generating skills:', error);
    return DEFAULT_SKILLS;
  }
};
