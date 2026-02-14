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
import { saveEquipmentItem } from '../services/EquipmentService';
import { Colors, Fonts, EquipmentTypes } from '../utils/constants';
import { EquipmentTypeIcon } from '../components/DiagnosticIcons';
import PaperBackground from '../components/PaperBackground';
import CoffeeFlower from '../components/CoffeeFlower';

export default function OnboardingScreen({ navigation }) {
  const [step, setStep] = useState(0);
  const [location, setLocation] = useState('');
  const [shopInput, setShopInput] = useState('');
  const [shops, setShops] = useState([]);
  const [equipNames, setEquipNames] = useState({ machine: '', grinder: '', scale: '' });
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
      // Save equipment items that have names
      for (const [type, name] of Object.entries(equipNames)) {
        if (name.trim()) {
          await saveEquipmentItem(user.uid, {
            id: Date.now().toString() + '_' + type,
            type,
            name: name.trim(),
            brand: '',
            model: '',
            notes: '',
            addedAt: new Date().toISOString(),
          });
        }
      }
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
            <TouchableOpacity
              style={styles.button}
              onPress={() => setStep(1)}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
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
            <Text style={styles.stepLabel}>1 / 3</Text>
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
            <TouchableOpacity
              style={[styles.button, !location.trim() && styles.buttonDisabled]}
              onPress={() => setStep(2)}
              activeOpacity={0.7}
              disabled={!location.trim()}
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
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
            <Text style={styles.stepLabel}>2 / 3</Text>
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
                style={[styles.addButton, !shopInput.trim() && styles.buttonDisabled]}
                onPress={addShop}
                activeOpacity={0.7}
                disabled={!shopInput.trim()}
              >
                <Text style={styles.addButtonText}>+</Text>
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

            <TouchableOpacity
              style={[styles.button, styles.finishButton]}
              onPress={() => setStep(3)}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </PaperBackground>
    );
  }

  // Step 3: Equipment
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
          <Text style={styles.stepLabel}>3 / 3</Text>
          <Text style={styles.stepTitle}>What equipment do{'\n'}you use?</Text>
          <Text style={styles.stepHint}>Optional — you can add more later</Text>

          {Object.entries(EquipmentTypes).map(([key, val]) => (
            <View key={key} style={styles.equipRow}>
              <EquipmentTypeIcon type={key} size={24} color={Colors.text} />
              <TextInput
                style={[styles.input, styles.inputFlex]}
                value={equipNames[key]}
                onChangeText={(text) =>
                  setEquipNames((prev) => ({ ...prev, [key]: text }))
                }
                placeholder={`${val.label} name`}
                placeholderTextColor={Colors.textSecondary}
              />
            </View>
          ))}

          <TouchableOpacity
            style={[styles.button, styles.finishButton, saving && styles.buttonDisabled]}
            onPress={handleFinish}
            activeOpacity={0.7}
            disabled={saving}
          >
            <Text style={styles.buttonText}>
              {saving ? 'Saving...' : 'Finish'}
            </Text>
          </TouchableOpacity>

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
    backgroundColor: Colors.text,
    borderRadius: 10,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: Colors.background,
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
  button: {
    backgroundColor: Colors.text,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: Fonts.mono,
  },
  finishButton: {
    marginTop: 32,
  },
  equipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  equipIcon: {
    fontSize: 24,
    width: 32,
    textAlign: 'center',
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
