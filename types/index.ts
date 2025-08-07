import { Feather } from '@expo/vector-icons';

export type LanguageType = 'en' | 'tr';

export type User = {
  id: string;
};

export type EncryptedWalletData = {
  cipher: string;
  salt: string;
  iv: string;
};

export type Wallets = {
  evm: {
    address: string;
    privateKey: string;
  };
  bitcoin: {
    address: string;
    privateKey: string;
  };
  solana: {
    address: string;
    privateKey: string;
  };
  sui: {
    address: string;
    privateKey: string;
  };
};

export interface AuthRefreshResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
}

export interface AuthLogoutResponse {
  success: boolean;
}

export type TokenObj = {
  refresh_token: string;
  access_token: string;
  expires_in: string;
  refresh_expires_in: string;
};

export type RegisterType = {
  eth: string;
  btc: string;
  sui: string;
  solana: string;
  signature: string;
  message: string;
};

export type IUser = {
  address: string; // Ethereum
  btc?: string;
  sui?: string;
  solana?: string;
  nonce?: string;
  userId?: string;
  hasBackedUp: boolean;
  createdAt?: string;
  updatedAt?: string;
  _id?: string;
};

export type StatusType = 'checking' | 'unlocking' | 'unlocked';

export interface UpdateUserDto {
  hasBackedUp: boolean;
}

export type FeatherIconType = keyof typeof Feather.glyphMap;

export const nativeCoins = ['eth', 'btc', 'sol', 'sui'];

export type AssetMeta = {
  key: string;
  label: string;
  ledgerId: 'ethereum' | 'bitcoin' | 'solana' | 'sui';
  isNative: boolean;
  tokenAddress?: string;
  decimals: number;
};
