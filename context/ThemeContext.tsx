import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { DarkTheme } from '../theme/DarkTheme';
import { LightTheme } from '../theme/LightTheme';

type ThemeContextType = {
    theme: typeof DarkTheme | typeof LightTheme;
    colorScheme: 'light' | 'dark' | undefined | null;
    toggleTheme: () => void;
    setTheme: (scheme: 'light' | 'dark') => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@app_theme';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [scheme, setScheme] = useState<'light' | 'dark'>(systemColorScheme ?? 'light');

    const theme = scheme === 'light' ? LightTheme : DarkTheme;

    useEffect(() => {
        loadSavedTheme();
    }, []);

    const loadSavedTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
            if (savedTheme === 'light' || savedTheme === 'dark') {
                setScheme(savedTheme);
            } else {
                // Use system theme as default if no saved theme
                setScheme(systemColorScheme || 'light');
            }
        } catch (error) {
            console.error('Failed to load theme:', error);
        }
    };

    const toggleTheme = async () => {
        const newScheme = scheme === 'light' ? 'dark' : 'light';
        setScheme(newScheme);
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, newScheme);
        } catch (error) {
            console.error('Failed to save theme:', error);
        }
    };

    const setTheme = async (scheme: 'light' | 'dark') => {
        setScheme(scheme);
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, scheme);
        } catch (error) {
            console.error('Failed to save theme:', error);
        }
    };

    const value = {
        theme,
        colorScheme: scheme,
        toggleTheme,
        setTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme() must be used within a ThemeProvider');
    }
    return context;
};