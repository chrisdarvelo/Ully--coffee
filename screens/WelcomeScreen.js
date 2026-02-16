import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthColors, Fonts } from '../utils/constants';
import CoffeeFlower from '../components/CoffeeFlower';

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.brandSection}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Ully</Text>
            <View style={styles.flowerWrap}>
              <CoffeeFlower size={36} />
            </View>
          </View>
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    color: AuthColors.text,
    letterSpacing: 2,
    fontFamily: Fonts.mono,
  },
  flowerWrap: {
    marginLeft: 6,
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    color: AuthColors.textSecondary,
    marginTop: 6,
    fontFamily: Fonts.mono,
    letterSpacing: 1,
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
