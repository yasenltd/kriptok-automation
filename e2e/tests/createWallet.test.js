const { GLOBAL_TEXT } = require('../constants/global-elements');
const { WELCOME_TEXT } = require('../constants/welcome-elements');
const { tapText, waitForTexts } = require('../utils');
const { setupPinAndSkipFaceId } = require('../steps');

describe('Create Wallet flow', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
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
