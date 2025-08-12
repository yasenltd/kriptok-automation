import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/theme/colors';
import { ButtonState, ButtonStyle } from '@/utils/types';
import { ColorValue, StyleSheet, ViewStyle } from 'react-native';

export const useButtonStyles = () => {
  const { theme } = useTheme();

  const buttonStyles = StyleSheet.create({
    button: {
      borderRadius: 9999,
      justifyContent: 'center',
      alignItems: 'center',
    },
    blurContainer: {
      borderRadius: 9999,
      justifyContent: 'center',
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
  });

  const accentStyles = StyleSheet.create({
    default: {
      elevation: 2,
      boxShadow: '0px 0px 10px 0px #FFFFFF80 inset, 0px 0px 5px 0px #FFFFFF inset',
    },
    pressed: {
      boxShadow: '0px 0px 5px 0px #A3BDED80, 0px 4px 10px 0px #A3BDED3D',
      elevation: 5,
    },
    loading: {
      boxShadow:
        '0px 0px 10px 0px #FFFFFF80 inset, 0px 0px 10px 0px #FFFFFF80 inset, 0px 0px 5px 0px #FFFFFF inset, 0px 0px 15px 0px #FFFFFF inset, 0px 0px 5px 0px #A3BDED80, 0px 4px 10px 0px #A3BDED3D',
      elevation: 3,
    },
    disabled: {
      elevation: 0,
    },
  });

  const accentGradients = {
    default: [colors.blue[30], colors.blue[60]],
    disabled: [theme.button.secondary.disabled, theme.button.secondary.disabled],
    loading: [colors.blue[10], colors.blue[40]],
    pressed: [colors.blue[10], colors.blue[10]],
  };

  const secondaryStyles = StyleSheet.create({
    default: {
      backgroundColor: theme.button.secondary.default,
    },
    pressed: {
      backgroundColor: theme.button.secondary.pressed,
    },
    loading: {
      backgroundColor: theme.button.secondary.loading,
    },
    disabled: {
      backgroundColor: theme.button.secondary.disabled,
    },
  });

  const tertiaryStyles = StyleSheet.create({
    default: {
      backgroundColor: theme.button.tertiary.default,
    },
    pressed: {
      backgroundColor: theme.button.tertiary.pressed,
    },
    loading: {
      backgroundColor: theme.button.tertiary.loading,
    },
    disabled: {
      backgroundColor: theme.button.tertiary.disabled,
    },
  });

  const outlineStyles = StyleSheet.create({
    default: {
      backgroundColor: theme.button.outline.default,
      borderWidth: 1,
      borderColor: theme.button.outline.stroke,
    },
    pressed: {
      backgroundColor: theme.button.outline.pressed,
      borderWidth: 1,
      borderColor: theme.button.outline.stroke,
    },
    loading: {
      backgroundColor: theme.button.outline.loading,
      borderWidth: 1,
      borderColor: theme.button.outline.stroke,
    },
    disabled: {
      backgroundColor: theme.button.outline.disabled,
      borderWidth: 1,
      borderColor: theme.button.secondary.disabled,
    },
  });

  const ghostStyles = StyleSheet.create({
    default: {
      backgroundColor: theme.button.ghost.default,
    },
    pressed: {
      backgroundColor: theme.button.ghost.pressed,
    },
    loading: {
      backgroundColor: theme.button.ghost.loading,
    },
    disabled: {
      backgroundColor: theme.button.ghost.disabled,
    },
  });

  const getAccentGradientColors: (state: ButtonState) => [ColorValue, ColorValue] = state => {
    return accentGradients[state] as [ColorValue, ColorValue];
  };

  const getButtonTextColor: (state: ButtonState, style: ButtonStyle) => ColorValue = (
    state,
    style,
  ) => {
    if (state === 'disabled') {
      return theme.text.disabled;
    }

    switch (style) {
      case 'accent':
      case 'secondary':
        return theme.text.inverted;
      case 'tertiary':
      case 'outline':
      case 'ghost':
      default:
        return theme.text.primary;
    }
  };

  const getStyles: (state: ButtonState, style: ButtonStyle) => ViewStyle = (state, style) => {
    return specificStyles[style][state];
  };

  const specificStyles = {
    accent: accentStyles,
    accentGradients: accentGradients,
    secondary: secondaryStyles,
    tertiary: tertiaryStyles,
    outline: outlineStyles,
    ghost: ghostStyles,
  };

  return {
    buttonStyles,
    specificStyles,
    getAccentGradientColors,
    getButtonTextColor,
    getStyles,
  };
};
