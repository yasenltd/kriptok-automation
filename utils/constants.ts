import Constants from 'expo-constants';

export const colors = {
  'primary-white': '#FFFFFF',
  'text-black': '#323135',
  'primary-blue': '#0162BC',
};

export const INFURA_ID = Constants.expoConfig?.extra?.EXPO_PUBLIC_INFURA_ID as string;

export const isDev = (Constants.expoConfig?.extra?.mode as string) === 'dev';

export const TEST_ETH_RPC_PROVIDER = {
  ethereum: `https://sepolia.infura.io/v3/${INFURA_ID}`,
  linea: `https://linea-sepolia.infura.io/v3/${INFURA_ID}`,
  polygon: `https://polygon-amoy.infura.io/v3/${INFURA_ID}`,
  base: `https://base-sepolia.infura.io/v3/${INFURA_ID}`,
  optimism: `https://optimism-sepolia.infura.io/v3/${INFURA_ID}`,
  arbitrum: `https://arbitrum-sepolia.infura.io/${INFURA_ID}`,
};

export const MAIN_ETH_RPC_PROVIDER = {
  ethereum: `https://mainnet.infura.io/v3/${INFURA_ID}`,
  linea: `https://linea-mainnet.infura.io/v3/${INFURA_ID}`,
  polygon: `https://polygon-mainnet.infura.io/v3/${INFURA_ID}`,
  base: `https://base-mainnet.infura.io/v3/${INFURA_ID}`,
  optimism: `https://optimism-mainnet.infura.io/v3/${INFURA_ID}`,
  arbitrum: `https://arbitrum-mainnet.infura.io/v3/${INFURA_ID}`,
};

export const ERC20_ABI = ['function transfer(address to, uint256 amount) returns (bool)'];
