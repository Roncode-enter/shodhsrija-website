
import React from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const ThemeToggle = ({ theme, onThemeChange }) => {
  const themes = [
    { id: 'morning', name: 'Morning', icon: SunIcon, color: 'bg-yellow-400' },
    { id: 'evening', name: 'Evening', icon: SunIcon, color: 'bg-orange-400' },
    { id: 'night', name: 'Night', icon: MoonIcon, color: 'bg-purple-400' },
  ];

  return (
    <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-full p-1">
      {themes.map((themeOption) => {
        const Icon = themeOption.icon;
        return (
          <button
            key={themeOption.id}
            onClick={() => onThemeChange(themeOption.id)}
            className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${
              theme === themeOption.id
                ? `${themeOption.color} text-white shadow-md`
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
            title={themeOption.name}
          >
            <Icon className="w-4 h-4" />
          </button>
        );
      })}
    </div>
  );
};

export default ThemeToggle;
