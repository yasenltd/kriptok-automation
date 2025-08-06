import { useCallback, useEffect, useState } from 'react';
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

export const useAllBalances = (addresses: {
  eth: string;
  btc: string;
  sol: string;
  sui: string;
}) => {
  const [balances, setBalances] = useState({} as BalancesType);

  const [balancesLoading, setBalancesLoading] = useState(true);

  const fetchBalances = useCallback(async () => {
    try {
      setBalancesLoading(true);
      const [eth, btc, sol, sui] = await Promise.all([
        getEthBalance(addresses.eth),
        getBitcoinBalance(addresses.btc),
        getSolanaBalance(addresses.sol),
        getSuiBalance(addresses.sui),
      ]);
      setBalances({ eth: Number(eth), btc, sol, sui });
    } catch (err) {
      console.error(err);
    } finally {
      setBalancesLoading(false);
    }
  }, [addresses]);

  useEffect(() => {
    if (!addresses.eth || !addresses.btc || !addresses.sol || !addresses.sui) {
      setBalancesLoading(false);
      return;
    }

    fetchBalances();
  }, [addresses.eth, addresses.btc, addresses.sol, addresses.sui]);

  return { balances, balancesLoading };
};
