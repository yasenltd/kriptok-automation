import { useCallback, useEffect, useMemo, useState } from 'react';
import { getEthBalance } from '@/utils/transactions/evm';
import { getSuiBalance } from '@/utils/transactions/sui';
import { getSolanaBalance } from '@/utils/transactions/solana';
import { getBitcoinBalance } from '@/utils/transactions/bitcoin';

export type BalancesType = {
  eth: number;
  btc: number;
  sol: number;
  sui: number;
};

type Addresses = {
  eth?: string;
  btc?: string;
  sol?: string;
  sui?: string;
};

export const useAllBalances = (addresses: Addresses) => {
  const [balances, setBalances] = useState<null | BalancesType>(null);

  const [balancesLoading, setBalancesLoading] = useState(true);

  const allReady = useMemo(
    () => Boolean(addresses.eth && addresses.btc && addresses.sol && addresses.sui),
    [addresses.eth, addresses.btc, addresses.sol, addresses.sui],
  );

  const fetchBalances = useCallback(async () => {
    if (!allReady) return;
    try {
      setBalancesLoading(true);
      const [eth, btc, sol, sui] = await Promise.all([
        getEthBalance(addresses.eth!),
        getBitcoinBalance(addresses.btc!),
        getSolanaBalance(addresses.sol!),
        getSuiBalance(addresses.sui!),
      ]);
      setBalances({ eth: Number(eth), btc, sol, sui });
    } catch (err) {
      console.error(err);
    } finally {
      setBalancesLoading(false);
    }
  }, [addresses, allReady]);

  useEffect(() => {
    if (!addresses.eth || !addresses.btc || !addresses.sol || !addresses.sui) {
      setBalancesLoading(false);
      return;
    }

    fetchBalances();
  }, [addresses.eth, addresses.btc, addresses.sol, addresses.sui]);

  return { balances, balancesLoading };
};
