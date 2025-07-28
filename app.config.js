import 'dotenv/config';

export default ({ config }) => {
  const mode = process.env.EXPO_PUBLIC_MODE;
  const baseUrl = mode === 'dev' ? process.env.EXPO_PUBLIC_DEV_HOST : process.env.EXPO_PUBLIC_HOST;

  return {
    ...config,
    extra: {
      ...config.expo?.extra,
      apiBaseUrl: baseUrl,
      mode,
      EXPO_PUBLIC_DEV_HOST: process.env.EXPO_PUBLIC_DEV_HOST,
      EXPO_PUBLIC_HOST: process.env.EXPO_PUBLIC_HOST,
      EXPO_CRYPT_PASSWORD: process.env.EXPO_CRYPT_PASSWORD,
    },
  };
};
