import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { sendEmailVerification, signOut } from 'firebase/auth';
import { auth } from '../services/FirebaseConfig';
import { AuthColors, Fonts } from '../utils/constants';
import CoffeeFlower from '../components/CoffeeFlower';

export default function VerifyEmailScreen({ onVerified }) {
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    setLoading(true);
    try {
      await sendEmailVerification(auth.currentUser);
      Alert.alert('Email Sent', 'A new verification email has been sent. Check your inbox.');
    } catch (error) {
      if (error.code === 'auth/too-many-requests') {
        Alert.alert('Too Many Requests', 'Please wait a few minutes before requesting another email.');
      } else {
        Alert.alert('Error', 'Failed to send verification email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    setLoading(true);
    try {
      await auth.currentUser.reload();
      if (auth.currentUser.emailVerified) {
        onVerified();
      } else {
        Alert.alert('Not Verified', 'Your email has not been verified yet. Please check your inbox.');
      }
    } catch {
      Alert.alert('Error', 'Failed to check verification status.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch {
      Alert.alert('Error', 'Failed to sign out.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>&#9993;</Text>
        </View>

        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>
          We sent a verification link to{'\n'}
          <Text style={styles.email}>{auth.currentUser?.email}</Text>
        </Text>
        <Text style={styles.hint}>
          Check your inbox and click the link to verify your account, then tap the button below.
        </Text>

        <TouchableOpacity
          style={[styles.primaryButton, loading && styles.buttonDisabled]}
          onPress={handleCheckVerification}
          activeOpacity={0.8}
          disabled={loading}
        >
          {loading ? (
            <CoffeeFlower size={24} spinning />
          ) : (
            <Text style={styles.primaryButtonText}>I've Verified</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryButton, loading && styles.buttonDisabled]}
          onPress={handleResend}
          activeOpacity={0.7}
          disabled={loading}
        >
          <Text style={styles.secondaryButtonText}>Resend Verification Email</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
          activeOpacity={0.7}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrap: {
    marginBottom: 24,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: AuthColors.text,
    fontFamily: Fonts.mono,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: AuthColors.textSecondary,
    fontFamily: Fonts.mono,
    textAlign: 'center',
    lineHeight: 22,
  },
  email: {
    fontWeight: '700',
    color: AuthColors.text,
  },
  hint: {
    fontSize: 13,
    color: AuthColors.textSecondary,
    fontFamily: Fonts.mono,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 32,
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: AuthColors.buttonFill,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: AuthColors.buttonText,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts.mono,
  },
  secondaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: AuthColors.inputBorder,
    marginBottom: 24,
  },
  secondaryButtonText: {
    color: AuthColors.text,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Fonts.mono,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  signOutButton: {
    paddingVertical: 12,
  },
  signOutText: {
    color: AuthColors.textSecondary,
    fontSize: 14,
    fontFamily: Fonts.mono,
  },
});
