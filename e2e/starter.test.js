const { TEXT, ELEMENT_ID, TEST_PIN } = require('./helpers/constants');

describe('Initial Test', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
    await element(by.text(TEXT.SERVER_URL)).tap();
    await device.shake();
  });

  it('runs KriptoK Wallet app successfully', async () => {
    await expect(element(by.text(TEXT.APP_TITLE))).toBeVisible();
    await expect(element(by.text(TEXT.SELECT_LANGUAGE))).toBeVisible();
    await expect(element(by.text(TEXT.CREATE_NEW_WALLET))).toBeVisible();
    await expect(element(by.text(TEXT.IMPORT_EXISTING_WALLET))).toBeVisible();
  });

  it('sets a PIN and generates a new mnemonic', async () => {
    await element(by.text(TEXT.CREATE_NEW_WALLET)).tap();
    await element(by.id(ELEMENT_ID.GENERATE_NEW_MNEMONIC)).tap();
    await waitFor(element(by.id(ELEMENT_ID.ENTER_PIN))).toBeVisible().withTimeout(2000);
    await element(by.id(ELEMENT_ID.ENTER_PIN)).tap();
    await element(by.id(ELEMENT_ID.ENTER_PIN)).typeText(TEST_PIN);
    await element(by.id(ELEMENT_ID.CONFIRM_PIN)).tap();
    await element(by.id(ELEMENT_ID.CONFIRM_PIN)).typeText(`${TEST_PIN}\n`);
    await element(by.id(ELEMENT_ID.SAVE_PIN)).multiTap(2);
  });

  afterAll(async () => {
    await device.terminateApp();
  });
});
