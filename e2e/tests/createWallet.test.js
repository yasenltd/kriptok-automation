const { GLOBAL_TEXT } = require('../constants/global-elements');
const { WELCOME_TEXT } = require('../constants/welcome-elements');
const { tapText, waitForTexts } = require('../utils');
const { setupPinAndSkipFaceId } = require('../steps');

describe('Create Wallet flow', () => {
  beforeAll(async () => {
    const scheme = process.env.EXPO_DEV_CLIENT_SCHEME || 'kriptokwallet';
    const packagerURL = 'http://127.0.0.1:8081';
    const url = `${scheme}://expo-development-client/?url=${encodeURIComponent(packagerURL)}`;
    await device.launchApp({ newInstance: true, url });
    await device.shake();
  });

  it('creates new wallet', async () => {
    await tapText(WELCOME_TEXT.CREATE_NEW_WALLET);
    await setupPinAndSkipFaceId();
    await waitForTexts([GLOBAL_TEXT.BACKUP_MESSAGE]);
  });

  afterAll(async () => {
    await device.terminateApp();
  });
});
