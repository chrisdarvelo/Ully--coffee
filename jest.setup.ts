// ─── Expo modules ─────────────────────────────────────────────────────────────
jest.mock('expo-constants', () => ({
  expoConfig: { extra: {} },
}));

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getCurrentPositionAsync: jest.fn().mockResolvedValue({
    coords: { latitude: 40.7128, longitude: -74.006 },
  }),
  Accuracy: { Low: 1 },
}));

jest.mock('expo-video-thumbnails', () => ({
  getThumbnailAsync: jest.fn(),
}));

jest.mock('expo-file-system', () => ({
  readAsStringAsync: jest.fn(),
  EncodingType: { Base64: 'base64' },
}));

// ─── react-native-svg (used by CoffeeFlower and DiagnosticIcons) ──────────────
jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View } = require('react-native');
  const mock = (props: any) => React.createElement(View, props);
  return {
    __esModule: true,
    default: mock,
    Svg: mock, Path: mock, Circle: mock, Line: mock,
    Rect: mock, Polygon: mock, G: mock,
  };
});

// ─── Firebase ────────────────────────────────────────────────────────────────
jest.mock('./services/FirebaseConfig', () => ({
  auth: { currentUser: { uid: 'test-uid', email: 'test@example.com' } },
  app: {},
}));

jest.mock('firebase/functions', () => ({
  getFunctions: jest.fn().mockReturnValue({}),
  httpsCallable: jest.fn().mockReturnValue(jest.fn()),
}));

// ─── ClaudeService ────────────────────────────────────────────────────────────
jest.mock('./services/ClaudeService', () => ({
  __esModule: true,
  default: {
    chatWithHistory: jest.fn(),
    diagnoseExtraction: jest.fn(),
    identifyPart: jest.fn(),
    validateImageSize: jest.fn(),
  },
}));

// ─── Weather / Location service ───────────────────────────────────────────────
jest.mock('./services/WeatherLocationService', () => ({
  getWeatherAndLocation: jest.fn().mockResolvedValue(null),
}));
