import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { auth } from '../services/FirebaseConfig';
import { toggleFollow } from '../services/BaristaService';
import { Colors, AuthColors, Fonts } from '../utils/constants';

export default function BaristaDetailScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const barista = route.params?.barista;
  const uid = auth.currentUser?.uid;

  const [followed, setFollowed] = useState(!!barista?.followed);

  const handleToggleFollow = async () => {
    if (!uid || !barista) return;
    const newState = await toggleFollow(uid, barista.id);
    setFollowed(newState);
  };

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
        <TouchableOpacity
          onPress={handleToggleFollow}
          style={[styles.followBtn, followed && styles.followBtnActive]}
          activeOpacity={0.7}
        >
          <Text style={[styles.followBtnText, followed && styles.followBtnTextActive]}>
            {followed ? 'Following' : 'Follow'}
          </Text>
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

        {barista.blogs?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Blogs</Text>
            {barista.blogs.map((b, i) => (
              <TouchableOpacity
                key={i}
                style={styles.listItem}
                onPress={() => Linking.openURL(b.url)}
                activeOpacity={0.6}
              >
                <Text style={styles.linkBullet}>{'\u203A'}</Text>
                <Text style={styles.linkText}>{b.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {barista.recipes?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recipes</Text>
            {barista.recipes.map((r, i) => (
              <TouchableOpacity
                key={i}
                style={styles.listItem}
                onPress={() => Linking.openURL(r.url)}
                activeOpacity={0.6}
              >
                <Text style={styles.linkBullet}>{'\u203A'}</Text>
                <Text style={styles.linkText}>{r.title}</Text>
              </TouchableOpacity>
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
  followBtn: {
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: AuthColors.buttonFill,
  },
  followBtnActive: {
    backgroundColor: AuthColors.buttonFill,
  },
  followBtnText: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: Fonts.mono,
    color: AuthColors.buttonFill,
  },
  followBtnTextActive: {
    color: AuthColors.buttonText,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
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
  linkBullet: {
    fontSize: 18,
    color: Colors.primary,
    marginRight: 10,
    marginTop: -1,
  },
  linkText: {
    fontSize: 14,
    color: Colors.primary,
    fontFamily: Fonts.mono,
    lineHeight: 20,
    flex: 1,
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
