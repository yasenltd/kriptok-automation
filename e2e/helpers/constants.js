/**
 * E2E Test Constants
 * This file contains all the constants used in E2E tests
 */

// Text strings
const TEXT = {
  SERVER_URL: 'http://localhost:8081',
  APP_TITLE: 'Kriptok Wallet',
  SELECT_LANGUAGE: 'Select Language',
  CREATE_NEW_WALLET: 'Create New Wallet',
  IMPORT_EXISTING_WALLET: 'Import Existing Wallet',
};

// Element IDs
const ELEMENT_ID = {
  GENERATE_NEW_MNEMONIC: 'generate-new-mnemonic',
  ENTER_PIN: 'enter-pin',
  CONFIRM_PIN: 'confirm-pin',
  SAVE_PIN: 'save-pin',
};

// Other constants
const TEST_PIN = '123456';

module.exports = {
  TEXT,
  ELEMENT_ID,
  TEST_PIN,
};
