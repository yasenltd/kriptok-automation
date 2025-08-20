const { GLOBAL_TEXT, GLOBAL_TEST_PIN, GLOBAL_WALLET_NAME, GLOBAL_TEST_SEED_PHRASE } = require('../constants/global-elements');
const { WELCOME_TEXT } = require('../constants/welcome-elements');
const { WALLET_ELEMENT_ID, WALLET_TEXT } = require('../constants/wallet-elements');
const { fillPin, tapText, waitForTexts, typeIntoId } = require('../utils');

describe('Import Wallet flow', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
    await device.shake();
  });

  it('imports new wallet', async () => {
    await tapText(WELCOME_TEXT.IMPORT_EXISTING_WALLET);
    await waitForTexts([WALLET_TEXT.ENTER_PIN, WALLET_TEXT.SECURE_WALLET_LABEL, WALLET_TEXT.PLEASE_REMEMBER_LABEL]);
    await fillPin(WALLET_ELEMENT_ID.ENTER_PIN, GLOBAL_TEST_PIN);
    await tapText(GLOBAL_TEXT.CONTINUE);
    await fillPin(WALLET_ELEMENT_ID.CONFIRM_PIN, GLOBAL_TEST_PIN);
    await tapText(GLOBAL_TEXT.CONTINUE);
    await tapText(GLOBAL_TEXT.SKIP);
    await typeIntoId(WALLET_ELEMENT_ID.WALLET_NAME_INPUT, GLOBAL_WALLET_NAME);
    await typeIntoId(WALLET_ELEMENT_ID.IMPORT_SEED_PHRASE_INPUT, GLOBAL_TEST_SEED_PHRASE);
    await tapText(GLOBAL_TEXT.CONTINUE);
    await waitForTexts([GLOBAL_TEXT.SUCCESS_MESSAGE]);
  });

  afterAll(async () => {
    await device.terminateApp();
  });
});
