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

export type TokenObj = {
  refresh_token: string;
  access_token: string;
  expires_in: string;
};

export interface RegisterUserDto {
  eth: string;
  btc: string;
  sui: string;
  solana: string;
}

export type IUser = {
  address: string; // Ethereum
  btc?: string;
  sui?: string;
  solana?: string;
  nonce?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
  _id?: string;
};
