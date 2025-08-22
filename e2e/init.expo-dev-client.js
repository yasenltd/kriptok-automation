/* e2e/init.expo-dev-client.js */
const encode = (s) => encodeURIComponent(s);

beforeAll(async () => {
  const scheme = process.env.EXPO_DEV_CLIENT_SCHEME || 'kriptokwallet'; // <- set via repo Variable
  // Metro runs at 127.0.0.1:8081 in CI
  const packagerURL = 'http://127.0.0.1:8081';
  // Expo dev client deep link format:
  // <scheme>://expo-development-client/?url=<encoded packager url>
  const url = `${scheme}://expo-development-client/?url=${encode(packagerURL)}`;

  // Boot & open dev-client deep link so the app attaches to Metro
  await device.launchApp({ newInstance: true, url });
}, 180000); // give it up to 3 minutes on CI
