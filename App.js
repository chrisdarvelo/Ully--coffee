import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Animated, AppState, View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './services/FirebaseConfig';
import { Colors, AuthColors, Fonts } from './utils/constants';
import { isOnboarded } from './services/ProfileService';
import VerifyEmailScreen from './screens/VerifyEmailScreen';
import CoffeeFlower from './components/CoffeeFlower';
import Svg, { Path, Circle } from 'react-native-svg';

import HomeScreen from './screens/HomeScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import SettingsScreen from './screens/SettingsScreen';
import AIScreen from './screens/AIScreen';
import RecipeDetailScreen from './screens/RecipeDetailScreen';
import BaristaDetailScreen from './screens/BaristaDetailScreen';
import CafeDetailScreen from './screens/CafeDetailScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen';

const AuthStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: AuthColors.background },
      }}
    >
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
      <AuthStack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} options={{ title: 'Privacy Policy' }} />
    </AuthStack.Navigator>
  );
}

function TentIcon({ color, size }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3L2 20h20L12 3z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <Path
        d="M12 3v17"
        stroke={color}
        strokeWidth={1.2}
        strokeLinecap="round"
      />
      <Path
        d="M9 20l3-7 3 7"
        stroke={color}
        strokeWidth={1.2}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ProfileIcon({ color, size }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Head */}
      <Circle cx="12" cy="8" r="4" fill={color} />
      {/* Shoulders & chest */}
      <Path d="M4 22c0-4.418 3.582-8 8-8s8 3.582 8 8" fill={color} />
    </Svg>
  );
}

function TabIcon({ label, focused }) {
  const color = focused ? Colors.text : Colors.tabInactive;
  const scale = focused ? 1.15 : 1;

  if (label === 'AI') {
    return (
      <View style={{ transform: [{ scale }] }}>
        <CoffeeFlower size={24} bold dark={focused} />
      </View>
    );
  }

  if (label === 'Profile') {
    return (
      <View style={{ transform: [{ scale }] }}>
        <ProfileIcon color={color} size={24} />
      </View>
    );
  }

  return (
    <View style={{ transform: [{ scale }] }}>
      <TentIcon color={color} size={24} />
    </View>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon label={route.name} focused={focused} />
        ),
        tabBarStyle: {
          backgroundColor: Colors.tabBar,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          paddingTop: 10,
          height: 80,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="AI" component={AIScreen} />
      <Tab.Screen name="Profile" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function AppNavigator({ onboarded }) {
  return (
    <AppStack.Navigator
      initialRouteName={onboarded ? 'Tabs' : 'Onboarding'}
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: Colors.text,
        headerTitleStyle: { fontWeight: '600', fontFamily: Fonts.mono },
        contentStyle: { backgroundColor: Colors.background },
        headerShadowVisible: false,
      }}
    >
      <AppStack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{ headerShown: false }}
      />
      <AppStack.Screen
        name="Tabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <AppStack.Screen
        name="RecipeDetail"
        component={RecipeDetailScreen}
        options={{ headerShown: false }}
      />
      <AppStack.Screen
        name="BaristaDetail"
        component={BaristaDetailScreen}
        options={{ headerShown: false }}
      />
      <AppStack.Screen
        name="CafeDetail"
        component={CafeDetailScreen}
        options={{ title: 'Cafe' }}
      />
      <AppStack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{ title: 'Privacy Policy' }}
      />
    </AppStack.Navigator>
  );
}

const SESSION_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

export default function App() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [onboarded, setOnboarded] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const backgroundedAt = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setEmailVerified(currentUser.emailVerified);
        const done = await isOnboarded(currentUser.uid);
        setOnboarded(done);
      } else {
        setOnboarded(false);
        setEmailVerified(false);
      }
      if (initializing) setInitializing(false);
    });
    return unsubscribe;
  }, [initializing]);

  // Session inactivity timeout
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'background' || nextState === 'inactive') {
        backgroundedAt.current = Date.now();
      } else if (nextState === 'active' && backgroundedAt.current) {
        const elapsed = Date.now() - backgroundedAt.current;
        backgroundedAt.current = null;
        if (elapsed > SESSION_TIMEOUT_MS && auth.currentUser) {
          signOut(auth);
        }
      }
    });
    return () => subscription.remove();
  }, []);

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
