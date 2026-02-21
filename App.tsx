import React, { useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Animated, View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Colors, Fonts } from './utils/constants';
import CoffeeFlower from './components/CoffeeFlower';
import { AuthNavigator, AppNavigator } from './navigation/AppNavigator';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/authStore';
import { useProfileStore } from './store/profileStore';
import ErrorBoundary from './components/ErrorBoundary';

const queryClient = new QueryClient();

export default function App() {
  const { user, initializing, initialize } = useAuthStore();
  const { onboarded, fetchProfile } = useProfileStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Initialize Auth
  useEffect(() => {
    const unsubscribe = initialize();
    return unsubscribe;
  }, [initialize]);

  // Sync Profile when user changes
  useEffect(() => {
    if (user) {
      fetchProfile(user.uid);
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    if (!initializing) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [initializing, fadeAnim]);

  if (initializing) {
    return (
      <View style={styles.loading}>
        <CoffeeFlower size={80} spinning />
        <Text style={styles.loadingText}>Tamping...</Text>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Animated.View style={[styles.root, { opacity: fadeAnim }]}>
          <StatusBar style="light" />
          <NavigationContainer>
            {user ? (
              <AppNavigator onboarded={onboarded} />
            ) : (
              <AuthNavigator />
            )}
          </NavigationContainer>
        </Animated.View>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontFamily: Fonts.mono,
    marginTop: 16,
  },
});
