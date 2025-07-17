import {
  generateMnemonic,
  validateMnemonic,
  deriveEVMWalletFromMnemonic,
  deriveBitcoinWallet,
  deriveSuiWallet,
  deriveSolanaWallet,
} from './mnemonic';
import { colors } from './constants';
import {
  storeWalletSecurely,
  loadWalletSecurelyWithFallback,
  clearWalletSecurely,
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
  loadWalletSecurelyWithFallback,
  clearWalletSecurely,
};
