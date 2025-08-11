import * as Clipboard from 'expo-clipboard';

export const copyToClipboard = async (text: string) => {
  await Clipboard.setStringAsync(text);
};

export const formatAddress = (address: string, chars = 4) => {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
};
