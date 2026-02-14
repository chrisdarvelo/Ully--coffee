import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { auth } from '../services/FirebaseConfig';
import { savePost, deletePost } from '../services/PostService';
import { Colors, Fonts } from '../utils/constants';
import { sanitizeText } from '../utils/validation';

export default function BlogWriteScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const post = route.params?.post;
  const isNew = route.params?.isNew;
  const uid = auth.currentUser?.uid;

  const [title, setTitle] = useState(post?.title || '');
  const [body, setBody] = useState(post?.body || '');

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Title required', 'Please enter a post title.');
      return;
    }
    await savePost(uid, {
      ...post,
      id: post?.id,
      title: sanitizeText(title, 200),
      body: sanitizeText(body, 5000),
    });
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert('Delete Post', `Remove "${post?.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deletePost(uid, post.id);
          navigation.goBack();
        },
      },
    ]);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${title}\n\n${body}\n\nShared from Ully Coffee`,
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
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Post title"
          placeholderTextColor={Colors.textSecondary}
        />

        <Text style={styles.label}>Body</Text>
        <TextInput
          style={[styles.input, styles.bodyArea]}
          value={body}
          onChangeText={setBody}
          placeholder="Write your post..."
          placeholderTextColor={Colors.textSecondary}
          multiline
          textAlignVertical="top"
        />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.7}>
          <Text style={styles.saveBtnText}>{isNew ? 'Create' : 'Save'}</Text>
        </TouchableOpacity>

        {!isNew && post?.id && (
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete} activeOpacity={0.7}>
            <Text style={styles.deleteBtnText}>Delete Post</Text>
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
  bodyArea: {
    minHeight: 200,
  },
  saveBtn: {
    backgroundColor: Colors.text,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  saveBtnText: {
    color: Colors.background,
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
