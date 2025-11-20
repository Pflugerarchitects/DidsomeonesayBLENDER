import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../theme/ThemeProvider';

const ThemeToggle = () => {
  const { mode, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className="header-icon-button" aria-label="Toggle theme" title="Toggle theme">
      {mode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
};

export default ThemeToggle;
