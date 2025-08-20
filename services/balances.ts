import { BalancesType } from '@/types';
import { getEthBalance } from '@/utils/transactions/evm';
import { getSuiBalance } from '@/utils/transactions/sui';
import { getSolanaBalance } from '@/utils/transactions/solana';
import { getBitcoinBalance } from '@/utils/transactions/bitcoin';
import { isDev } from '@/utils/constants';
import { bsc, bscTestnet, mainnet, polygon, polygonAmoy, sepolia } from 'viem/chains';

export type Addresses = { eth?: string; btc?: string; sol?: string; sui?: string };

export async function getAllBalances(addresses: Addresses): Promise<BalancesType> {
  if (!addresses.eth || !addresses.btc || !addresses.sol || !addresses.sui) {
    throw new Error('Missing one or more addresses');
  }
  //TODO: Add Token balance to the query
  const [eth, polygonBalances, bscBalances, btc, sol, sui] = await Promise.all([
    getEthBalance(addresses.eth, isDev ? sepolia : mainnet, []),
    getEthBalance(addresses.eth, isDev ? polygonAmoy : polygon, []),
    getEthBalance(addresses.eth, isDev ? bscTestnet : bsc, []),
    getBitcoinBalance(addresses.btc),
    getSolanaBalance(addresses.sol, []),
    getSuiBalance(addresses.sui, []),
  ]);

  return {
    eth,
    polygon: polygonBalances,
    bnb: bscBalances,
    btc: {
      native: btc.toString(),
    },
    sol,
    sui,
  };
}
