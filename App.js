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

function TabIcon({ label, focused }) {
  const icons = {
    Home: '⌂',
    Troubleshoot: '⚒',
    Settings: '⚙',
  };

  if (label === 'AI') {
    return <CoffeeFlower size={22} />;
  }

  return (
    <Text style={{
      fontSize: 20,
      color: focused ? Colors.text : Colors.tabInactive,
    }}>
      {icons[label]}
    </Text>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon label={route.name} focused={focused} />
        ),
        tabBarActiveTintColor: Colors.text,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarStyle: {
          backgroundColor: Colors.tabBar,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          paddingTop: 6,
          height: 85,
        },
        tabBarLabelStyle: {
          fontFamily: Fonts.mono,
          fontSize: 10,
          marginTop: 2,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Troubleshoot" component={TroubleshootScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
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
