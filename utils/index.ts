import {
  generateMnemonic,
  validateMnemonic,
  deriveEVMWalletFromMnemonic,
  deriveBitcoinWallet,
  deriveSuiWallet,
  deriveSolanaWallet,
  deriveAllWalletsFromMnemonic,
} from './mnemonic';
import { colors } from './constants';
import {
  storeWalletSecurely,
  loadWalletSecurelyWithBiometrics,
  clearWalletSecurely,
  loadWalletWithCachedKey,
} from './secureStore';

export {
  generateMnemonic,
  validateMnemonic,
  colors,
  deriveEVMWalletFromMnemonic,
  deriveBitcoinWallet,
  deriveSuiWallet,
  deriveSolanaWallet,
  storeWalletSecurely,
  loadWalletSecurelyWithBiometrics,
  clearWalletSecurely,
  deriveAllWalletsFromMnemonic,
  loadWalletWithCachedKey,
};
