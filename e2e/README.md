# End-to-End Testing with Detox

This directory contains end-to-end tests for the Kriptok Wallet application using [Detox](https://wix.github.io/Detox/), a gray box end-to-end testing and automation framework for mobile apps.

## Overview

In the Kriptok Wallet e2e package, we use Detox to test critical user flows of our cryptocurrency wallet application. 
Detox allows us to simulate real user interactions with the app, verifying that the wallet functions correctly from the user's perspective.

Our end-to-end tests focus on key wallet functionality such as:
- Creating a new wallet by setting up a PIN and generating a mnemonic
- Verifying the security features of the wallet (PIN, Face ID, Wallet Backup & Seed Phrase Management)
- Testing the wallet's interface and navigation
- Ensuring proper handling of cryptocurrency operations (Send, Buy, Swap)

## Directory Structure

```
e2e/
├── artifacts/        # Test artifacts (screenshots, videos, etc.)
├── helpers/          # Helper utilities for tests
│   └── constants.js  # Constants used across test files
├── jest.config.js    # Jest configuration for Detox tests
├── starter.test.js   # Example test file
└── README.md         # This file
```

## Setup

To set up Detox for development in the Kriptok Wallet project:

1. Make sure you have all the [Detox prerequisites](https://wix.github.io/Detox/docs/introduction/getting-started) installed for your platform.

2. Install the project dependencies:
   ```
   pnpm install
   ```

3. Make sure you have Xcode and iOS simulators installed for running the tests.

## Running Tests

Before running any tests, you need to start the Expo development server:

```bash
npx expo start
```

This is required for the tests to connect to the app.

### iOS

To build and run tests on the iOS simulator:

```bash
pnpm e2e:ios
```

This command will:
1. Build the app for testing (`detox build -c ios.sim.debug`)
2. Run the tests on the iOS simulator (`detox test -c ios.sim.debug`)

## Test Artifacts

Test artifacts such as screenshots, videos, and UI hierarchy dumps are stored in the `e2e/artifacts` directory. These can be helpful for debugging test failures.

The artifacts configuration can be found in the `.detoxrc.js` file at the project root.

## Writing Tests

Tests for the Kriptok Wallet app are written using Jest and Detox's API. Here's an example from our starter test that tests the wallet creation flow:

```javascript
const { TEXT, ELEMENT_ID, TEST_PIN } = require('./helpers/constants');

describe('Initial Test', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  it('generates a mnemonic and sets a PIN', async () => {
    await element(by.text(TEXT.SERVER_URL)).tap();
    await device.shake();
    await expect(element(by.text(TEXT.APP_TITLE))).toBeVisible();
    await expect(element(by.text(TEXT.SELECT_LANGUAGE))).toBeVisible();
    // More test steps using constants...
  });
});
```

### Best Practices for Kriptok Wallet Tests

1. **Use constants instead of hard-coded strings**: Store all text strings, element IDs, and other constants in the `helpers/constants.js` file and import them in your tests:
   ```javascript
   // Import constants
   const { TEXT, ELEMENT_ID } = require('./helpers/constants');
   
   // Use constants in tests
   await element(by.text(TEXT.CREATE_NEW_WALLET)).tap();
   await element(by.id(ELEMENT_ID.GENERATE_NEW_MNEMONIC)).tap();
   ```

2. **Use testIDs for wallet components**: Add testID props to your React Native components in the Kriptok Wallet app to make them easier to select in tests:
   ```jsx
   <Button testID="generate-new-mnemonic" title="Generate New Mnemonic" />
   ```

3. **Test complete wallet flows**: Test complete user flows from start to finish, such as wallet creation, PIN setup, and mnemonic generation as shown in the example above.

4. **Keep wallet tests independent**: Each test should be able to run independently of other tests, especially when testing different cryptocurrency operations.

5. **Clean up wallet state**: Use `beforeAll` and `afterAll` to set up and clean up the wallet state between tests to ensure a clean testing environment.

6. **Handle async crypto operations**: Many wallet operations are asynchronous, so use `async/await` appropriately in your tests.

7. **Use waitFor for security elements**: Security elements like PIN entry screens might take time to appear:
   ```javascript
   await waitFor(element(by.id(ELEMENT_ID.ENTER_PIN)))
     .toBeVisible()
     .withTimeout(2000);
   ```

## Configuration for Kriptok Wallet Tests

The Detox configuration for Kriptok Wallet is in the `.detoxrc.js` file at the project root. This file defines:

- Test runner configuration specific to our wallet tests
- App configurations for the Kriptok Wallet on iOS
- iOS simulator device configurations
- Artifact settings for capturing test results
- Test configurations for different build types

The Jest configuration for Kriptok Wallet e2e tests is in the `e2e/jest.config.js` file, which sets up the test environment specifically for our wallet testing needs.

## Troubleshooting Kriptok Wallet Tests

If you encounter issues with Kriptok Wallet e2e tests:

1. Check the test artifacts (screenshots, videos) in the `e2e/artifacts` directory to see what happened during test execution.
2. Ensure the Expo development server is running with `npx expo start` before running tests.
3. Verify that wallet components have proper testID props and are accessible to Detox.
4. For PIN entry issues, check that the PIN pad elements are correctly identified in the tests.
5. For mnemonic generation tests, ensure the app is in the correct state before attempting to generate a new wallet.
6. Check the Detox logs for specific error messages related to the wallet functionality.
7. If you encounter crypto-specific issues, ensure the wallet's cryptographic libraries are properly initialized in the test environment.
8. Consult the [Detox documentation](https://wix.github.io/Detox/docs/introduction/getting-started) and the Kriptok Wallet development team for more specific guidance.
