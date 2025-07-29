import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearWalletSecurely } from './secureStore';

const APP_ALREADY_INSTALLED = 'appAlreadyInstalled';

export const checkFirstInstallAndCleanup = async () => {
  const alreadyInstalled = await AsyncStorage.getItem(APP_ALREADY_INSTALLED);

  if (!alreadyInstalled) {
    await clearWalletSecurely();
  }
};

export const setInstalled = async () => {
  await AsyncStorage.setItem(APP_ALREADY_INSTALLED, 'true');
};
