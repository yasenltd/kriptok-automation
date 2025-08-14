import { BalancesType } from '@/types';
import { getEthBalance } from '@/utils/transactions/evm';
import { getSuiBalance } from '@/utils/transactions/sui';
import { getSolanaBalance } from '@/utils/transactions/solana';
import { getBitcoinBalance } from '@/utils/transactions/bitcoin';

type GetAllBalancesOpts = {
  includeBTC?: boolean;
};
export type Addresses = { eth?: string; btc?: string; sol?: string; sui?: string };

const evmChains = ['ethereum', 'linea', 'polygon', 'base', 'optimism', 'arbitrum', 'bnb'] as const;

export async function getAllBalances(
  addresses: Addresses,
  prev?: BalancesType,
  opts: GetAllBalancesOpts = {},
): Promise<BalancesType> {
  if (!addresses.eth || !addresses.btc || !addresses.sol || !addresses.sui) {
    throw new Error('Missing one or more addresses');
  }
  const { includeBTC = true } = opts;

  const evmResults = await Promise.allSettled(evmChains.map(c => getEthBalance(addresses.eth!, c)));

  const btcPromise = includeBTC
    ? getBitcoinBalance(addresses.btc!)
    : Promise.resolve(prev?.btc ?? 0);

  const [btcRes, solRes, suiRes] = await Promise.allSettled([
    btcPromise,
    getSolanaBalance(addresses.sol!),
    getSuiBalance(addresses.sui!),
  ]);

  const out: BalancesType = {
    eth: evmResults[0].status === 'fulfilled' ? Number(evmResults[0].value) : (prev?.eth ?? 0),
    linea: evmResults[1].status === 'fulfilled' ? Number(evmResults[1].value) : (prev?.linea ?? 0),
    polygon:
      evmResults[2].status === 'fulfilled' ? Number(evmResults[2].value) : (prev?.polygon ?? 0),
    base: evmResults[3].status === 'fulfilled' ? Number(evmResults[3].value) : (prev?.base ?? 0),
    optimism:
      evmResults[4].status === 'fulfilled' ? Number(evmResults[4].value) : (prev?.optimism ?? 0),
    arbitrum:
      evmResults[5].status === 'fulfilled' ? Number(evmResults[5].value) : (prev?.arbitrum ?? 0),
    bnb: evmResults[6].status === 'fulfilled' ? Number(evmResults[6].value) : (prev?.bnb ?? 0),

    btc: btcRes.status === 'fulfilled' ? btcRes.value : (prev?.btc ?? 0),
    sol: solRes.status === 'fulfilled' ? solRes.value : (prev?.sol ?? 0),
    sui: suiRes.status === 'fulfilled' ? suiRes.value : (prev?.sui ?? 0),
  };

  return out;
}
