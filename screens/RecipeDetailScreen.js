import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { auth } from '../services/FirebaseConfig';
import { saveRecipe, deleteRecipe } from '../services/RecipeService';
import { Colors, AuthColors, Fonts } from '../utils/constants';
import RecipeArtCover from '../components/RecipeArtCover';

export default function RecipeDetailScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const recipe = route.params?.recipe;
  const isNew = route.params?.isNew;
  const uid = auth.currentUser?.uid;

  const [name, setName] = useState(recipe?.name || '');
  const [method, setMethod] = useState(recipe?.method || '');
  const [description, setDescription] = useState(recipe?.description || '');

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Name required', 'Please enter a recipe name.');
      return;
    }
    await saveRecipe(uid, {
      ...recipe,
      id: recipe?.id,
      name: name.trim(),
      method: method.trim(),
      description: description.trim(),
      artSeed: recipe?.artSeed,
      artStyle: recipe?.artStyle,
    });
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert('Delete Recipe', `Remove "${recipe?.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteRecipe(uid, recipe.id);
          navigation.goBack();
        },
      },
    ]);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${name}\n\nMethod: ${method}\n\n${description}\n\nShared from Ully Coffee`,
      });
    } catch {
      // share cancelled
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>{'\u2190'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare} style={styles.shareBtn}>
          <Text style={styles.shareText}>Share</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.artWrap}>
          <RecipeArtCover
            artSeed={recipe?.artSeed || 1}
            artStyle={recipe?.artStyle || 'lam'}
            size={200}
          />
        </View>

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Recipe name"
          placeholderTextColor={Colors.textSecondary}
        />

        <Text style={styles.label}>Method</Text>
        <TextInput
          style={styles.input}
          value={method}
          onChangeText={setMethod}
          placeholder="e.g. Pour Over, Espresso"
          placeholderTextColor={Colors.textSecondary}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Recipe details, ratios, notes..."
          placeholderTextColor={Colors.textSecondary}
          multiline
          textAlignVertical="top"
        />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.7}>
          <Text style={styles.saveBtnText}>{isNew ? 'Create' : 'Save'}</Text>
        </TouchableOpacity>

        {!isNew && recipe?.id && (
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete} activeOpacity={0.7}>
            <Text style={styles.deleteBtnText}>Delete Recipe</Text>
          </TouchableOpacity>
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
  shareBtn: {
    padding: 8,
  },
  shareText: {
    fontSize: 14,
    color: Colors.primary,
    fontFamily: Fonts.mono,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  artWrap: {
    alignItems: 'center',
    marginVertical: 20,
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
  deleteBtn: {
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.danger,
  },
  deleteBtnText: {
    color: Colors.danger,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Fonts.mono,
  },
});
