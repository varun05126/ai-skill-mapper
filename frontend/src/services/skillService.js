cat > src/services/skillService.js << 'EOF'
const STORAGE_KEY = 'ai-skill-mapper-skills';

export const skillService = {
  saveSkills: (skills) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(skills));
      return true;
    } catch (error) {
      console.error('Error saving skills:', error);
      return false;
    }
  },

  getSkills: () => {
    try {
      const skills = localStorage.getItem(STORAGE_KEY);
      return skills ? JSON.parse(skills) : [];
    } catch (error) {
      console.error('Error retrieving skills:', error);
      return [];
    }
  },

  clearSkills: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      return false;
    }
  },

  filterByCategory: (category) => {
    const skills = skillService.getSkills();
    return skills.filter(s => s.category === category);
  },

  sortByImportance: () => {
    const skills = skillService.getSkills();
    return [...skills].sort((a, b) => (b.importance || 0) - (a.importance || 0));
  }
};

export default skillService;
EOF
