import * as Clipboard from 'expo-clipboard';
import { Share } from 'react-native';

export const copyToClipboard = async (text: string) => {
  await Clipboard.setStringAsync(text);
};

export const formatAddress = (address: string, chars = 4) => {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
};

export const shareText = async (text: string, subject = 'Wallet address'): Promise<boolean> => {
  try {
    const result = await Share.share({ message: text }, { subject, dialogTitle: subject });

    if (result.action === Share.sharedAction) return true;
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
};
