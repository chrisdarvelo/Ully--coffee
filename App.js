import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Animated, View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/FirebaseConfig';
import { Colors, AuthColors, Fonts } from './utils/constants';
import CoffeeFlower from './components/CoffeeFlower';
import Svg, { Path, Circle, Line } from 'react-native-svg';

import HomeScreen from './screens/HomeScreen';
import TroubleshootScreen from './screens/TroubleshootScreen';
import SettingsScreen from './screens/SettingsScreen';
import AIScreen from './screens/AIScreen';
import DiagnosticScreen from './screens/DiagnosticScreen';
import ResultScreen from './screens/ResultScreen';
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
        <CoffeeFlower size={22} bold />
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

function AppNavigator() {
  return (
    <AppStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: Colors.text,
        headerTitleStyle: { fontWeight: '600', fontFamily: Fonts.mono },
        contentStyle: { backgroundColor: Colors.background },
        headerShadowVisible: false,
      }}
    >
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
    </AppStack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (initializing) setInitializing(false);
    });
    return unsubscribe;
  }, [initializing]);

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
        {user ? <AppNavigator /> : <AuthNavigator />}
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
