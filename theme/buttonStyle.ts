import { StyleSheet } from 'react-native';
import { Theme } from './theme';

export const buttonStyles = StyleSheet.create({
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
    color: Theme.text.inverted,
  },
  accentPressed: {
    boxShadow: '0px 0px 5px 0px #A3BDED80, 0px 4px 10px 0px #A3BDED3D',
    elevation: 5,
    color: Theme.text.inverted,
  },
  accentLoading: {
    boxShadow:
      '0px 0px 10px 0px #FFFFFF80 inset, 0px 0px 10px 0px #FFFFFF80 inset, 0px 0px 5px 0px #FFFFFF inset, 0px 0px 15px 0px #FFFFFF inset, 0px 0px 5px 0px #A3BDED80, 0px 4px 10px 0px #A3BDED3D',
    elevation: 3,
    color: Theme.text.inverted,
  },
  accentDisabled: {
    elevation: 0,
    color: Theme.text.disabled,
  },

  // Secondary button states
  secondaryDefault: {
    backgroundColor: Theme.button.secondary.default,
    color: Theme.text.inverted,
  },
  secondaryPressed: {
    backgroundColor: Theme.button.secondary.pressed,
    color: Theme.text.inverted,
  },
  secondaryLoading: {
    backgroundColor: Theme.button.secondary.loading,
    color: Theme.text.inverted,
  },
  secondaryDisabled: {
    backgroundColor: Theme.button.secondary.disabled,
    color: Theme.text.disabled,
  },

  // Tertiary button states
  tertiaryDefault: {
    backgroundColor: Theme.button.tertiary.default,
    color: Theme.text.primary,
  },
  tertiaryPressed: {
    backgroundColor: Theme.button.tertiary.pressed,
    color: Theme.text.primary,
  },
  tertiaryLoading: {
    backgroundColor: Theme.button.tertiary.loading,
    color: Theme.text.primary,
  },
  tertiaryDisabled: {
    backgroundColor: Theme.button.tertiary.disabled,
    color: Theme.text.disabled,
  },

  // Outline button states
  outlineDefault: {
    backgroundColor: Theme.button.outline.default,
    color: Theme.text.primary,
    borderWidth: 1,
    borderColor: Theme.button.outline.stroke,
  },
  outlinePressed: {
    backgroundColor: Theme.button.outline.pressed,
    color: Theme.text.primary,
    borderWidth: 1,
    borderColor: Theme.button.outline.stroke,
  },
  outlineLoading: {
    backgroundColor: Theme.button.outline.loading,
    color: Theme.text.primary,
    borderWidth: 1,
    borderColor: Theme.button.outline.stroke,
  },
  outlineDisabled: {
    backgroundColor: Theme.button.outline.disabled,
    color: Theme.text.disabled,
    borderWidth: 1,
    borderColor: Theme.button.secondary.disabled,
  },

  // Ghost button states
  ghostDefault: {
    backgroundColor: Theme.button.ghost.default,
    color: Theme.text.primary,
  },
  ghostPressed: {
    backgroundColor: Theme.button.ghost.pressed,
    color: Theme.text.primary,
    filter: 'blur(10px)',
  },
  ghostLoading: {
    backgroundColor: Theme.button.ghost.loading,
    color: Theme.text.primary,
    filter: 'blur(10px)',
  },
  ghostDisabled: {
    backgroundColor: Theme.button.ghost.disabled,
    color: Theme.text.disabled,
  },
});
