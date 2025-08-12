import {
  generateMnemonic,
  validateMnemonic,
  deriveEVMWalletFromMnemonic,
  deriveBitcoinWallet,
  deriveSuiWallet,
  deriveSolanaWallet,
  deriveAllWalletsFromMnemonic,
} from './mnemonic';
import { colors, textSize, inputSizeMapping } from './constants';
import {
  storeWalletSecurely,
  loadWalletSecurelyWithBiometrics,
  clearWalletSecurely,
  secureGet,
  secureRemove,
  secureSave,
  loadPrivKeySecurely,
  storePrivKeySecurely,
  storeAllPrivKeys,
} from './secureStore';

import { getToken, saveToken, removeToken, isTokenExpired } from './tokenStorage';
import { copyToClipboard } from './stringUtils';
import { formatAddress } from './stringUtils';

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
  textSize,
  inputSizeMapping,
  formatAddress,
  loadPrivKeySecurely,
  storePrivKeySecurely,
  storeAllPrivKeys,
};
