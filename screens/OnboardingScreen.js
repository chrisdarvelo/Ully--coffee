import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { auth } from '../services/FirebaseConfig';
import { saveProfile } from '../services/ProfileService';
import { Colors, AuthColors, Fonts } from '../utils/constants';
import PaperBackground from '../components/PaperBackground';
import CoffeeFlower from '../components/CoffeeFlower';
import { GoldButton, GoldGradient } from '../components/GoldGradient';

export default function OnboardingScreen({ navigation }) {
  const [step, setStep] = useState(0);
  const [location, setLocation] = useState('');
  const [shopInput, setShopInput] = useState('');
  const [shops, setShops] = useState([]);
  const [saving, setSaving] = useState(false);

  const user = auth.currentUser;

  const addShop = () => {
    const name = shopInput.trim();
    if (name && !shops.includes(name)) {
      setShops([...shops, name]);
      setShopInput('');
    }
  };

  const removeShop = (index) => {
    setShops(shops.filter((_, i) => i !== index));
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      await saveProfile(user.uid, { location: location.trim(), shops });
      navigation.replace('Tabs');
    } catch {
      setSaving(false);
    }
  };

  if (step === 0) {
    return (
      <PaperBackground>
        <View style={styles.container}>
          <View style={styles.center}>
            <CoffeeFlower size={100} />
            <Text style={styles.title}>Let's dial in{'\n'}your profile</Text>
            <Text style={styles.subtitle}>
              A few quick questions to personalize your experience.
            </Text>
            <GoldButton
              label="Get Started"
              onPress={() => setStep(1)}
              style={{ borderRadius: 10, marginTop: 24 }}
            />
          </View>
        </View>
      </PaperBackground>
    );
  }

  if (step === 1) {
    return (
      <PaperBackground>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.stepContainer}>
            <Text style={styles.stepLabel}>1 / 2</Text>
            <Text style={styles.stepTitle}>Where are you located?</Text>
            <Text style={styles.stepHint}>Your city or town</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="e.g. Portland, OR"
              placeholderTextColor={Colors.textSecondary}
              autoFocus
              returnKeyType="next"
              onSubmitEditing={() => location.trim() && setStep(2)}
            />
            <GoldButton
              label="Next"
              onPress={() => setStep(2)}
              disabled={!location.trim()}
              style={{ borderRadius: 10, marginTop: 24 }}
            />
          </View>
        </KeyboardAvoidingView>
      </PaperBackground>
    );
  }

  if (step === 2) {
    return (
      <PaperBackground>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.stepLabel}>2 / 2</Text>
            <Text style={styles.stepTitle}>
              What are your favorite{'\n'}coffee shops?
            </Text>
            <Text style={styles.stepHint}>Add as many as you like</Text>

            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, styles.inputFlex]}
                value={shopInput}
                onChangeText={setShopInput}
                placeholder="Shop name"
                placeholderTextColor={Colors.textSecondary}
                returnKeyType="done"
                onSubmitEditing={addShop}
              />
              <TouchableOpacity
                onPress={addShop}
                activeOpacity={0.7}
                disabled={!shopInput.trim()}
                style={!shopInput.trim() ? { opacity: 0.4 } : undefined}
              >
                <GoldGradient style={styles.addButton}>
                  <Text style={styles.addButtonText}>+</Text>
                </GoldGradient>
              </TouchableOpacity>
            </View>

            {shops.map((shop, i) => (
              <View key={i} style={styles.shopChip}>
                <Text style={styles.shopChipText}>{shop}</Text>
                <TouchableOpacity onPress={() => removeShop(i)}>
                  <Text style={styles.shopRemove}>x</Text>
                </TouchableOpacity>
              </View>
            ))}

            <GoldButton
              label={saving ? 'Saving...' : 'Finish'}
              onPress={handleFinish}
              disabled={saving}
              style={{ borderRadius: 10, marginTop: 32 }}
            />

            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleFinish}
              activeOpacity={0.7}
              disabled={saving}
            >
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </PaperBackground>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.text,
    fontFamily: Fonts.mono,
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
    textAlign: 'center',
    marginTop: 12,
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  stepLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    fontFamily: Fonts.mono,
    marginBottom: 6,
    lineHeight: 30,
  },
  stepHint: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
    marginBottom: 24,
  },
  input: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    fontFamily: Fonts.mono,
    color: Colors.text,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  inputFlex: {
    flex: 1,
  },
  addButton: {
    borderRadius: 10,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: AuthColors.buttonText,
    fontSize: 22,
    fontWeight: '700',
    fontFamily: Fonts.mono,
  },
  shopChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 8,
  },
  shopChipText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    fontFamily: Fonts.mono,
  },
  shopRemove: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
    paddingLeft: 10,
  },
  skipButton: {
    alignItems: 'center',
    marginTop: 16,
    padding: 8,
  },
  skipText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
  },
});
