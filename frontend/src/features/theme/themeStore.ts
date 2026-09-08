import { create } from 'zustand';

export type ThemeMode = 'dark' | 'light';

interface ThemeState {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const STORAGE_KEY = 'strata_theme_mode';

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    // Ignore storage errors
  }
  return 'dark';
}

function applyThemeToDocument(theme: ThemeMode) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
    root.setAttribute('data-theme', 'dark');
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
    root.setAttribute('data-theme', 'light');
  }
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Ignore storage errors
  }
}

// Initial sync on load
if (typeof window !== 'undefined') {
  const initial = getInitialTheme();
  applyThemeToDocument(initial);
}

export const useThemeStore = create<ThemeState>()((set, get) => ({
  theme: typeof window !== 'undefined' ? getInitialTheme() : 'dark',
  setTheme: (theme: ThemeMode) => {
    applyThemeToDocument(theme);
    set({ theme });
  },
  toggleTheme: () => {
    const current = get().theme;
    const next: ThemeMode = current === 'dark' ? 'light' : 'dark';
    applyThemeToDocument(next);
    set({ theme: next });
  },
}));
