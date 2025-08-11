const { GLOBAL_TEXT } = require('../constants/global-elements');

describe('Initial Test', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
    await element(by.text(GLOBAL_TEXT.SERVER_URL)).tap();
    await device.shake();
  });

  it('runs KriptoK Wallet app successfully', async () => {
    await expect(element(by.text(GLOBAL_TEXT.APP_TITLE))).toBeVisible();
    await expect(element(by.text(GLOBAL_TEXT.SELECT_LANGUAGE))).toBeVisible();
    await expect(element(by.text(GLOBAL_TEXT.CREATE_NEW_WALLET))).toBeVisible();
    await expect(element(by.text(GLOBAL_TEXT.IMPORT_EXISTING_WALLET))).toBeVisible();
  });

  afterAll(async () => {
    await device.terminateApp();
  });
});
