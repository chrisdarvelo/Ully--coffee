import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { auth } from '../services/FirebaseConfig';
import { saveEquipmentItem, removeEquipmentItem } from '../services/EquipmentService';
import { Colors, Fonts, EquipmentTypes } from '../utils/constants';
import { EquipmentTypeIcon } from '../components/DiagnosticIcons';

export default function EquipmentDetailScreen({ route, navigation }) {
  const existing = route.params?.item;
  const [type, setType] = useState(existing?.type || 'machine');
  const [name, setName] = useState(existing?.name || '');
  const [brand, setBrand] = useState(existing?.brand || '');
  const [model, setModel] = useState(existing?.model || '');
  const [notes, setNotes] = useState(existing?.notes || '');
  const [saving, setSaving] = useState(false);

  const uid = auth.currentUser?.uid;

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter a name for your equipment.');
      return;
    }
    setSaving(true);
    try {
      const item = {
        id: existing?.id || Date.now().toString(),
        type,
        name: name.trim(),
        brand: brand.trim(),
        model: model.trim(),
        notes: notes.trim(),
        addedAt: existing?.addedAt || new Date().toISOString(),
      };
      await saveEquipmentItem(uid, item);
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Failed to save equipment.');
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Equipment', `Remove "${name || 'this item'}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await removeEquipmentItem(uid, existing.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Type</Text>
        <View style={styles.typePicker}>
          {Object.entries(EquipmentTypes).map(([key, val]) => (
            <TouchableOpacity
              key={key}
              style={[styles.typeOption, type === key && styles.typeOptionActive]}
              onPress={() => setType(key)}
              activeOpacity={0.7}
            >
              <EquipmentTypeIcon
                type={key}
                size={22}
                color={type === key ? Colors.background : Colors.text}
              />
              <Text style={[styles.typeLabel, type === key && styles.typeLabelActive]}>
                {val.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g. My Espresso Setup"
          placeholderTextColor={Colors.textSecondary}
        />

        <Text style={styles.label}>Brand</Text>
        <TextInput
          style={styles.input}
          value={brand}
          onChangeText={setBrand}
          placeholder="e.g. Breville"
          placeholderTextColor={Colors.textSecondary}
        />

        <Text style={styles.label}>Model</Text>
        <TextInput
          style={styles.input}
          value={model}
          onChangeText={setModel}
          placeholder="e.g. Barista Express"
          placeholderTextColor={Colors.textSecondary}
        />

        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Any notes about this equipment"
          placeholderTextColor={Colors.textSecondary}
          multiline
          textAlignVertical="top"
        />

        {type === 'scale' && (
          <TouchableOpacity style={[styles.btButton, styles.btButtonDisabled]} disabled>
            <Text style={styles.btButtonText}>Connect via Bluetooth</Text>
            <Text style={styles.btComingSoon}>Coming soon</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.buttonDisabled]}
          onPress={handleSave}
          activeOpacity={0.7}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Save'}</Text>
        </TouchableOpacity>

        {existing && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            activeOpacity={0.7}
          >
            <Text style={styles.deleteButtonText}>Delete Equipment</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  label: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
    marginTop: 16,
  },
  typePicker: {
    flexDirection: 'row',
    gap: 8,
  },
  typeOption: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  typeOptionActive: {
    borderColor: Colors.text,
    backgroundColor: Colors.text,
  },
  typeIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  typeLabel: {
    fontSize: 12,
    fontFamily: Fonts.mono,
    color: Colors.text,
    fontWeight: '600',
  },
  typeLabelActive: {
    color: Colors.background,
  },
  input: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 14,
    fontSize: 14,
    fontFamily: Fonts.mono,
    color: Colors.text,
  },
  notesInput: {
    minHeight: 80,
  },
  btButton: {
    backgroundColor: Colors.info,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  btButtonDisabled: {
    opacity: 0.5,
  },
  btButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: Fonts.mono,
  },
  btComingSoon: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: Fonts.mono,
    opacity: 0.7,
    marginTop: 2,
  },
  saveButton: {
    backgroundColor: Colors.text,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  saveButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: Fonts.mono,
  },
  deleteButton: {
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.danger,
  },
  deleteButtonText: {
    color: Colors.danger,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: Fonts.mono,
  },
});
