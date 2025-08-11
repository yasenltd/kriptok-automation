import { colors } from './colors';

export const Theme = {
  // Action Sheet
  actionSheet: {
    toggle: colors.grey[90],
    bg: colors.grey[100],
  },

  // Button
  button: {
    ghost: {
      default: colors.transparent,
      pressed: colors.grey.opacity[25],
      loading: colors.grey.opacity[50],
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
      pressed: colors.blue[30],
      loading: colors.blue[20],
      disabled: colors.grey[100],
    },
    tertiary: {
      default: colors.grey.opacity[50],
      pressed: colors.grey[80],
      loading: colors.grey[70],
      disabled: colors.grey[100],
    },
  },

  // Icons
  icons: {
    primary: colors.white[100],
    secondary: colors.grey[20],
    tertiary: colors.grey[40],
    inverted: colors.grey[100],
    disabled: colors.white[20],
  },

  // Input
  input: {
    fill: {
      default: colors.grey.opacity[25],
      pressed: colors.grey.opacity[50],
      pressedStroke: colors.blue[40],
      error: colors.error[40],
      disabled: colors.white[20],
    },
    // Stroke variant
    stroke: {
      default: colors.grey.opacity[50],
      pressed: colors.grey.opacity[25],
      pressedStroke: colors.blue[40],
      error: colors.error[40],
      disabled: colors.white[20],
    },
  },

  // Link
  link: {
    create: {
      default: colors.success[40],
      pressed: colors.success[60],
      disabled: colors.white[30],
    },
    destruct: {
      default: colors.error[40],
      pressed: colors.error[60],
      disabled: colors.white[30],
    },
    primary: {
      default: colors.blue[40],
      pressed: colors.blue[20],
      disabled: colors.white[20],
    },
    secondary: {
      default: colors.white[90],
      pressed: colors.white[50],
      disabled: colors.white[20],
    },
  },

  // Navigation links
  navlink: {
    active: colors.grey[5],
    inactive: colors.grey[40],
    pressed: colors.grey.opacity[25],
    'nav-link-bg': colors.grey.opacity[50],
  },

  // Overlay
  overlay: colors.black.opacity[50],

  // Pin input
  pinInput: {
    default: colors.grey[5],
    error: colors.error[40],
    bg: colors.grey.opacity[25],
  },

  // Stroke
  stroke: {
    primary: colors.grey.opacity[25],
    secondary: colors.grey[70],
    tertiary: colors.white[100],
  },

  // Surface
  surface: {
    primary: colors.black[100],
    secondary: colors.grey[100],
    tertiary: colors.grey[90],
  },

  // Switch
  switch: {
    off: {
      default: colors.grey[50],
      circleActive: colors.grey[100],
      inactive: colors.black[60],
      circleInactive: colors.black[90],
    },
    on: {
      default: colors.grey[50],
      circleActive: colors.grey[10],
      inactive: colors.black[70],
      circleInactive: colors.black[20],
    },
  },

  // Text
  text: {
    primary: colors.white[100],
    secondary: colors.grey[20],
    tertiary: colors.grey[40],
    inverted: colors.grey[100],
    disabled: colors.white[20],
    success: colors.success[30],
    error: colors.error[30],
    warning: colors.warning[30],
  },
};
