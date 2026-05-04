import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const ThemeToggle = () => {
  const location = useLocation();
  const [isDark, setIsDark] = useState(() => {
    // Check local storage first
    const savedTheme = localStorage.getItem('app-theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // Check system preference
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // If we are on the Home page, always force Light Mode
    if (location.pathname === '/') {
      document.documentElement.removeAttribute('data-theme');
      return;
    }

    // Otherwise, respect the user's saved preference
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('app-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('app-theme', 'light');
    }
  }, [isDark, location.pathname]);

  if (location.pathname === '/teleprompter' || location.pathname === '/') {
    return null;
  }

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      style={{
        position: 'fixed',
        bottom: '2rem',
        left: '2rem',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: 'var(--bg-secondary)',
        color: 'var(--text-primary)',
        border: '1px solid var(--glass-border)',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 9999,
        transition: 'transform 0.2s ease',
      }}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      {isDark ? <Sun size={24} /> : <Moon size={24} />}
    </button>
  );
};

export default ThemeToggle;
