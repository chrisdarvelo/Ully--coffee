import 'dotenv/config';

export default {
  expo: {
    name: 'Ully Coffee',
    slug: 'ully-coffee',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      backgroundColor: '#F5F0EB',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.ullycoffee.app',
      infoPlist: {
        NSCameraUsageDescription:
          'Ully uses your camera to scan coffee equipment parts and analyze espresso extractions for dial-in suggestions.',
        NSPhotoLibraryUsageDescription:
          'Ully uses your photo library to upload photos of coffee equipment and espresso extractions for AI analysis.',
      },
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#F5F0EB',
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
            'Ully uses your camera to scan coffee equipment parts and analyze espresso extractions for dial-in suggestions.',
        },
      ],
      [
        'expo-image-picker',
        {
          photosPermission:
            'Ully uses your photo library to upload photos of coffee equipment and espresso extractions for AI analysis.',
        },
      ],
      [
        'expo-speech-recognition',
        {
          microphonePermission:
            'Ully Coffee needs microphone access for voice input.',
          speechRecognitionPermission:
            'Ully Coffee needs speech recognition to convert your voice to text.',
        },
      ],
    ],
    extra: {
      claudeApiKey: process.env.CLAUDE_API_KEY,
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      appCheckSiteKey: process.env.APP_CHECK_SITE_KEY,
      appCheckDebugToken: process.env.APP_CHECK_DEBUG_TOKEN,
    },
  },
};
