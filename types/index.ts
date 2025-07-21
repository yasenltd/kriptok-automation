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
