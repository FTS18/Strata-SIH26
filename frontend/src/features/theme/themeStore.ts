import { create } from 'zustand';

export type ThemeMode = 'dark';

interface ThemeState {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

// Clean any previous light mode attributes immediately on import
if (typeof document !== 'undefined') {
  document.documentElement.classList.remove('light');
  document.documentElement.removeAttribute('data-theme');
  try {
    localStorage.removeItem('strata_theme_store');
  } catch {
    // Ignore storage errors
  }
}

export const useThemeStore = create<ThemeState>()((set) => ({
  theme: 'dark',
  setTheme: () => {
    set({ theme: 'dark' });
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('light');
      document.documentElement.removeAttribute('data-theme');
    }
  },
  toggleTheme: () => {
    // Light mode removed per user request; strictly dark mode
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('light');
      document.documentElement.removeAttribute('data-theme');
    }
  },
}));
