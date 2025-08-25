const { GLOBAL_ELEMENT_ID, GLOBAL_TEST_PIN, GLOBAL_TEXT } = require('../constants/global-elements');
const { BACKUP_ELEMENT_ID, BACKUP_TEXT } = require('../constants/backup-elements');
const { waitForIdVisible, tapId, typeIntoId, tapText, waitForTexts, getTextById } = require('../utils');
const { fillSeedPhraseFields, getSeedPhraseIndexesAttributes } = require('../steps');

describe('Seed Phrase Backup', () => {
  it('unlocks application', async () => {
    await waitForIdVisible(GLOBAL_ELEMENT_ID.ENTER_PIN_UNLOCK, 5000);
    await typeIntoId(GLOBAL_ELEMENT_ID.ENTER_PIN_UNLOCK, GLOBAL_TEST_PIN, { replace: true });
    await tapId(GLOBAL_ELEMENT_ID.UNLOCK_APP);
  });

  it('backs up seed phrase', async () => {
    await waitForIdVisible(GLOBAL_ELEMENT_ID.BACKUP, 5000);
    await tapId(GLOBAL_ELEMENT_ID.BACKUP);
    await waitForIdVisible(GLOBAL_ELEMENT_ID.ENTER_PIN_UNLOCK, 5000);
    await typeIntoId(GLOBAL_ELEMENT_ID.ENTER_PIN_UNLOCK, GLOBAL_TEST_PIN, { replace: true });
    await tapText(GLOBAL_TEXT.CONTINUE);
    await tapId(BACKUP_ELEMENT_ID.UNDERSTAND_RISKS);
    await tapId(BACKUP_ELEMENT_ID.REVEAL_SEED);
    const phrase = await getTextById(BACKUP_ELEMENT_ID.SEED_PHRASE);
    const seedPhrase = phrase.split(' ');
    await tapId(BACKUP_ELEMENT_ID.CHECK_BACKED_SEED);
    await tapId(BACKUP_ELEMENT_ID.CONFIRM_BACKUP);
    const indices = await getSeedPhraseIndexesAttributes(BACKUP_ELEMENT_ID);
    await fillSeedPhraseFields(indices, seedPhrase, BACKUP_ELEMENT_ID);
    await tapId(BACKUP_ELEMENT_ID.VERIFY_BACKUP);
    await waitForTexts([BACKUP_TEXT.SUCCESS, BACKUP_TEXT.SUCCESS_MESSAGE], 1000);
  });
});
