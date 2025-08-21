import { colors } from './colors';

// TODO Temporary light theme, update with actual light theme colors
export const LightTheme = {
  // Action Sheet
  actionSheet: {
    toggle: colors.grey[10],
    bg: colors.white[100],
  },

  // Button
  button: {
    primary: {
      default: colors.blue[10],
      pressed: colors.blue[20],
    },
    ghost: {
      default: colors.transparent,
      pressed: colors.grey.opacity[10],
      loading: colors.grey.opacity[25],
      disabled: colors.transparent,
    },
    outline: {
      stroke: colors.grey.opacity[50],
      default: colors.transparent,
      pressed: colors.grey.opacity[10],
      loading: colors.grey.opacity[25],
      disabled: colors.transparent,
    },
    secondary: {
      default: colors.blue[40],
      pressed: colors.blue[50],
      loading: colors.blue[60],
      disabled: colors.grey[20],
    },
    tertiary: {
      default: colors.grey.opacity[25],
      pressed: colors.grey[30],
      loading: colors.grey[40],
      disabled: colors.grey[10],
    },
  },

  // Icons
  icons: {
    primary: colors.grey[100],
    secondary: colors.grey[70],
    tertiary: colors.grey[50],
    inverted: colors.white[100],
    disabled: colors.grey[30],
  },

  // Input
  input: {
    fill: {
      default: colors.grey.opacity[10],
      pressed: colors.grey.opacity[25],
      pressedStroke: colors.blue[40],
      error: colors.error[40],
      disabled: colors.grey[10],
    },
    // Stroke variant
    stroke: {
      default: colors.grey.opacity[50],
      pressed: colors.grey.opacity[50],
      pressedStroke: colors.blue[40],
      error: colors.error[40],
      disabled: colors.grey[20],
    },
  },

  // Link
  link: {
    create: {
      default: colors.success[40],
      pressed: colors.success[30],
      disabled: colors.grey[40],
    },
    destruct: {
      default: colors.error[40],
      pressed: colors.error[30],
      disabled: colors.grey[40],
    },
    primary: {
      default: colors.blue[40],
      pressed: colors.blue[60],
      disabled: colors.grey[40],
    },
    secondary: {
      default: colors.grey[70],
      pressed: colors.grey[90],
      disabled: colors.grey[40],
    },
  },

  // Navigation links
  navlink: {
    active: colors.grey[90],
    inactive: colors.grey[50],
    pressed: colors.grey.opacity[10],
    background: colors.grey.opacity[10],
  },

  // Overlay
  overlay: colors.black.opacity[50],

  // Pin input
  pinInput: {
    default: colors.grey[90],
    error: colors.error[40],
    bg: colors.grey.opacity[10],
  },

  // Stroke
  stroke: {
    primary: colors.grey.opacity[25],
    secondary: colors.grey[30],
    tertiary: colors.grey[100],
  },

  // Surface
  surface: {
    primary: colors.white[100],
    secondary: colors.grey[5],
    tertiary: colors.grey[10],
  },

  // Switch
  switch: {
    off: {
      default: colors.grey[30],
      circleActive: colors.white[100],
      inactive: colors.grey[40],
      circleInactive: colors.grey[20],
    },
    on: {
      default: colors.blue[40],
      circleActive: colors.white[100],
      inactive: colors.grey[50],
      circleInactive: colors.grey[30],
    },
  },

  // Text
  text: {
    primary: colors.grey[100],
    secondary: colors.grey[70],
    tertiary: colors.grey[50],
    inverted: colors.white[100],
    disabled: colors.grey[40],
    success: colors.success[50],
    error: colors.error[50],
    warning: colors.warning[50],
  },
};
