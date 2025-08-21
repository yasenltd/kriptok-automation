import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactNative from 'eslint-plugin-react-native';

export default [
  {
    ignores: ['node_modules', 'dist', 'build', '.expo', 'android', 'ios', 'e2e/**', '.detoxrc.js'],
  },

  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },

  {
    files: [
      'metro.config.js',
      'react-native-config.js',
      'babel.config.js',
      'jest.config.js',
      '*.config.js',
      '*.config.cjs',
      'scripts/**/*.js',
    ],
    languageOptions: {
      sourceType: 'script',
      globals: {
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
        process: 'readonly',
      },
    },
  },

  {
    files: ['**/*.{ts,tsx,js}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { __DEV__: 'readonly' },
    },
    settings: { react: { version: 'detect' } },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react: reactPlugin,
      'react-hooks': reactHooks,
      'react-native': reactNative,
    },
    rules: {
      semi: ['error', 'always'],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',

      'react-hooks/rules-of-hooks': 'warn',
      'react-hooks/exhaustive-deps': 'off',

      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',

      'react-native/no-unused-styles': 'off',
      'react-native/no-inline-styles': 'off',
      'react-native/no-raw-text': 'off',
    },
  },

  {
    files: ['**/*.{test,spec}.{js,ts,tsx}', '**/__tests__/**/*.{js,ts,tsx}'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
      },
    },
  },
];
