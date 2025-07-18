import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Crypto from 'expo-crypto';
import Aes from 'react-native-aes-crypto';
import { EncryptedWalletData } from '@/types';

const WALLET_KEYCHAIN_SERVICE = 'wallet-credentials';
const PIN_HASH_KEY = 'wallet-pin-hash';
const PIN_ENCRYPTION_KEY = 'wallet-encryption-key';

export type StoredWalletData = {
  mnemonic: string | null;
};

const deriveKey = async (pin: string, salt: string): Promise<string> => {
  const iterations = 100_000;
  const keyLength = 256;
  const algorithm: Aes.Algorithms_pbkdf2 = 'sha256';

  return await Aes.pbkdf2(pin, salt, iterations, keyLength, algorithm);
};

const encryptMnemonic = async (
  mnemonic: string,
  key: string,
): Promise<{ cipher: string; iv: string }> => {
  const iv = await Aes.randomKey(16);
  const cipher = await Aes.encrypt(mnemonic, key, iv, 'aes-256-cbc');
  return { cipher, iv };
};

const decryptMnemonic = async (cipher: string, key: string, iv: string): Promise<string> => {
  return await Aes.decrypt(cipher, key, iv, 'aes-256-cbc');
};

async function hashPin(pin: string): Promise<string> {
  return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, pin);
}

export const setPin = async (pin: string): Promise<void> => {
  const hash = await hashPin(pin);
  await SecureStore.setItemAsync(PIN_HASH_KEY, hash, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
};

export const validatePin = async (inputPin: string): Promise<boolean> => {
  const storedHash = await SecureStore.getItemAsync(PIN_HASH_KEY);
  if (!storedHash) return false;

  const inputHash = await hashPin(inputPin);
  return storedHash === inputHash;
};

export const storeWalletSecurely = async (mnemonic: string, pin: string) => {
  const salt = await Aes.randomKey(16);
  const key = await deriveKey(pin, salt);
  const { cipher, iv } = await encryptMnemonic(mnemonic, key);

  const data: EncryptedWalletData = { cipher, salt, iv };
  await SecureStore.setItemAsync(WALLET_KEYCHAIN_SERVICE, JSON.stringify(data));
  await SecureStore.setItemAsync(PIN_ENCRYPTION_KEY, key);
};

export const loadWalletWithCachedKey = async (): Promise<string | null> => {
  const stored = await SecureStore.getItemAsync(WALLET_KEYCHAIN_SERVICE);
  const key = await SecureStore.getItemAsync(PIN_ENCRYPTION_KEY);
  if (!stored || !key) return null;

  try {
    const { cipher, iv } = JSON.parse(stored);
    return await decryptMnemonic(cipher, key, iv);
  } catch {
    return null;
  }
};

export const loadWalletSecurely = async (pin: string): Promise<string | null> => {
  const stored = await SecureStore.getItemAsync('wallet-credentials');
  if (!stored) return null;

  try {
    const { cipher, salt, iv } = JSON.parse(stored);
    const key = await deriveKey(pin, salt);
    return await decryptMnemonic(cipher, key, iv);
  } catch {
    return null;
  }
};

export const loadWalletSecurelyWithBiometrics = async () => {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();

  if (hasHardware && isEnrolled) {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Unlock Your Wallet',
      fallbackLabel: 'Use PIN',
      cancelLabel: 'Cancel',
    });

    if (result.success) {
      const mnemonic = await loadWalletWithCachedKey();
      if (mnemonic) {
        return mnemonic;
      }
      return null;
    } else {
      return null;
    }
  } else {
    return null;
  }
};

export const loadWalletFromPin = async (pin: string) => {
  const valid = await validatePin(pin);
  if (!valid) return null;

  const mnemonic = await loadWalletSecurely(pin);
  return mnemonic;
};

export const clearWalletSecurely = async () => {
  await SecureStore.deleteItemAsync(WALLET_KEYCHAIN_SERVICE);
  await SecureStore.deleteItemAsync(PIN_HASH_KEY);
  await SecureStore.deleteItemAsync(PIN_ENCRYPTION_KEY);
};
