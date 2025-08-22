/** @type {Detox.DetoxConfig} */
module.exports = {
  testRunner: {
    args: {
      $0: 'jest',
      config: 'e2e/jest.config.js',
    },
    jest: {
      setupTimeout: 120_000,
    },
  },

  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/KriptoKWallet.app',
      build:
        'xcodebuild -workspace ios/kriptokwallet.xcworkspace -scheme kriptokwallet ' +
        '-configuration Debug -sdk iphonesimulator ' +
        '-destination "platform=iOS Simulator,name=iPhone 15" ' +
        '-derivedDataPath ios/build',
    },
    'ios.release': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Release-iphonesimulator/KriptoKWallet.app',
      build:
        'xcodebuild -workspace ios/kriptokwallet.xcworkspace -scheme kriptokwallet ' +
        '-configuration Release -sdk iphonesimulator ' +
        '-destination "platform=iOS Simulator,name=iPhone 15" ' +
        '-derivedDataPath ios/build',
    },
  },

  devices: {
    simulator: {
      type: 'ios.simulator',
      device: { type: 'iPhone 15' },
    },
  },

  artifacts: {
    rootDir: 'e2e/artifacts',
    plugins: {
      uiHierarchy: 'enabled',
      screenshot: { shouldTakeAutomaticSnapshots: true },
      video: { simulator: { codec: 'h264' } },
    },
  },

  configurations: {
    'ios.sim.debug': { device: 'simulator', app: 'ios.debug' },
    'ios.sim.release': { device: 'simulator', app: 'ios.release' },
  },
};
