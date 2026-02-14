import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { auth } from '../services/FirebaseConfig';
import { saveBarista, removeBarista } from '../services/BaristaService';
import { Colors, AuthColors, Fonts } from '../utils/constants';
import { sanitizeText } from '../utils/validation';

export default function BaristaDetailScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const barista = route.params?.barista;
  const isNew = route.params?.isNew;
  const uid = auth.currentUser?.uid;

  const [editing, setEditing] = useState(!!isNew);
  const [name, setName] = useState(barista?.name || '');
  const [specialty, setSpecialty] = useState(barista?.specialty || '');
  const [bio, setBio] = useState(barista?.bio || '');

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Name required', 'Please enter the barista name.');
      return;
    }
    await saveBarista(uid, {
      ...barista,
      id: barista?.id,
      name: sanitizeText(name, 100),
      specialty: sanitizeText(specialty, 200),
      bio: sanitizeText(bio, 500),
    });
    navigation.goBack();
  };

  const handleRemove = () => {
    Alert.alert('Remove Barista', `Remove "${barista?.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          await removeBarista(uid, barista.id);
          navigation.goBack();
        },
      },
    ]);
  };

  // Editing / New form
  if (editing) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>{'\u2190'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.formContent}>
          <Text style={styles.heading}>{isNew ? 'Add Barista' : 'Edit Barista'}</Text>

          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Barista name"
            placeholderTextColor={Colors.textSecondary}
          />

          <Text style={styles.label}>Specialty</Text>
          <TextInput
            style={styles.input}
            value={specialty}
            onChangeText={setSpecialty}
            placeholder="e.g. Latte Art, Espresso"
            placeholderTextColor={Colors.textSecondary}
          />

          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={bio}
            onChangeText={setBio}
            placeholder="A short bio..."
            placeholderTextColor={Colors.textSecondary}
            multiline
            textAlignVertical="top"
          />

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.7}>
            <Text style={styles.saveBtnText}>{isNew ? 'Add' : 'Save'}</Text>
          </TouchableOpacity>

          {!isNew && barista?.id && (
            <TouchableOpacity style={styles.removeBtn} onPress={handleRemove} activeOpacity={0.7}>
              <Text style={styles.removeBtnText}>Remove Barista</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    );
  }

  // Read-only view
  if (!barista) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.emptyText}>Barista not found.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>{'\u2190'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setEditing(true)} style={styles.editBtn}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarWrap}>
          {barista.avatarUrl ? (
            <Image source={{ uri: barista.avatarUrl }} style={styles.avatarPhoto} />
          ) : (
            <View style={[styles.avatar, { backgroundColor: barista.avatarColor }]}>
              <Text style={styles.avatarText}>
                {barista.name.split(' ').map((w) => w[0]).join('')}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.name}>{barista.name}</Text>
        <Text style={styles.specialty}>{barista.specialty}</Text>
        <Text style={styles.bio}>{barista.bio}</Text>

        {barista.recipes?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recipes</Text>
            {barista.recipes.map((r, i) => (
              <View key={i} style={styles.listItem}>
                <Text style={styles.listBullet}>{'\u2022'}</Text>
                <Text style={styles.listText}>{r}</Text>
              </View>
            ))}
          </View>
        )}

        {barista.blogs?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Blogs</Text>
            {barista.blogs.map((b, i) => (
              <View key={i} style={styles.listItem}>
                <Text style={styles.listBullet}>{'\u2022'}</Text>
                <Text style={styles.listText}>{b}</Text>
              </View>
            ))}
          </View>
        )}

        {barista.recommendations?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recommendations</Text>
            {barista.recommendations.map((r, i) => (
              <View key={i} style={styles.listItem}>
                <Text style={styles.listBullet}>{'\u2022'}</Text>
                <Text style={styles.listText}>{r}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backBtn: {
    padding: 8,
  },
  backText: {
    fontSize: 24,
    color: Colors.text,
  },
  editBtn: {
    padding: 8,
  },
  editText: {
    fontSize: 14,
    color: Colors.primary,
    fontFamily: Fonts.mono,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  formContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    fontFamily: Fonts.mono,
    marginBottom: 20,
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
  input: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: Fonts.mono,
    color: Colors.text,
  },
  textArea: {
    minHeight: 100,
  },
  saveBtn: {
    backgroundColor: AuthColors.buttonFill,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  saveBtnText: {
    color: AuthColors.buttonText,
    fontSize: 15,
    fontWeight: '700',
    fontFamily: Fonts.mono,
  },
  removeBtn: {
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.danger,
  },
  removeBtnText: {
    color: Colors.danger,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Fonts.mono,
  },
  avatarWrap: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatarPhoto: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.border,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '700',
    fontFamily: Fonts.mono,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    fontFamily: Fonts.mono,
    textAlign: 'center',
  },
  specialty: {
    fontSize: 14,
    color: Colors.primary,
    fontFamily: Fonts.mono,
    textAlign: 'center',
    marginTop: 4,
  },
  bio: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 8,
  },
  section: {
    marginTop: 28,
  },
  sectionTitle: {
    fontSize: 13,
    color: Colors.text,
    fontFamily: Fonts.mono,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 6,
  },
  listBullet: {
    fontSize: 14,
    color: Colors.primary,
    marginRight: 10,
    marginTop: 1,
  },
  listText: {
    fontSize: 14,
    color: Colors.text,
    fontFamily: Fonts.mono,
    lineHeight: 20,
    flex: 1,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
    textAlign: 'center',
    marginTop: 40,
  },
});
