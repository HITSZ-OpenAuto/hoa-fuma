'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`w-9 h-9 rounded-lg border border-fd-border bg-fd-secondary/30 ${className}`}
      />
    );
  }

  const cycleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('system');
    else setTheme('dark');
  };

  return (
    <button
      type="button"
      onClick={cycleTheme}
      className={`inline-flex items-center justify-center w-9 h-9 rounded-lg border border-fd-border bg-fd-card text-fd-card-foreground hover:bg-fd-accent hover:text-fd-accent-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-fd-ring ${className}`}
      title={`Theme: ${theme || 'system'} (Click to switch)`}
      aria-label="Toggle color theme"
    >
      {theme === 'dark' && <Moon className="w-4 h-4 text-indigo-400" />}
      {theme === 'light' && <Sun className="w-4 h-4 text-amber-500" />}
      {theme === 'system' && <Monitor className="w-4 h-4 text-fd-muted-foreground" />}
    </button>
  );
}
