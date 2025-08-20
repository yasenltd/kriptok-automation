export const typography = {
  heading1: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 48,
    fontWeight: '700' as const,
    lineHeight: 58,
  },
  heading2: {
    fontFamily: 'Satoshi-Bold', // fontWeight: 700 = Bold
    fontSize: 40,
    fontWeight: '700' as const,
    lineHeight: 48,
  },
  heading3: {
    fontFamily: 'Satoshi-Bold', // fontWeight: 700 = Bold
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 38,
  },
  heading4: {
    fontFamily: 'Satoshi-Bold', // fontWeight: 700 = Bold
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 29,
  },
  heading5: {
    fontFamily: 'Satoshi-Bold', // fontWeight: 700 = Bold
    fontSize: 20,
    fontWeight: '700' as const,
    lineHeight: 24,
  },

  body1: {
    fontFamily: 'Satoshi-Regular', // fontWeight: 400 = Regular
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 19,
  },
  body2: {
    fontFamily: 'Satoshi-Regular', // fontWeight: 400 = Regular
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 17,
  },
  body3: {
    fontFamily: 'Satoshi-Regular', // fontWeight: 400 = Regular
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 14,
  },
  body4: {
    fontFamily: 'Satoshi-Regular', // fontWeight: 400 = Regular
    fontSize: 10,
    fontWeight: '400' as const,
    lineHeight: 12,
  },

  button: {
    xsToL: {
      fontFamily: 'Satoshi-Medium', // fontWeight: 500 = Medium
      fontSize: 14,
      fontWeight: '500' as const,
      lineHeight: 20,
      letterSpacing: 0,
    },
    xl: {
      fontFamily: 'Satoshi-Medium', // fontWeight: 500 = Medium
      fontSize: 16,
      fontWeight: '500' as const,
      lineHeight: 24, // 150% of 16px = 24px
      letterSpacing: 0,
    },
  },

  checkbox: {
    label: {
      fontFamily: 'Satoshi-Medium',
      fontSize: 14,
      fontWeight: '500' as const,
      lineHeight: 20,
    },
    description: {
      fontFamily: 'Satoshi-Regular',
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
    },
  },

  input: {
    label: {
      fontFamily: 'Satoshi-Medium',
      fontSize: 14,
      fontWeight: '500' as const,
      lineHeight: 20,
    },
    placeholder: {
      fontFamily: 'Satoshi-Regular',
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 16,
    },
    hint: {
      fontFamily: 'Satoshi-Regular',
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 16,
    },
  },

  swapInput: {
    value: {
      fontFamily: 'Satoshi-Medium',
      fontSize: 18,
      fontWeight: '500' as const,
      lineHeight: 24.3,
    },
    balance: {
      fontFamily: 'Satoshi-Medium',
      fontSize: 14,
      fontWeight: '500' as const,
      lineHeight: 20,
    },
  },
};
