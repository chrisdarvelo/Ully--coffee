import 'dotenv/config';

export default {
  expo: {
    name: 'Ully Coffee',
    slug: 'ully-coffee',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'dark',
    splash: {
      backgroundColor: '#1a1a2e',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.ullycoffee.app',
      infoPlist: {
        NSCameraUsageDescription:
          'Ully Coffee needs camera access to diagnose coffee equipment issues.',
        NSPhotoLibraryUsageDescription:
          'Ully Coffee needs photo library access to analyze existing photos of equipment.',
      },
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#1a1a2e',
      },
      package: 'com.ullycoffee.app',
      permissions: ['CAMERA', 'READ_EXTERNAL_STORAGE'],
    },
    plugins: [
      'expo-asset',
      'expo-font',
      [
        'expo-camera',
        {
          cameraPermission:
            'Ully Coffee needs camera access to diagnose coffee equipment issues.',
        },
      ],
      [
        'expo-image-picker',
        {
          photosPermission:
            'Ully Coffee needs photo library access to analyze existing photos of equipment.',
        },
      ],
      '@react-native-firebase/app',
      '@react-native-firebase/auth',
    ],
    extra: {
      claudeApiKey: process.env.CLAUDE_API_KEY,
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
    },
  },
};
