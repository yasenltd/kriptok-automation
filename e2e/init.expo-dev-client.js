const scheme = process.env.EXPO_DEV_CLIENT_SCHEME || 'kriptokwallet';
const url = `${scheme}://expo-development-client/?url=${encodeURIComponent('http://127.0.0.1:8081')}`;

beforeEach(async () => {
  await device.launchApp({ newInstance: true, url });
}, 180000);

afterEach(async () => {
  try { await device.terminateApp(); } catch {}
});
