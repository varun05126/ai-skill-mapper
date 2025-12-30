cat > src/utils/validation.js << 'EOF'
export const validators = {
  required: (value) => {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return !!value;
  },

  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  minLength: (value, min) => {
    return value?.length >= min;
  },

  maxLength: (value, max) => {
    return value?.length <= max;
  },

  numeric: (value) => {
    return !isNaN(value) && value !== '';
  }
};

export const validateForm = (formData, rules) => {
  const errors = {};
  Object.keys(rules).forEach((field) => {
    const fieldRules = rules[field];
    for (const rule of fieldRules) {
      if (!rule.validate(formData[field])) {
        errors[field] = rule.message;
        break;
      }
    }
  });
  return errors;
};
EOF
