import { initializeApp, getApps } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { initializeAppCheck, ReCaptchaEnterpriseProvider, CustomProvider } from 'firebase/app-check';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey,
  authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain,
  projectId: Constants.expoConfig?.extra?.firebaseProjectId,
  storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket,
  messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId,
  appId: Constants.expoConfig?.extra?.firebaseAppId,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Firebase App Check
// In development (__DEV__), use a debug provider.
// In production, use ReCaptchaEnterpriseProvider with your site key.
const appCheckSiteKey = Constants.expoConfig?.extra?.appCheckSiteKey;
if (__DEV__) {
  // Enable debug token for development — set FIREBASE_APPCHECK_DEBUG_TOKEN in .env
  // and register it in the Firebase console under App Check > Apps > Manage debug tokens
  if (typeof globalThis.self !== 'undefined') {
    globalThis.self.FIREBASE_APPCHECK_DEBUG_TOKEN =
      Constants.expoConfig?.extra?.appCheckDebugToken || true;
  }
}

try {
  if (appCheckSiteKey) {
    initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(appCheckSiteKey),
      isTokenAutoRefreshEnabled: true,
    });
  }
} catch {
  // App Check init may fail in some environments (e.g. Expo Go);
  // the app still works, just without App Check enforcement.
}

export { app, auth };
