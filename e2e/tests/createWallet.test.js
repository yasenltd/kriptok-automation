const { GLOBAL_TEST_PIN } = require('../constants/global-elements');
const { WALLET_TEXT, WALLET_ELEMENT_ID } = require('../constants/wallet-elements');

describe('Create Wallet flow', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
    await device.shake();
  });

  it('generates a new mnemonic successfully', async () => {
    await element(by.text(WALLET_TEXT.CREATE_NEW_WALLET)).tap();
    await element(by.id(WALLET_ELEMENT_ID.GENERATE_NEW_MNEMONIC)).tap();
    await waitFor(element(by.id(WALLET_ELEMENT_ID.ENTER_PIN))).toBeVisible().withTimeout(5000);
  });

  it('enters and confirms PIN code', async () => {
    await waitFor(element(by.id(WALLET_ELEMENT_ID.ENTER_PIN))).toBeVisible().withTimeout(5000);
    await element(by.id(WALLET_ELEMENT_ID.ENTER_PIN)).tap();
    await element(by.id(WALLET_ELEMENT_ID.ENTER_PIN)).typeText(GLOBAL_TEST_PIN);
    await element(by.id(WALLET_ELEMENT_ID.CONFIRM_PIN)).tap();
    await element(by.id(WALLET_ELEMENT_ID.CONFIRM_PIN)).typeText(`${GLOBAL_TEST_PIN}\n`);
    await element(by.id(WALLET_ELEMENT_ID.SAVE_PIN)).multiTap(2);
  });

  afterAll(async () => {
    await device.terminateApp();
  });
});
