const { GLOBAL_ELEMENT_ID, GLOBAL_TEST_PIN, GLOBAL_TEXT } = require('../constants/global-elements');
const { BACKUP_ELEMENT_ID, BACKUP_TEXT } = require('../constants/backup-elements');

describe('Seed Phrase Backup', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
    await device.shake();
  });

  it('unlocks application', async () => {
    await waitFor(element(by.id(GLOBAL_ELEMENT_ID.ENTER_PIN_UNLOCK))).toBeVisible().withTimeout(5000);
    await element(by.id(GLOBAL_ELEMENT_ID.ENTER_PIN_UNLOCK)).tap();
    await element(by.id(GLOBAL_ELEMENT_ID.ENTER_PIN_UNLOCK)).typeText(GLOBAL_TEST_PIN);
    await element(by.id(GLOBAL_ELEMENT_ID.UNLOCK_APP)).tap();
  })

  it('backs up seed phrase', async () => {
    await waitFor(element(by.id(GLOBAL_ELEMENT_ID.BACKUP))).toBeVisible().withTimeout(5000);
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
