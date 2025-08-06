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
  secureGet,
  secureRemove,
  secureSave,
} from './secureStore';

import { getToken, saveToken, removeToken, isTokenExpired } from './tokenStorage';
import { copyToClipboard } from './stringUtils';

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
  secureGet,
  secureRemove,
  secureSave,
  getToken,
  saveToken,
  removeToken,
  isTokenExpired,
  copyToClipboard,
};
