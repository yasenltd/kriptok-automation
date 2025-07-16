import * as bip39 from 'bip39';
import { HDNodeWallet } from 'ethers/wallet';
import { Mnemonic } from 'ethers';

export const generateMnemonic = () => {
  return bip39.generateMnemonic(128);
};

export const validateMnemonic = (mnemonic: string) => {
  return bip39.validateMnemonic(mnemonic.trim());
};

export const deriveWalletFromMnemonic = (mnemonic: string) => {
  const mnemonicObj = Mnemonic.fromPhrase(mnemonic.trim());
  const derivationPath = "m/44'/60'/0'/0/0";
  const hdWallet = HDNodeWallet.fromMnemonic(mnemonicObj, derivationPath);

  return {
    address: hdWallet.address,
    privateKey: hdWallet.privateKey,
  };
};
