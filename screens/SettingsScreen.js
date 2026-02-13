import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { signOut, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../services/FirebaseConfig';
import { Colors, Fonts } from '../utils/constants';
import CoffeeFlower from '../components/CoffeeFlower';

export default function SettingsScreen() {
  const user = auth.currentUser;
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, user.email);
      Alert.alert(
        'Email Sent',
        `Password reset link sent to ${user.email}. Check your inbox.`
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to send password reset email.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <CoffeeFlower size={80} spinning />
        <Text style={styles.loadingText}>Brewing...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(user?.email?.charAt(0) || 'U').toUpperCase()}
          </Text>
        </View>
        <Text style={styles.email}>{user?.email || 'Unknown'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity
          style={styles.row}
          onPress={handlePasswordReset}
          activeOpacity={0.7}
        >
          <Text style={styles.rowText}>Reset Password</Text>
          <Text style={styles.rowHint}>Sends link to email</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={styles.signOutRow}
          onPress={handleSignOut}
          activeOpacity={0.7}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    paddingBottom: 30,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontFamily: Fonts.mono,
    marginTop: 16,
  },
  header: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 20,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.text,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: Colors.background,
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: Fonts.mono,
  },
  email: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  row: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rowText: {
    fontSize: 15,
    color: Colors.text,
    fontFamily: Fonts.mono,
    fontWeight: '600',
  },
  rowHint: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
    marginTop: 3,
  },
  signOutRow: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.danger,
  },
  signOutText: {
    fontSize: 15,
    color: Colors.danger,
    fontFamily: Fonts.mono,
    fontWeight: '700',
  },
});
