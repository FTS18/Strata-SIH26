'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '@/features/theme/themeStore';

export interface ThemeToggleProps {
  showLabel?: boolean;
  className?: string;
  variant?: 'compact' | 'pill' | 'sidebar';
}

export function ThemeToggle({
  showLabel = false,
  className = '',
  variant = 'compact',
}: ThemeToggleProps) {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--surface-border)] bg-[var(--surface-panel)] opacity-50 ${className}`}
      />
    );
  }

  const isDark = theme === 'dark';

  if (variant === 'sidebar') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        className={`group flex h-9 items-center justify-center rounded-lg border border-[var(--surface-border)] bg-[var(--surface-panel)] text-[var(--text-secondary)] transition-all hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] cursor-pointer select-none active:scale-95 ${className}`}
      >
        <div className="flex items-center justify-center">
          {isDark ? (
            <Sun className="h-4 w-4 text-amber-400 transition-transform group-hover:rotate-45" />
          ) : (
            <Moon className="h-4 w-4 text-blue-600 transition-transform group-hover:-rotate-12" />
          )}
        </div>
        {showLabel && (
          <span className="text-xs font-semibold pl-2">
            {isDark ? 'Light Theme' : 'Dark Theme'}
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`group relative flex h-7 items-center justify-center gap-1.5 rounded-md border border-[var(--surface-border)] bg-[var(--surface-panel)] px-2 text-[11px] font-mono font-semibold text-[var(--text-secondary)] transition-all hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] cursor-pointer select-none shadow-sm active:scale-95 ${className}`}
    >
      <span className="flex items-center justify-center">
        {isDark ? (
          <Sun className="h-3.5 w-3.5 text-amber-400 transition-transform group-hover:rotate-45" />
        ) : (
          <Moon className="h-3.5 w-3.5 text-blue-600 transition-transform group-hover:-rotate-12" />
        )}
      </span>
      {showLabel && (
        <span className="truncate">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
}
