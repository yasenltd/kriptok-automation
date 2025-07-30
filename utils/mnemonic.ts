import * as bip39 from 'bip39';
import * as ecc from '@bitcoinerlab/secp256k1';
import { BIP32Factory } from 'bip32';
import * as bitcoin from 'bitcoinjs-lib';
import { HDNodeWallet } from 'ethers/wallet';
import { getBytes, Mnemonic } from 'ethers';
import nacl from 'tweetnacl';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { HDKey } from '@scure/bip32';
import { base58 } from '@scure/base';
import { BITCOIN_NETWORK, isDev } from './constants';

export enum WalletDerivationPath {
  EVM = "m/44'/60'/0'/0/0",
  BITCOIN = "m/44'/0'/0'/0/0",
  SOLANA = "m/44'/501'/0'/0'",
  SUI = "m/44'/784'/0'/0'/0'",
}

const BITCOIN_TEST_PATH = "m/84'/1'/0'/0/0";

const bip32 = BIP32Factory(ecc);

export const generateMnemonic = () => {
  return bip39.generateMnemonic(128);
};

export const validateMnemonic = (mnemonic: string) => {
  return bip39.validateMnemonic(mnemonic.trim());
};

export const deriveEVMWalletFromMnemonic = (mnemonic: string) => {
  const phrase = mnemonic.trim();
  if (!bip39.validateMnemonic(phrase)) throw new Error('Invalid mnemonic');

  const mnemonicObj = Mnemonic.fromPhrase(phrase);
  const seedStr: string = mnemonicObj.computeSeed();
  const seed: Uint8Array = getBytes(seedStr);
  const evmWallet = HDNodeWallet.fromSeed(seed).derivePath(WalletDerivationPath.EVM);
  return {
    address: evmWallet.address,
    privateKey: evmWallet.privateKey,
  };
};

export const deriveBitcoinWallet = (mnemonic: string) => {
  const phrase = mnemonic.trim();
  if (!bip39.validateMnemonic(phrase)) throw new Error('Invalid mnemonic');

  const mnemonicObj = Mnemonic.fromPhrase(phrase);
  const seedStr: string = mnemonicObj.computeSeed();
  const seed: Uint8Array = getBytes(seedStr);

  const rootSecp256k1 = bip32.fromSeed(Buffer.from(seed));

  const btcChild = rootSecp256k1.derivePath(
    isDev ? BITCOIN_TEST_PATH : WalletDerivationPath.BITCOIN,
  );
  const btcAddress = bitcoin.payments.p2wpkh({
    pubkey: Buffer.from(btcChild.publicKey),
    network: BITCOIN_NETWORK,
  }).address;

  return {
    address: btcAddress ?? '',
    privateKey: btcChild.toWIF(),
  };
};

export const deriveSolanaWallet = (mnemonic: string) => {
  const seed = bip39.mnemonicToSeedSync(mnemonic.trim());
  const root = HDKey.fromMasterSeed(seed);
  const child = root.derive(WalletDerivationPath.SOLANA);
  const keypair = nacl.sign.keyPair.fromSeed(child.privateKey!);

  const address = base58.encode(keypair.publicKey);
  const privateKey = base58.encode(keypair.secretKey);

  return { address, privateKey };
};

export const deriveSuiWallet = (mnemonic: string) => {
  const phrase = mnemonic.trim();
  if (!bip39.validateMnemonic(phrase)) {
    throw new Error('Invalid mnemonic');
  }

  const keypair = Ed25519Keypair.deriveKeypair(phrase);
  const address = keypair.getPublicKey().toSuiAddress();
  const privateKeyHex = Buffer.from(keypair.getSecretKey()).toString('hex');

  return {
    address,
    privateKey: privateKeyHex,
  };
};

export const deriveAllWalletsFromMnemonic = async (mnemonic: string) => {
  const phrase = mnemonic.trim();
  if (!bip39.validateMnemonic(phrase)) throw new Error('Invalid mnemonic');

  const mnemonicObj = Mnemonic.fromPhrase(phrase);
  const seedStr: string = mnemonicObj.computeSeed();
  const seed: Uint8Array = getBytes(seedStr);

  const rootSecp256k1 = bip32.fromSeed(Buffer.from(seed));
  const rootEd25519 = HDKey.fromMasterSeed(seed);

  const evmWallet = HDNodeWallet.fromSeed(seed).derivePath(WalletDerivationPath.EVM);

  const btcChild = rootSecp256k1.derivePath(
    isDev ? BITCOIN_TEST_PATH : WalletDerivationPath.BITCOIN,
  );
  const btcAddress = bitcoin.payments.p2wpkh({
    pubkey: Buffer.from(btcChild.publicKey),
    network: BITCOIN_NETWORK,
  }).address;

  const solChild = rootEd25519.derive(WalletDerivationPath.SOLANA);
  const solKeypair = nacl.sign.keyPair.fromSeed(solChild.privateKey!);

  const suiChild = rootEd25519.derive(WalletDerivationPath.SUI);
  const suiKeypair = Ed25519Keypair.fromSecretKey(suiChild.privateKey!.slice(0, 32));

  return {
    evm: { address: evmWallet.address, privateKey: evmWallet.privateKey },
    bitcoin: { address: btcAddress ?? '', privateKey: btcChild.toWIF() },
    solana: {
      address: base58.encode(solKeypair.publicKey),
      privateKey: base58.encode(solKeypair.secretKey),
    },
    sui: {
      address: suiKeypair.getPublicKey().toSuiAddress(),
      privateKey: Buffer.from(suiKeypair.getSecretKey()).toString('hex'),
    },
  };
};
