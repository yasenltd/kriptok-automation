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

  selector: {
    label: {
      fontFamily: 'Satoshi-Medium',
      fontSize: 14,
      fontWeight: '500' as const,
      lineHeight: 20,
    },
    option: {
      fontFamily: 'Satoshi-Regular',
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
    },
  },

  badge: {
    small: {
      fontFamily: 'Satoshi-Regular',
      fontSize: 10,
      fontWeight: '400' as const,
      lineHeight: 13.6,
    },
    regular: {
      fontFamily: 'Satoshi-Medium',
      fontSize: 12,
      fontWeight: '500' as const,
      lineHeight: 16.32,
    },
  },

  trendingDirection: {
    fontFamily: 'Satoshi-Medium',
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16.32,
  },

  tokenChip: {
    fontFamily: 'Satoshi-Medium',
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
  },

  transactionItem: {
    directionLabel: {
      fontFamily: 'Satoshi-Medium',
      fontSize: 14,
      fontWeight: '500' as const,
      lineHeight: 20,
    },
    addressLabel: {
      fontFamily: 'Satoshi-Regular',
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
    },
    valueLabel: {
      fontFamily: 'Satoshi-Medium',
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
    },
  },

  walletItem: {
    label: {
      fontFamily: 'Satoshi-Medium',
      fontSize: 16,
      fontWeight: '500' as const,
      lineHeight: 24,
    },
    address: {
      fontFamily: 'Satoshi-Regular',
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
    },
  },

  tokenItem: {
    label: {
      fontFamily: 'Satoshi-Medium',
      fontSize: 14,
      fontWeight: '500' as const,
      lineHeight: 20,
    },
    symbol: {
      fontFamily: 'Satoshi-Regular',
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
    },
    fiatEquivalent: {
      fontFamily: 'Satoshi-Regular',
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 16.32,
    },
    ownedAmount: {
      fontFamily: 'Satoshi-Medium',
      fontSize: 14,
      fontWeight: '500' as const,
      lineHeight: 20,
    },
    tokenPrice: {
      fontFamily: 'Satoshi-Medium',
      fontSize: 14,
      fontWeight: '500' as const,
      lineHeight: 20,
    },
  },

  focusNote: {
    title: {
      fontFamily: 'Satoshi-Medium',
      fontSize: 14,
      fontWeight: '500' as const,
      lineHeight: 20,
    },
    description: {
      fontFamily: 'Satoshi-Regular',
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 16.32,
    },
  },
};
