const { GLOBAL_TEXT, GLOBAL_WALLET_NAME, GLOBAL_TEST_SEED_PHRASE } = require('../constants/global-elements');
const { WELCOME_TEXT } = require('../constants/welcome-elements');
const { WALLET_ELEMENT_ID } = require('../constants/wallet-elements');
const { multiTapIntoId, clearIntoId, tapText, waitForTexts, typeIntoId, launchAppWithOptionalDevClientUrl } = require('../utils');
const { setupPinAndSkipFaceId } = require('../steps');

describe('Import Wallet flow', () => {
  beforeAll(async () => {
    await launchAppWithOptionalDevClientUrl();
    await device.shake();
  });

  it('imports new wallet', async () => {
    await tapText(WELCOME_TEXT.IMPORT_EXISTING_WALLET);
    await setupPinAndSkipFaceId();
    await typeIntoId(WALLET_ELEMENT_ID.WALLET_NAME_INPUT, GLOBAL_WALLET_NAME);
    await typeIntoId(WALLET_ELEMENT_ID.IMPORT_SEED_PHRASE_INPUT, GLOBAL_TEST_SEED_PHRASE);
    await multiTapIntoId(WALLET_ELEMENT_ID.IMPORT_SEED_PHRASE_INPUT, 3);
    await tapText(GLOBAL_TEXT.COPY);
    await clearIntoId(WALLET_ELEMENT_ID.IMPORT_SEED_PHRASE_INPUT);
    await waitForTexts([GLOBAL_TEXT.PASTE]);
    await tapText(GLOBAL_TEXT.PASTE);
    await tapText(GLOBAL_TEXT.CONTINUE);
    await waitForTexts([GLOBAL_TEXT.SUCCESS_MESSAGE]);
  });

  afterAll(async () => {
    await device.terminateApp();
  });
});
