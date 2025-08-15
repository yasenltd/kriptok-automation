import { DarkTheme } from '@/theme/DarkTheme';
import { LightTheme } from '@/theme/LightTheme';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Scheme = 'light' | 'dark';

type ThemeContextType = {
  theme: typeof DarkTheme | typeof LightTheme;
  colorScheme: Scheme;
  toggleTheme: () => void;
  setTheme: (scheme: Scheme) => void;
  hydrated: boolean;
};

const THEME_KEY = 'app.theme.scheme';
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [scheme, setScheme] = useState<Scheme>('dark');
  const [hydrated, setHydrated] = useState(false);

  const getTheme = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem(THEME_KEY);
      if (saved === 'light' || saved === 'dark') setScheme(saved);
    } catch (err) {
      console.error(err);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    getTheme();
  }, []);

  const persist = useCallback(async (s: Scheme) => {
    try {
      await AsyncStorage.setItem(THEME_KEY, s);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const toggleTheme = useCallback(
    () =>
      setScheme(prev => {
        const next: Scheme = prev === 'light' ? 'dark' : 'light';
        persist(next);
        return next;
      }),
    [persist],
  );

  const setTheme = useCallback(
    (s: Scheme) => {
      setScheme(s);
      persist(s);
    },
    [persist],
  );

  const value = useMemo<ThemeContextType>(
    () => ({
      theme: scheme === 'light' ? LightTheme : DarkTheme,
      colorScheme: scheme,
      toggleTheme,
      setTheme,
      hydrated,
    }),
    [scheme, toggleTheme, setTheme, hydrated],
  );

  if (!hydrated) return null;

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme() must be used within a ThemeProvider');
  return ctx;
};
