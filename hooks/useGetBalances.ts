import { BalancesType } from '@/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getEthBalance } from '@/utils/transactions/evm';
import { getSuiBalance } from '@/utils/transactions/sui';
import { getSolanaBalance } from '@/utils/transactions/solana';
import { getBitcoinBalance } from '@/utils/transactions/bitcoin';

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
      const [eth, linea, polygon, base, optimism, arbitrum, bnb, btc, sol, sui] = await Promise.all(
        [
          getEthBalance(addresses.eth!, 'ethereum'),
          getEthBalance(addresses.eth!, 'linea'),
          getEthBalance(addresses.eth!, 'polygon'),
          getEthBalance(addresses.eth!, 'base'),
          getEthBalance(addresses.eth!, 'optimism'),
          getEthBalance(addresses.eth!, 'arbitrum'),
          getEthBalance(addresses.eth!, 'bnb'),
          getBitcoinBalance(addresses.btc!),
          getSolanaBalance(addresses.sol!),
          getSuiBalance(addresses.sui!),
        ],
      );
      setBalances({
        eth: Number(eth),
        linea: Number(linea),
        polygon: Number(polygon),
        base: Number(base),
        optimism: Number(optimism),
        arbitrum: Number(arbitrum),
        bnb: Number(bnb),
        btc,
        sol,
        sui,
      });
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
