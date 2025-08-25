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

async function multiTapIntoId(id, times = 2) {
  const el = element(by.id(id));
  await el.multiTap(times);
}

async function clearIntoId(id) {
  const el = element(by.id(id));
  await el.tap();
  await el.clearText();
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

async function tapText(text, timeout = 5000) {
  const el = element(by.text(text));
  await waitFor(el).toBeVisible().withTimeout(timeout);
  await el.tap();
}

module.exports = {
  tapId,
  tapText,
  fillPin,
  typeIntoId,
  clearIntoId,
  getTextById,
  waitForTexts,
  multiTapIntoId,
  waitForIdVisible,
};
