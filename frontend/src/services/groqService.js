// Ultra-fast instant skill generation - No API calls, pure cached responses

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

const SKILL_DATABASE = {
  amazon: {
    backend: { skills: [{ name: 'Java', category: 'programming', level: 'Advanced', importance: 5, description: 'Primary backend language' }, { name: 'AWS', category: 'devops', level: 'Advanced', importance: 5, description: 'Cloud platform' }, { name: 'Database Design', category: 'database', level: 'Advanced', importance: 5, description: 'Scale databases' }, { name: 'Python', category: 'programming', level: 'Intermediate', importance: 4, description: 'Scripting' }, { name: 'Microservices', category: 'backend', level: 'Advanced', importance: 5, description: 'Service architecture' }, { name: 'System Design', category: 'backend', level: 'Advanced', importance: 5, description: 'Large systems' }], learning_path: ['Java', 'AWS', 'Database Design', 'Microservices', 'System Design'] },
    frontend: { skills: [{ name: 'React', category: 'frontend', level: 'Advanced', importance: 5, description: 'UI library' }, { name: 'TypeScript', category: 'programming', level: 'Advanced', importance: 5, description: 'Type safety' }, { name: 'CSS', category: 'frontend', level: 'Advanced', importance: 4, description: 'Styling' }, { name: 'JavaScript', category: 'programming', level: 'Advanced', importance: 5, description: 'Core language' }, { name: 'Testing', category: 'devops', level: 'Intermediate', importance: 4, description: 'Quality assurance' }, { name: 'Web Performance', category: 'frontend', level: 'Advanced', importance: 4, description: 'Fast loading' }], learning_path: ['JavaScript', 'React', 'TypeScript', 'CSS', 'Testing'] },
    fullstack: { skills: [{ name: 'JavaScript', category: 'programming', level: 'Advanced', importance: 5, description: 'Full stack' }, { name: 'React', category: 'frontend', level: 'Advanced', importance: 5, description: 'Frontend UI' }, { name: 'Node.js', category: 'backend', level: 'Advanced', importance: 5, description: 'Backend' }, { name: 'SQL', category: 'database', level: 'Advanced', importance: 4, description: 'Databases' }, { name: 'AWS', category: 'devops', level: 'Intermediate', importance: 4, description: 'Cloud' }, { name: 'DevOps', category: 'devops', level: 'Intermediate', importance: 4, description: 'CI/CD' }], learning_path: ['JavaScript', 'React', 'Node.js', 'SQL', 'AWS', 'DevOps'] }
  },
  google: {
    backend: { skills: [{ name: 'Go', category: 'programming', level: 'Advanced', importance: 5, description: 'Google language' }, { name: 'Kubernetes', category: 'devops', level: 'Advanced', importance: 5, description: 'Container orchestration' }, { name: 'Python', category: 'programming', level: 'Advanced', importance: 5, description: 'Data & scripts' }, { name: 'Protocol Buffers', category: 'backend', level: 'Intermediate', importance: 4, description: 'Serialization' }, { name: 'Cloud Pub/Sub', category: 'devops', level: 'Intermediate', importance: 4, description: 'Messaging' }, { name: 'Spanner', category: 'database', level: 'Intermediate', importance: 4, description: 'Distributed DB' }], learning_path: ['Go', 'Python', 'Kubernetes', 'Cloud Pub/Sub', 'Spanner'] },
    frontend: { skills: [{ name: 'React', category: 'frontend', level: 'Advanced', importance: 5, description: 'UI library' }, { name: 'TypeScript', category: 'programming', level: 'Advanced', importance: 5, description: 'Typed JS' }, { name: 'Web Performance', category: 'frontend', level: 'Advanced', importance: 5, description: 'Speed' }, { name: 'CSS/SCSS', category: 'frontend', level: 'Advanced', importance: 4, description: 'Styling' }, { name: 'Testing', category: 'devops', level: 'Advanced', importance: 4, description: 'Jest, Cypress' }, { name: 'Accessibility', category: 'frontend', level: 'Intermediate', importance: 4, description: 'A11y' }], learning_path: ['React', 'TypeScript', 'Web Performance', 'CSS/SCSS', 'Testing'] },
    fullstack: { skills: [{ name: 'React', category: 'frontend', level: 'Advanced', importance: 5, description: 'Frontend' }, { name: 'Python', category: 'programming', level: 'Advanced', importance: 5, description: 'Backend' }, { name: 'Google Cloud', category: 'devops', level: 'Advanced', importance: 5, description: 'Infrastructure' }, { name: 'Firestore', category: 'database', level: 'Advanced', importance: 4, description: 'Database' }, { name: 'TypeScript', category: 'programming', level: 'Advanced', importance: 5, description: 'Strong typing' }, { name: 'DevOps', category: 'devops', level: 'Intermediate', importance: 4, description: 'Deployment' }], learning_path: ['React', 'Python', 'TypeScript', 'Google Cloud', 'Firestore'] }
  },
  microsoft: {
    backend: { skills: [{ name: 'C#', category: 'programming', level: 'Advanced', importance: 5, description: 'Main language' }, { name: 'Azure', category: 'devops', level: 'Advanced', importance: 5, description: 'Cloud' }, { name: 'SQL Server', category: 'database', level: 'Advanced', importance: 5, description: 'Database' }, { name: '.NET', category: 'programming', level: 'Advanced', importance: 5, description: 'Framework' }, { name: 'Entity Framework', category: 'backend', level: 'Advanced', importance: 4, description: 'ORM' }, { name: 'PowerShell', category: 'devops', level: 'Intermediate', importance: 4, description: 'Scripting' }], learning_path: ['C#', '.NET', 'SQL Server', 'Azure', 'Entity Framework'] },
    frontend: { skills: [{ name: 'TypeScript', category: 'programming', level: 'Advanced', importance: 5, description: 'Strong typing' }, { name: 'React', category: 'frontend', level: 'Advanced', importance: 5, description: 'UI library' }, { name: 'CSS', category: 'frontend', level: 'Advanced', importance: 4, description: 'Styling' }, { name: 'Azure DevOps', category: 'devops', level: 'Intermediate', importance: 4, description: 'CI/CD' }, { name: 'Testing', category: 'devops', level: 'Advanced', importance: 4, description: 'Quality' }, { name: 'Web Standards', category: 'frontend', level: 'Advanced', importance: 4, description: 'Best practices' }], learning_path: ['TypeScript', 'React', 'CSS', 'Azure DevOps', 'Testing'] },
    fullstack: { skills: [{ name: 'C#', category: 'programming', level: 'Advanced', importance: 5, description: '.NET backend' }, { name: 'React', category: 'frontend', level: 'Advanced', importance: 5, description: 'Frontend UI' }, { name: 'Azure', category: 'devops', level: 'Advanced', importance: 5, description: 'Cloud platform' }, { name: 'SQL Server', category: 'database', level: 'Advanced', importance: 4, description: 'Database' }, { name: 'TypeScript', category: 'programming', level: 'Advanced', importance: 5, description: 'Strong typing' }, { name: 'DevOps', category: 'devops', level: 'Intermediate', importance: 4, description: 'Pipelines' }], learning_path: ['C#', 'TypeScript', 'React', 'SQL Server', 'Azure'] }
  }
};

export const generateSkillsWithAssistant = async (company, jobRole) => {
  try {
    const companyKey = company.toLowerCase().trim();
    const roleKey = jobRole.toLowerCase().includes('full') ? 'fullstack' : 
                    jobRole.toLowerCase().includes('backend') ? 'backend' :
                    jobRole.toLowerCase().includes('frontend') ? 'frontend' : 'fullstack';
    
    // Return from database instantly
    if (SKILL_DATABASE[companyKey] && SKILL_DATABASE[companyKey][roleKey]) {
      return SKILL_DATABASE[companyKey][roleKey];
    }
    
    // Fallback based on role type
    if (roleKey === 'backend') {
      return SKILL_DATABASE.amazon?.backend || DEFAULT_SKILLS;
    } else if (roleKey === 'frontend') {
      return SKILL_DATABASE.google?.frontend || DEFAULT_SKILLS;
    } else {
      return SKILL_DATABASE.microsoft?.fullstack || DEFAULT_SKILLS;
    }
  } catch (error) {
    console.error('Error:', error);
    return DEFAULT_SKILLS;
  }
};
