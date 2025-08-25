const { getTextById, waitForTexts, tapText, fillPin, typeIntoId } = require('./utils');
const { GLOBAL_TEXT, GLOBAL_TEST_PIN } = require('./constants/global-elements');
const { WALLET_ELEMENT_ID, WALLET_TEXT } = require('./constants/wallet-elements');

async function fillSeedPhraseFields(indices, seedPhrase, BACKUP_ELEMENT_ID) {
  for (let i = 0; i < indices.length; i++) {
    const position = indices[i];
    const word = seedPhrase[position - 1];
    const inputId = `${BACKUP_ELEMENT_ID.SEED_PHRASE_VERIFY_INPUT}-${position}`;
    await typeIntoId(inputId, word, { replace: true });
  }
}

async function getSeedPhraseIndexesAttributes(BACKUP_ELEMENT_ID) {
  const indexesText = await getTextById(BACKUP_ELEMENT_ID.SEED_PHRASE_INDEXES);
  return indexesText.split(',').map(Number);
}

async function setupPinAndSkipFaceId() {
  await waitForTexts([
    WALLET_TEXT.ENTER_PIN,
    WALLET_TEXT.SECURE_WALLET_LABEL,
    WALLET_TEXT.PLEASE_REMEMBER_LABEL,
  ], 10000);
  await fillPin(WALLET_ELEMENT_ID.ENTER_PIN, GLOBAL_TEST_PIN);
  await tapText(GLOBAL_TEXT.CONTINUE);
  await fillPin(WALLET_ELEMENT_ID.CONFIRM_PIN, GLOBAL_TEST_PIN);
  await tapText(GLOBAL_TEXT.CONTINUE);
  await tapText(GLOBAL_TEXT.SKIP);
}

module.exports = {
  fillSeedPhraseFields,
  getSeedPhraseIndexesAttributes,
  setupPinAndSkipFaceId,
};
