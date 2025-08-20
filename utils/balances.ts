import { BalancesType, BalanceType } from '@/types';

export const haveBalancesChanged = (prev: BalancesType | null, current: BalancesType): boolean => {
  if (!prev) return true;

  const networks: (keyof BalancesType)[] = ['eth', 'polygon', 'bnb', 'btc', 'sol', 'sui'];

  for (const network of networks) {
    const prevBalance = prev[network];
    const currentBalance = current[network];

    if (!prevBalance || !currentBalance) continue;

    if (network === 'btc') {
      if (prevBalance.native !== currentBalance.native) {
        return true;
      }
    } else {
      if (prevBalance.native !== currentBalance.native) {
        return true;
      }

      const prevBalanceTyped = prevBalance as BalanceType;
      const currentBalanceTyped = currentBalance as BalanceType;

      if (prevBalanceTyped.tokens && currentBalanceTyped.tokens) {
        const prevTokenCount = Object.keys(prevBalanceTyped.tokens).length;
        const currentTokenCount = Object.keys(currentBalanceTyped.tokens).length;

        if (prevTokenCount !== currentTokenCount) {
          return true;
        }

        for (const tokenAddress in prevBalanceTyped.tokens) {
          if (prevBalanceTyped.tokens[tokenAddress] !== currentBalanceTyped.tokens[tokenAddress]) {
            return true;
          }
        }
      }
    }
  }

  return false;
};
