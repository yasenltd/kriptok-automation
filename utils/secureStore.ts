import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Crypto from 'expo-crypto';

const WALLET_KEYCHAIN_SERVICE = 'wallet-credentials';
const PIN_HASH_KEY = 'wallet-pin-hash';

export type StoredWalletData = {
  mnemonic: string;
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
  const data: StoredWalletData = { mnemonic };
  const serialized = JSON.stringify(data);

  await SecureStore.setItemAsync(WALLET_KEYCHAIN_SERVICE, serialized, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
};

export const loadWalletSecurelyWithFallback = async (
  promptForPin: () => Promise<string>,
): Promise<StoredWalletData | null> => {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();

  if (hasHardware && isEnrolled) {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Unlock Your Wallet',
      fallbackLabel: 'Use PIN',
      cancelLabel: 'Cancel',
    });

    if (result.success) {
      return await loadFromSecureStore();
    }
  }

  const pinInput = await promptForPin();
  if (!pinInput) return null;

  const valid = await validatePin(pinInput);
  if (!valid) return null;

  return await loadFromSecureStore();
};

export const clearWalletSecurely = async () => {
  await SecureStore.deleteItemAsync(WALLET_KEYCHAIN_SERVICE);
};

const loadFromSecureStore = async (): Promise<StoredWalletData | null> => {
  const stored = await SecureStore.getItemAsync(WALLET_KEYCHAIN_SERVICE);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};
