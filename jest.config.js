module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  collectCoverageFrom: [
    'utils/**/*.{ts,tsx}',
    'hooks/**/*.{ts,tsx}',
    'services/**/*.{ts,tsx}',
    '!**/*.d.ts',
  ],
  moduleNameMapper: {
    '^@react-native-async-storage/async-storage$':
      '<rootDir>/node_modules/@react-native-async-storage/async-storage/jest/async-storage-mock',
  },
  transform: {
    // react-native@0.84 mixes Flow+TypeScript `as` assertions throughout its source.
    // Strip TS assertions before handing to babel-jest; jest/mock.js is fully stubbed.
    // Note: `react-native[\\/]` (with trailing slash) does NOT match react-native-svg etc.
    'node_modules[\\/]react-native[\\/]': '<rootDir>/jest-rn-mock-transform.js',
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|react-native-svg|firebase|@firebase/.*|@tanstack/.*)',
  ],
};
