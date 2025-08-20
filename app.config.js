// Optional .env loader for app config; safe to omit installing dotenv.
try {
  // eslint-disable-next-line global-require
  require('dotenv').config();
} catch (e) {
  // Ignore if dotenv is not installed; rely on environment provided by shell/CI.
}

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
      EXPO_PUBLIC_INFURA_ID: process.env.EXPO_PUBLIC_INFURA_ID,
      EXPO_PUBLIC_BALANCES_FETCH_INTERVAL: process.env.EXPO_PUBLIC_BALANCES_FETCH_INTERVAL,
    },
  };
};
