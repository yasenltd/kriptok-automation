const { GLOBAL_TEXT } = require('../constants/global-elements');
const { WELCOME_TEXT } = require('../constants/welcome-elements');
const { waitForTexts, tapText } = require('../utils');

describe('Initial Test', () => {
  beforeAll(async () => {
    const scheme = process.env.EXPO_DEV_CLIENT_SCHEME || 'kriptokwallet';
    const packagerURL = 'http://127.0.0.1:8081';
    const url = `${scheme}://expo-development-client/?url=${encodeURIComponent(packagerURL)}`;
    await device.launchApp({ newInstance: true, url });
    await tapText(GLOBAL_TEXT.SERVER_URL);
    await device.shake();
  });

  it('runs KriptoK Wallet app successfully', async () => {
    await waitForTexts([
      WELCOME_TEXT.WELCOME_TITLE,
      WELCOME_TEXT.WELCOME_SUB_TITLE_CREATE_LABEL,
      WELCOME_TEXT.WELCOME_SUB_TITLE_IMPORT_LABEL,
      WELCOME_TEXT.YOU_AGREE_LABEL,
      WELCOME_TEXT.TERMS_AND_CONDITIONS_LABEL,
      WELCOME_TEXT.AND_LABEL,
      WELCOME_TEXT.PRIVACY_POLICY_LABEL,
      WELCOME_TEXT.CREATE_NEW_WALLET,
      WELCOME_TEXT.IMPORT_EXISTING_WALLET,
    ]);
  });

  afterAll(async () => {
    await device.terminateApp();
  });
});
