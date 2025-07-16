import * as bip39 from 'bip39';
import * as ecc from '@bitcoinerlab/secp256k1';
import { BIP32Factory } from 'bip32';
import * as bitcoin from 'bitcoinjs-lib';
import { HDNodeWallet } from 'ethers/wallet';
import { Mnemonic } from 'ethers';

const bip32 = BIP32Factory(ecc);

export const generateMnemonic = () => {
  return bip39.generateMnemonic(128);
};

export const validateMnemonic = (mnemonic: string) => {
  return bip39.validateMnemonic(mnemonic.trim());
};

export const deriveEVMWalletFromMnemonic = (mnemonic: string) => {
  const mnemonicObj = Mnemonic.fromPhrase(mnemonic.trim());
  const derivationPath = "m/44'/60'/0'/0/0";
  const hdWallet = HDNodeWallet.fromMnemonic(mnemonicObj, derivationPath);

  return {
    address: hdWallet.address,
    privateKey: hdWallet.privateKey,
  };
};

export const deriveBitcoinWallet = (mnemonic: string) => {
  const seed = bip39.mnemonicToSeedSync(mnemonic.trim());
  const root = bip32.fromSeed(seed);

  const path = "m/44'/0'/0'/0/0";
  const child = root.derivePath(path);

  const { address } = bitcoin.payments.p2pkh({
    pubkey: Buffer.from(child.publicKey),
    network: bitcoin.networks.bitcoin,
  });

  return {
    address,
    privateKey: child.toWIF(),
  };
};
