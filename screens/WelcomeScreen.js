import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { AuthColors, Fonts } from '../utils/constants';
import CoffeeFlower from '../components/CoffeeFlower';

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.brandSection}>
          <CoffeeFlower size={150} />
          <Text style={styles.title}>Ully AI</Text>
          <Text style={styles.subtitle}>your coffee companion</Text>
        </View>

        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.8}
          >
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.createAccountButton}
            onPress={() => navigation.navigate('SignUp')}
            activeOpacity={0.8}
          >
            <Text style={styles.createAccountButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AuthColors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingBottom: 48,
  },
  brandSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: AuthColors.text,
    marginTop: 24,
    letterSpacing: 1,
    fontFamily: Fonts.mono,
  },
  subtitle: {
    fontSize: 16,
    color: AuthColors.textSecondary,
    marginTop: 8,
    fontFamily: Fonts.mono,
  },
  buttonSection: {
    gap: 12,
  },
  signInButton: {
    backgroundColor: AuthColors.buttonFill,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  signInButtonText: {
    color: AuthColors.buttonText,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts.mono,
  },
  createAccountButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: AuthColors.buttonOutline,
    alignItems: 'center',
  },
  createAccountButtonText: {
    color: AuthColors.text,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts.mono,
  },
});
