const { GLOBAL_TEXT, GLOBAL_TEST_PIN } = require('../constants/global-elements');
const { WALLET_ELEMENT_ID, WALLET_TEXT } = require('../constants/wallet-elements');
const { WELCOME_TEXT } = require('../constants/welcome-elements');
const { fillPin, tapText, waitForTexts } = require('../utils');

describe('Create Wallet flow', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
    await device.shake();
  });

  it('creates new wallet', async () => {
    await tapText(WELCOME_TEXT.CREATE_NEW_WALLET);
    await waitForTexts([WALLET_TEXT.ENTER_PIN, WALLET_TEXT.SECURE_WALLET_LABEL, WALLET_TEXT.PLEASE_REMEMBER_LABEL]);
    await fillPin(WALLET_ELEMENT_ID.ENTER_PIN, GLOBAL_TEST_PIN);
    await tapText(GLOBAL_TEXT.CONTINUE);
    await fillPin(WALLET_ELEMENT_ID.CONFIRM_PIN, GLOBAL_TEST_PIN);
    await tapText(GLOBAL_TEXT.CONTINUE);
    await tapText(GLOBAL_TEXT.SKIP);
    await waitForTexts([GLOBAL_TEXT.BACKUP_MESSAGE]);
  });

  afterAll(async () => {
    await device.terminateApp();
  });
});
