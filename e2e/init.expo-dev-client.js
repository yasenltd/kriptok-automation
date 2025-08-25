beforeAll(async () => {
  const scheme = process.env.EXPO_DEV_CLIENT_SCHEME || 'kriptokwallet'; // set in CI env
  const packagerURL = 'http://127.0.0.1:8081';
  const url = `${scheme}://expo-development-client/?url=${encodeURIComponent(packagerURL)}`;

  await device.launchApp({ newInstance: true, url });
}, 360000);
