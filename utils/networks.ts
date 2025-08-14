export const SUPPORTED_NETWORKS = [
  'ethereum',
  'polygon',
  'base',
  'optimism',
  'arbitrum',
  'bnb',
  'bitcoin',
  'solana',
  'sui',
] as const;

export type Network = (typeof SUPPORTED_NETWORKS)[number];

export const BLOCK_TIME_SEC: Record<Network, number> = {
  ethereum: 12,
  polygon: 2,
  base: 2,
  optimism: 2,
  arbitrum: 2,
  bnb: 3,
  bitcoin: 600,
  solana: 0.5,
  sui: 1,
};

export const computeIntervalMs = (activeNetwork: Network = 'ethereum') => {
  const t = BLOCK_TIME_SEC[activeNetwork] ?? 12;
  const clamped = Math.max(10, Math.min(60, Math.ceil(t * 3)));
  return clamped * 1000;
};

export const isEvm = (n: Network) =>
  ['ethereum', 'polygon', 'base', 'optimism', 'arbitrum', 'bnb'].includes(n);
