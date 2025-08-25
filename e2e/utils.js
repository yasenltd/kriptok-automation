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

async function tapText(text) {
  const el = element(by.text(text));
  await expect(el).toBeVisible();
  await el.tap();
}


async function launchAppWithOptionalDevClientUrl() {
  const useDevUrl = String(process.env.E2E_USE_DEV_CLIENT_URL || '').toLowerCase();
  const shouldUse = useDevUrl === '1' || useDevUrl === 'true';
  if (shouldUse) {
    let appScheme = 'kriptok';
    try {
      // Derive default scheme from app.json for robustness
      const appJson = require('../app.json');
      appScheme = appJson?.expo?.scheme || appScheme;
    } catch (e) {
      // noop – keep fallback
    }
    const scheme = process.env.EXPO_DEV_CLIENT_SCHEME || appScheme;
    const port = process.env.RCT_METRO_PORT || '8081';
    const devUrl = `http://127.0.0.1:${port}`;
    const url = `${scheme}://expo-development-client/?url=${encodeURIComponent(devUrl)}`;
    await device.launchApp({ newInstance: true, url });
  } else {
    await device.launchApp({ newInstance: true });
  }
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
  launchAppWithOptionalDevClientUrl,
};
