import { StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const { theme } = useTheme();

export const useButtonStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    button: {
      borderRadius: 9999,
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
    },
    blurContainer: {
      borderRadius: 9999,
      overflow: 'hidden',
    },
    gradient: {
      borderRadius: 9999,
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
    },

    // Accent button states
    accentDefault: {
      elevation: 2,
      boxShadow: '0px 0px 10px 0px #FFFFFF80 inset, 0px 0px 5px 0px #FFFFFF inset',
      color: theme.text.inverted,
    },
    accentPressed: {
      boxShadow: '0px 0px 5px 0px #A3BDED80, 0px 4px 10px 0px #A3BDED3D',
      elevation: 5,
      color: theme.text.inverted,
    },
    accentLoading: {
      boxShadow:
        '0px 0px 10px 0px #FFFFFF80 inset, 0px 0px 10px 0px #FFFFFF80 inset, 0px 0px 5px 0px #FFFFFF inset, 0px 0px 15px 0px #FFFFFF inset, 0px 0px 5px 0px #A3BDED80, 0px 4px 10px 0px #A3BDED3D',
      elevation: 3,
      color: theme.text.inverted,
    },
    accentDisabled: {
      elevation: 0,
      color: theme.text.disabled,
    },

    // Secondary button states
    secondaryDefault: {
      backgroundColor: theme.button.secondary.default,
      color: theme.text.inverted,
    },
    secondaryPressed: {
      backgroundColor: theme.button.secondary.pressed,
      color: theme.text.inverted,
    },
    secondaryLoading: {
      backgroundColor: theme.button.secondary.loading,
      color: theme.text.inverted,
    },
    secondaryDisabled: {
      backgroundColor: theme.button.secondary.disabled,
      color: theme.text.disabled,
    },

    // Tertiary button states
    tertiaryDefault: {
      backgroundColor: theme.button.tertiary.default,
      color: theme.text.primary,
    },
    tertiaryPressed: {
      backgroundColor: theme.button.tertiary.pressed,
      color: theme.text.primary,
    },
    tertiaryLoading: {
      backgroundColor: theme.button.tertiary.loading,
      color: theme.text.primary,
    },
    tertiaryDisabled: {
      backgroundColor: theme.button.tertiary.disabled,
      color: theme.text.disabled,
    },

    // Outline button states
    outlineDefault: {
      backgroundColor: theme.button.outline.default,
      color: theme.text.primary,
      borderWidth: 1,
      borderColor: theme.button.outline.stroke,
    },
    outlinePressed: {
      backgroundColor: theme.button.outline.pressed,
      color: theme.text.primary,
      borderWidth: 1,
      borderColor: theme.button.outline.stroke,
    },
    outlineLoading: {
      backgroundColor: theme.button.outline.loading,
      color: theme.text.primary,
      borderWidth: 1,
      borderColor: theme.button.outline.stroke,
    },
    outlineDisabled: {
      backgroundColor: theme.button.outline.disabled,
      color: theme.text.disabled,
      borderWidth: 1,
      borderColor: theme.button.secondary.disabled,
    },

    // Ghost button states
    ghostDefault: {
      backgroundColor: theme.button.ghost.default,
      color: theme.text.primary,
    },
    ghostPressed: {
      backgroundColor: theme.button.ghost.pressed,
      color: theme.text.primary,
      filter: 'blur(10px)',
    },
    ghostLoading: {
      backgroundColor: theme.button.ghost.loading,
      color: theme.text.primary,
      filter: 'blur(10px)',
    },
    ghostDisabled: {
      backgroundColor: theme.button.ghost.disabled,
      color: theme.text.disabled,
    },
  });
};
