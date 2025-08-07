const { GLOBAL_TEXT, GLOBAL_ELEMENT_ID, GLOBAL_TEST_PIN } = require('./constants/global-elements');
const { BACKUP_TEXT, BACKUP_ELEMENT_ID } = require('./constants/backup-elements');
const { WALLET_TEXT, WALLET_ELEMENT_ID } = require('./constants/wallet-elements');

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

  it('sets a PIN and generates a new mnemonic', async () => {
    await element(by.text(WALLET_TEXT.CREATE_NEW_WALLET)).tap();
    await element(by.id(WALLET_ELEMENT_ID.GENERATE_NEW_MNEMONIC)).tap();
    await waitFor(element(by.id(WALLET_ELEMENT_ID.ENTER_PIN))).toBeVisible().withTimeout(5000);
    await element(by.id(WALLET_ELEMENT_ID.ENTER_PIN)).tap();
    await element(by.id(WALLET_ELEMENT_ID.ENTER_PIN)).typeText(GLOBAL_TEST_PIN);
    await element(by.id(WALLET_ELEMENT_ID.CONFIRM_PIN)).tap();
    await element(by.id(WALLET_ELEMENT_ID.CONFIRM_PIN)).typeText(`${GLOBAL_TEST_PIN}\n`);
    await element(by.id(WALLET_ELEMENT_ID.SAVE_PIN)).multiTap(2);
  });

  it('backs up the mnemonic', async () => {
    await element(by.id(GLOBAL_ELEMENT_ID.BACKUP)).tap();
    await waitFor(element(by.id(GLOBAL_ELEMENT_ID.ENTER_PIN_UNLOCK))).toBeVisible().withTimeout(5000);
    await element(by.id(GLOBAL_ELEMENT_ID.ENTER_PIN_UNLOCK)).tap();
    await element(by.id(GLOBAL_ELEMENT_ID.ENTER_PIN_UNLOCK)).typeText(GLOBAL_TEST_PIN);
    await element(by.text(GLOBAL_TEXT.CONTINUE)).tap();
    await element(by.id(BACKUP_ELEMENT_ID.UNDERSTAND_RISKS)).tap();
    await element(by.id(BACKUP_ELEMENT_ID.REVEAL_SEED)).tap();
    const { text: phrase } = await element(by.id(BACKUP_ELEMENT_ID.SEED_PHRASE)).getAttributes();
    const seedPhrase = phrase.split(' ');
    await element(by.id(BACKUP_ELEMENT_ID.CHECK_BACKED_SEED)).tap();
    await element(by.id(BACKUP_ELEMENT_ID.CONFIRM_BACKUP)).tap();
    const attributes = await element(by.id(BACKUP_ELEMENT_ID.SEED_PHRASE_INDEXES)).getAttributes();
    const indices = attributes.text.split(',').map(Number);
    await fillSeedPhraseFields(indices, seedPhrase);
    await element(by.id(BACKUP_ELEMENT_ID.VERIFY_BACKUP)).tap();
    await waitFor(element(by.text(BACKUP_TEXT.SUCCESS))).toBeVisible().withTimeout(1000);
    await waitFor(element(by.text(BACKUP_TEXT.SUCCESS_MESSAGE))).toBeVisible().withTimeout(1000);
  })

  afterAll(async () => {
    await device.terminateApp();
  });
});

async function fillSeedPhraseFields(indices, seedPhrase) {
  for (let i = 0; i < indices.length; i++) {
    const position = indices[i];
    const word = seedPhrase[position - 1];
    await element(by.id(`${BACKUP_ELEMENT_ID.SEED_PHRASE_VERIFY_INPUT}-${position}`)).replaceText(word);
  }
}
