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
    address: address ?? '',
    privateKey: child.toWIF(),
  };
};

export const deriveSolanaWallet = (mnemonic: string) => {
  const seed = bip39.mnemonicToSeedSync(mnemonic.trim());
  const root = HDKey.fromMasterSeed(seed);
  const child = root.derive("m/44'/501'/0'/0'");
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

  const evmWallet = HDNodeWallet.fromSeed(seed).derivePath("m/44'/60'/0'/0/0");

  const btcChild = rootSecp256k1.derivePath("m/44'/0'/0'/0/0");
  const btcAddress = bitcoin.payments.p2pkh({
    pubkey: Buffer.from(btcChild.publicKey),
    network: bitcoin.networks.bitcoin,
  }).address;

  const solChild = rootEd25519.derive("m/44'/501'/0'/0'");
  const solKeypair = nacl.sign.keyPair.fromSeed(solChild.privateKey!);

  const suiChild = rootEd25519.derive("m/44'/784'/0'/0'/0'");
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
