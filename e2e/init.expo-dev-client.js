const scheme = process.env.EXPO_DEV_CLIENT_SCHEME || 'kriptokwallet';
const packagerURL = 'http://127.0.0.1:8081';
const url = `${scheme}://expo-development-client/?url=${encodeURIComponent(packagerURL)}`;

beforeEach(async () => {
  await device.launchApp({ newInstance: true, url });
}, 180000);

afterEach(async () => {
  try { await device.terminateApp(); } catch {}
});
