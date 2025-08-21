require('dotenv').config();
const GLOBAL_TEST_PIN = process.env.TEST_PIN;
const GLOBAL_WALLET_NAME = process.env.TEST_WALLET_NAME;
const GLOBAL_TEST_SEED_PHRASE = process.env.TEST_SEED_PHRASE;

const GLOBAL_TEXT = {
  SKIP: 'Skip',
  COPY: 'Copy',
  PASTE: 'Paste',
  CONTINUE: 'Continue',
  SERVER_URL: 'http://localhost:8082',
  SUCCESS_MESSAGE: 'Success! Your wallet and PIN are secured.',
  BACKUP_MESSAGE: 'Please, backup your secret recovery phrase!'
};

const GLOBAL_ELEMENT_ID = {
  SEND: 'send',
  LOGIN: 'login',
  BACKUP: 'backup',
  LOGOUT: 'logout',
  REFRESH: 'refresh',
  TEST_TOKEN: 'test-token',
  UNLOCK_APP: 'unlock-app',
  ENTER_PIN_UNLOCK: 'enter-pin-unlock',
};

module.exports = {
  GLOBAL_TEXT,
  GLOBAL_TEST_PIN,
  GLOBAL_ELEMENT_ID,
  GLOBAL_WALLET_NAME,
  GLOBAL_TEST_SEED_PHRASE
};
