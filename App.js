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
import Svg, { Path, Circle, Line } from 'react-native-svg';

import HomeScreen from './screens/HomeScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import TroubleshootScreen from './screens/TroubleshootScreen';
import SettingsScreen from './screens/SettingsScreen';
import AIScreen from './screens/AIScreen';
import DiagnosticScreen from './screens/DiagnosticScreen';
import ResultScreen from './screens/ResultScreen';
import RecipeDetailScreen from './screens/RecipeDetailScreen';
import BaristaDetailScreen from './screens/BaristaDetailScreen';
import CafeDetailScreen from './screens/CafeDetailScreen';
import EquipmentDetailScreen from './screens/EquipmentDetailScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';

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

function ScanIcon({ color, size }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Corner brackets */}
      <Path d="M3 7V4a1 1 0 011-1h3M17 3h3a1 1 0 011 1v3M21 17v3a1 1 0 01-1 1h-3M7 21H4a1 1 0 01-1-1v-3" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      {/* Barcode lines */}
      <Line x1="7" y1="7" x2="7" y2="17" stroke={color} strokeWidth={1.5} />
      <Line x1="10" y1="7" x2="10" y2="17" stroke={color} strokeWidth={1} />
      <Line x1="12.5" y1="7" x2="12.5" y2="17" stroke={color} strokeWidth={2} />
      <Line x1="15" y1="7" x2="15" y2="17" stroke={color} strokeWidth={1} />
      <Line x1="17" y1="7" x2="17" y2="17" stroke={color} strokeWidth={1.5} />
    </Svg>
  );
}

function CoffeeFruitIcon({ color, size }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Stem */}
      <Path
        d="M12 4v4"
        stroke={color}
        strokeWidth={1.2}
        strokeLinecap="round"
      />
      {/* Left leaf */}
      <Path
        d="M12 5c-2-1.5-5-1-5 1.5s3 2 5 0.5"
        fill="#5A8C3C"
        stroke="#4A7A2E"
        strokeWidth={0.8}
      />
      {/* Right leaf */}
      <Path
        d="M12 5c2-1.5 5-1 5 1.5s-3 2-5 0.5"
        fill="#6B9E4A"
        stroke="#4A7A2E"
        strokeWidth={0.8}
      />
      {/* Left cherry */}
      <Circle cx="10" cy="14" r="4" fill="#C0392B" stroke="#A33225" strokeWidth={0.8} />
      {/* Right cherry */}
      <Circle cx="15" cy="13.5" r="3.5" fill="#E74C3C" stroke="#C0392B" strokeWidth={0.8} />
      {/* Cherry stems connecting to main stem */}
      <Path
        d="M12 8c-1 1-2 3-2 6"
        stroke={color}
        strokeWidth={1}
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M12 8c1 0.5 2 2.5 3 5.5"
        stroke={color}
        strokeWidth={1}
        strokeLinecap="round"
        fill="none"
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
        <CoffeeFruitIcon color={color} size={24} />
      </View>
    );
  }

  if (label === 'Troubleshoot') {
    return (
      <View style={{ transform: [{ scale }] }}>
        <ScanIcon color={color} size={24} />
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
      <Tab.Screen name="Troubleshoot" component={TroubleshootScreen} />
      <Tab.Screen name="Profile" component={SettingsScreen} />
      <Tab.Screen name="AI" component={AIScreen} />
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
        name="Diagnostic"
        component={DiagnosticScreen}
        options={{ title: 'Diagnostic' }}
      />
      <AppStack.Screen
        name="Result"
        component={ResultScreen}
        options={{ title: 'Results' }}
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
        name="EquipmentDetail"
        component={EquipmentDetailScreen}
        options={{ title: 'Equipment' }}
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
      <StatusBar style="dark" />
      <NavigationContainer>
        {user ? (
          emailVerified ? (
            <AppNavigator onboarded={onboarded} />
          ) : (
            <VerifyEmailScreen onVerified={() => setEmailVerified(true)} />
          )
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
