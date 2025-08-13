import { DarkTheme } from '@/theme/DarkTheme';
import { LightTheme } from '@/theme/LightTheme';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';

type ThemeContextType = {
  theme: typeof DarkTheme | typeof LightTheme;
  colorScheme: 'light' | 'dark' | undefined | null;
  toggleTheme: () => void;
  setTheme: (scheme: 'light' | 'dark') => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [scheme, setScheme] = useState<'light' | 'dark'>(systemColorScheme ?? 'light');

  const theme = scheme === 'light' ? LightTheme : DarkTheme;

  const toggleTheme = () => {
    const newScheme = scheme === 'light' ? 'dark' : 'light';
    setScheme(newScheme);
  };

  const setTheme = (scheme: 'light' | 'dark') => {
    setScheme(scheme);
  };

  const value = {
    theme,
    colorScheme: scheme,
    toggleTheme,
    setTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme() must be used within a ThemeProvider');
  }
  return context;
};
