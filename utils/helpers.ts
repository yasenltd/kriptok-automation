import * as Linking from 'expo-linking';

export const openExternalLink = async (url: string) => {
  try {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      console.error('Invalid URL', `Cannot open this link: ${url}`);
    }
  } catch (error) {
    console.error('openExternalLink error:', error);
  }
};
