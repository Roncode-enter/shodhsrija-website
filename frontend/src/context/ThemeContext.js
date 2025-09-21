
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('morning');

  useEffect(() => {
    const savedTheme = localStorage.getItem('shodhsrija-theme') || 'morning';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme) => {
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('shodhsrija-theme', newTheme);
  };

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const value = {
    theme,
    changeTheme,
    themes: {
      morning: { name: 'Morning', icon: '☀️' },
      evening: { name: 'Evening', icon: '🌅' },
      night: { name: 'Night', icon: '🌙' },
    },
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
