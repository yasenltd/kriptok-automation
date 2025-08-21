import { DarkTheme } from '@/theme/DarkTheme';
import { LightTheme } from '@/theme/LightTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type Scheme = 'light' | 'dark';

type ThemeContextType = {
  theme: typeof DarkTheme | typeof LightTheme;
  invertedTheme: typeof DarkTheme | typeof LightTheme;
  colorScheme: Scheme;
  toggleTheme: () => void;
  setTheme: (scheme: Scheme) => void;
  hydrated: boolean;
};

const THEME_KEY = 'app.theme.scheme';
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ inverted?: boolean; children: ReactNode }> = ({
  inverted = false,
  children,
}) => {
  const parentContext = useContext(ThemeContext);

  if (parentContext) {
    const value = useMemo<ThemeContextType>(() => {
      return {
        ...parentContext,
        theme: inverted ? parentContext.invertedTheme : parentContext.theme,
        invertedTheme: inverted ? parentContext.theme : parentContext.invertedTheme,
      };
    }, [parentContext, inverted]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
  }

  const [scheme, setScheme] = useState<Scheme>('light' as Scheme);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_KEY);
        if (saved === 'light' || saved === 'dark') setScheme(saved);
      } catch (err) {
        console.error(err);
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  const persist = useCallback(async (s: Scheme) => {
    try {
      await AsyncStorage.setItem(THEME_KEY, s);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setScheme(prev => {
      const next: Scheme = prev === 'light' ? 'dark' : 'light';
      persist(next);
      return next;
    });
  }, [persist]);

  const setTheme = useCallback(
    (s: Scheme) => {
      setScheme(s);
      persist(s);
    },
    [persist],
  );

  const value = useMemo<ThemeContextType>(() => {
    const isLight = scheme === 'light';
    const normalTheme = isLight ? LightTheme : DarkTheme;
    const invertedTheme = isLight ? DarkTheme : LightTheme;

    return {
      theme: inverted ? invertedTheme : normalTheme,
      invertedTheme: inverted ? normalTheme : invertedTheme,
      colorScheme: scheme,
      toggleTheme,
      setTheme,
      hydrated,
    };
  }, [scheme, toggleTheme, setTheme, hydrated, inverted]);

  if (!hydrated) return null;

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme() must be used within a ThemeProvider');
  return ctx;
};
