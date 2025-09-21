
export const validationRules = {
  required: (value) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return 'This field is required';
    }
    return null;
  },

  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return null;
  },

  phone: (value) => {
    const phoneRegex = /^[\+]?[1-9][\d]{9,15}$/;
    if (!phoneRegex.test(value.replace(/\s+/g, ''))) {
      return 'Please enter a valid phone number';
    }
    return null;
  },

  minLength: (minLength) => (value) => {
    if (value.length < minLength) {
      return `Must be at least ${minLength} characters long`;
    }
    return null;
  },

  maxLength: (maxLength) => (value) => {
    if (value.length > maxLength) {
      return `Must be no more than ${maxLength} characters long`;
    }
    return null;
  },

  pan: (value) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(value)) {
      return 'Please enter a valid PAN number (e.g., ABCDE1234F)';
    }
    return null;
  },

  amount: (value) => {
    const amount = parseFloat(value);
    if (isNaN(amount) || amount <= 0) {
      return 'Please enter a valid amount greater than 0';
    }
    return null;
  },

  url: (value) => {
    try {
      new URL(value);
      return null;
    } catch {
      return 'Please enter a valid URL';
    }
  },
};

export const validateForm = (data, rules) => {
  const errors = {};

  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = data[field];

    for (const rule of fieldRules) {
      const error = rule(value);
      if (error) {
        errors[field] = error;
        break; // Stop at first error
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
