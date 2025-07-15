import * as bip39 from 'bip39';

export const generateMnemonic = () => {
  return bip39.generateMnemonic(128);
};

export const validateMnemonic = (mnemonic: string) => {
  return bip39.validateMnemonic(mnemonic.trim());
};
