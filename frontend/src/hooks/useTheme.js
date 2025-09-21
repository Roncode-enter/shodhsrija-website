import { useState, useEffect } from 'react';

const THEME_KEY = 'shodhsrija-theme';

export const useTheme = () => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem(THEME_KEY) || 'morning'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
  };

  return [theme, toggleTheme];
};
