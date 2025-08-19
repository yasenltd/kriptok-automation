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
import { useColorScheme } from 'react-native';

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
  const isNestedProvider = !!parentContext;

  const systemColorScheme = useColorScheme();
  const [scheme, setScheme] = useState<Scheme>((systemColorScheme ?? 'light') as Scheme);
  const [hydrated, setHydrated] = useState(false);

  const getTheme = useCallback(async () => {
    // only load from storage if this is the root provider
    if (!isNestedProvider) {
      try {
        const saved = await AsyncStorage.getItem(THEME_KEY);
        if (saved === 'light' || saved === 'dark') setScheme(saved);
      } catch (err) {
        console.error(err);
      }
    }
    setHydrated(true);
  }, [isNestedProvider]);

  useEffect(() => {
    // if nested, use parent's scheme
    if (isNestedProvider) {
      setScheme(parentContext.colorScheme);
      setHydrated(parentContext.hydrated);
    } else {
      getTheme();
    }
  }, [isNestedProvider, parentContext?.colorScheme, parentContext?.hydrated, getTheme]);

  const persist = useCallback(
    async (s: Scheme) => {
      // Only persist if this is the root provider
      if (!isNestedProvider) {
        try {
          await AsyncStorage.setItem(THEME_KEY, s);
        } catch (err) {
          console.error(err);
        }
      }
    },
    [isNestedProvider],
  );

  const toggleTheme = useCallback(() => {
    // If nested, delegate to parent
    if (isNestedProvider) {
      parentContext.toggleTheme();
    } else {
      setScheme(prev => {
        const next: Scheme = prev === 'light' ? 'dark' : 'light';
        persist(next);
        return next;
      });
    }
  }, [persist, isNestedProvider, parentContext]);

  const setTheme = useCallback(
    (s: Scheme) => {
      // if nested, delegate to parent
      if (isNestedProvider) {
        parentContext.setTheme(s);
      } else {
        setScheme(s);
        persist(s);
      }
    },
    [persist, isNestedProvider, parentContext],
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
