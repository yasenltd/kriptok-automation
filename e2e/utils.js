const { element, by, expect, waitFor } = require('detox');

async function fillPin(prefix, pin) {
  for (let i = 0; i < pin.length; i++) {
    const cellId = `${prefix}${i}`;
    const el = element(by.id(cellId));
    await el.replaceText(pin[i]);
  }
}

async function waitForIdVisible(id, timeout = 5000) {
  await waitFor(element(by.id(id))).toBeVisible().withTimeout(timeout);
}

async function tapId(id) {
  const el = element(by.id(id));
  await expect(el).toBeVisible();
  await el.tap();
}

async function typeIntoId(id, text, { replace = true } = {}) {
  const el = element(by.id(id));
  await el.tap();
  if (replace) await el.replaceText(text);
  else await el.typeText(text);
}

async function getTextById(id) {
  const { text } = await element(by.id(id)).getAttributes();
  return text || '';
}

async function waitForTexts(texts, timeout = 5000) {
  for (const t of texts) {
    await waitFor(element(by.text(t))).toBeVisible().withTimeout(timeout);
  }
}

async function tapText(text) {
  const el = element(by.text(text));
  await expect(el).toBeVisible();
  await el.tap();
}

async function fillSeedPhraseFields(indices, seedPhrase, BACKUP_ELEMENT_ID) {
  for (let i = 0; i < indices.length; i++) {
    const position = indices[i];
    const word = seedPhrase[position - 1];
    await element(by.id(`${BACKUP_ELEMENT_ID.SEED_PHRASE_VERIFY_INPUT}-${position}`)).replaceText(word);
  }
}

async function getSeedPhraseIndexesAttributes(BACKUP_ELEMENT_ID) {
  const indexesText = await getTextById(BACKUP_ELEMENT_ID.SEED_PHRASE_INDEXES);
  return indexesText.split(',').map(Number);
}

module.exports = {
  tapId,
  tapText,
  fillPin,
  typeIntoId,
  getTextById,
  waitForTexts,
  waitForIdVisible,
  fillSeedPhraseFields,
  getSeedPhraseIndexesAttributes,
};
