import Constants from 'expo-constants';
import * as bitcoin from 'bitcoinjs-lib';

export const colors = {
  'primary-white': '#FFFFFF',
  'text-black': '#323135',
  'primary-blue': '#0162BC',
  'secondary-black': '#2A2A2A',
  'text-secondary': '#77737B',
  'text-grey': '#555A5E',
  'primary-grey': '#CBCBCB',
};
export const inputSizeMapping = {
  small: 220,
  medium: 350,
  large: 480,
  screen: '100%' as `${number}%`,
};

export const INFURA_ID = Constants.expoConfig?.extra?.EXPO_PUBLIC_INFURA_ID as string;

export const isDev = (Constants.expoConfig?.extra?.mode as string) === 'dev';

export const BITCOIN_NETWORK = isDev ? bitcoin.networks.testnet : bitcoin.networks.bitcoin;

export const TEST_ETH_RPC_PROVIDER = {
  ethereum: `https://sepolia.infura.io/v3/${INFURA_ID}`,
  linea: `https://linea-sepolia.infura.io/v3/${INFURA_ID}`,
  polygon: `https://polygon-amoy.infura.io/v3/${INFURA_ID}`,
  base: `https://base-sepolia.infura.io/v3/${INFURA_ID}`,
  optimism: `https://optimism-sepolia.infura.io/v3/${INFURA_ID}`,
  arbitrum: `https://arbitrum-sepolia.infura.io/v3/${INFURA_ID}`,
  bsc: `https://bsc-testnet.infura.io/v3/${INFURA_ID}`,
};

export const MAIN_ETH_RPC_PROVIDER = {
  ethereum: `https://mainnet.infura.io/v3/${INFURA_ID}`,
  linea: `https://linea-mainnet.infura.io/v3/${INFURA_ID}`,
  polygon: `https://polygon-mainnet.infura.io/v3/${INFURA_ID}`,
  base: `https://base-mainnet.infura.io/v3/${INFURA_ID}`,
  optimism: `https://optimism-mainnet.infura.io/v3/${INFURA_ID}`,
  arbitrum: `https://arbitrum-mainnet.infura.io/v3/${INFURA_ID}`,
  bsc: `https://bsc-mainnet.infura.io/v3/${INFURA_ID}`,
};

export const ERC20_ABI = ['function transfer(address to, uint256 amount) returns (bool)'];

export const textSize = {
  small: 12,
  medium: 14,
  mediumWeb: 16,
  mobileLarge: 20,
  large: 24,
};

export const EXPLORER_URLS: Record<string, (txHash: string) => string> = {
  ETH: hash =>
    isDev ? `https://sepolia.etherscan.io/tx/${hash}` : `https://etherscan.io/tx/${hash}`,

  BTC: hash =>
    isDev ? `https://mempool.space/testnet/tx/${hash}` : `https://mempool.space/tx/${hash}`,

  SOL: hash =>
    isDev ? `https://solscan.io/tx/${hash}?cluster=testnet` : `https://solscan.io/tx/${hash}`,

  SUI: hash =>
    isDev
      ? `https://suiexplorer.com/txblock/${hash}?network=testnet`
      : `https://suiexplorer.com/txblock/${hash}`,
};
