import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Crypto from 'expo-crypto';
import Aes from 'react-native-aes-crypto';
import { EncryptedWalletData } from '@/types';

const WALLET_KEYCHAIN_SERVICE = 'wallet-credentials';
const PIN_HASH_KEY = 'wallet-pin-hash';
const WALLET_ENCRYPTION_KEY = 'wallet-encryption-key';

export type StoredWalletData = {
  mnemonic: string | null;
};

export const getOrCreateAesKey = async (): Promise<string> => {
  const storedKey = await SecureStore.getItemAsync(WALLET_ENCRYPTION_KEY);

  if (storedKey) return storedKey;

  const keyBuffer = Crypto.getRandomBytes(32);
  const newKey = Buffer.from(keyBuffer).toString('hex');

  await SecureStore.setItemAsync(WALLET_ENCRYPTION_KEY, newKey, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });

  return newKey;
};

const deriveKey = async (salt: string): Promise<string> => {
  const pass = await getOrCreateAesKey();
  if (!pass) {
    throw new Error('Unable to create/get AES key');
  }
  const iterations = 100_000;
  const keyLength = 256;
  const algorithm: Aes.Algorithms_pbkdf2 = 'sha256';

  return await Aes.pbkdf2(pass, salt, iterations, keyLength, algorithm);
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

export const storeWalletSecurely = async (mnemonic: string) => {
  const salt = await Aes.randomKey(16);
  const key = await deriveKey(salt);
  const { cipher, iv } = await encryptMnemonic(mnemonic, key);

  const data: EncryptedWalletData = { cipher, salt, iv };
  await SecureStore.setItemAsync(WALLET_KEYCHAIN_SERVICE, JSON.stringify(data), {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
};

export const loadWalletSecurely = async (): Promise<string | null> => {
  const stored = await SecureStore.getItemAsync('wallet-credentials');
  if (!stored) return null;

  try {
    const { cipher, salt, iv } = JSON.parse(stored);
    const key = await deriveKey(salt);
    return await decryptMnemonic(cipher, key, iv);
  } catch {
    return null;
  }
};

export const loadWalletSecurelyWithBiometrics = async () => {
  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!hasHardware || !isEnrolled) {
      return null;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Unlock Your Wallet',
      fallbackLabel: 'Use PIN',
      cancelLabel: 'Cancel',
    });

    if (!result.success) return null;
    const mnemonic = await loadWalletSecurely();

    return mnemonic;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const loadWalletFromPin = async (pin: string) => {
  const valid = await validatePin(pin);
  if (!valid) return null;

  const mnemonic = await loadWalletSecurely();
  return mnemonic;
};

export const clearWalletSecurely = async () => {
  await SecureStore.deleteItemAsync(WALLET_KEYCHAIN_SERVICE);
  await SecureStore.deleteItemAsync(PIN_HASH_KEY);
  await SecureStore.deleteItemAsync(WALLET_ENCRYPTION_KEY);
};

export const secureSave = async (key: string, data: unknown) => {
  try {
    const toStore = typeof data === 'string' ? data : JSON.stringify(data);
    await SecureStore.setItemAsync(key, toStore, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
  } catch (err) {
    console.error(`secureSave failed for key "${key}":`, err);
  }
};

export const secureGet = async <T = any>(key: string): Promise<T | string | null> => {
  try {
    const raw = await SecureStore.getItemAsync(key);
    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  } catch (err) {
    console.error(`secureGet failed for key "${key}":`, err);
    return null;
  }
};

export const secureRemove = async (key: string) => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (err) {
    console.error(`secureRemove failed for key "${key}":`, err);
  }
};
