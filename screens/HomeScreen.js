import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  RefreshControl,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../services/FirebaseConfig';
import { getProfile } from '../services/ProfileService';
import { getNews } from '../services/NewsService';
import { getRecipes } from '../services/RecipeService';
import { getCafes } from '../services/CafeService';
import { getBaristas } from '../services/BaristaService';
import { getPosts } from '../services/PostService';
import { getBlogs } from '../services/BlogService';
import { Colors, AuthColors, Fonts } from '../utils/constants';
import CoffeeFlower from '../components/CoffeeFlower';
import SectionRow from '../components/SectionRow';
import RecipeArtCover from '../components/RecipeArtCover';
import SideDrawer from '../components/SideDrawer';

const CARD_WIDTH = 150;
const CARD_HEIGHT = 200;

const BLOGGER_AVATARS = [
  'https://randomuser.me/api/portraits/men/52.jpg',
  'https://randomuser.me/api/portraits/women/65.jpg',
  'https://randomuser.me/api/portraits/men/22.jpg',
  'https://randomuser.me/api/portraits/women/17.jpg',
  'https://randomuser.me/api/portraits/men/45.jpg',
  'https://randomuser.me/api/portraits/women/28.jpg',
  'https://randomuser.me/api/portraits/men/67.jpg',
  'https://randomuser.me/api/portraits/women/41.jpg',
  'https://randomuser.me/api/portraits/men/33.jpg',
  'https://randomuser.me/api/portraits/women/55.jpg',
];

const CAFE_IMAGES = [
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=300&h=200&fit=crop',
  'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=300&h=200&fit=crop',
  'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=300&h=200&fit=crop',
  'https://images.unsplash.com/photo-1559305616-3f99cd43e353?w=300&h=200&fit=crop',
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&h=200&fit=crop',
  'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=300&h=200&fit=crop',
  'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=300&h=200&fit=crop',
  'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=300&h=200&fit=crop',
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=200&fit=crop',
  'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=300&h=200&fit=crop',
];

const COFFEE_IMAGES = [
  'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=300&h=200&fit=crop',
  'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=300&h=200&fit=crop',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=200&fit=crop',
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&h=200&fit=crop',
  'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=300&h=200&fit=crop',
  'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=300&h=200&fit=crop',
  'https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=300&h=200&fit=crop',
  'https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=300&h=200&fit=crop',
  'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=300&h=200&fit=crop',
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=200&fit=crop',
];

export default function HomeScreen() {
  const navigation = useNavigation();
  const scrollRef = useRef(null);
  const user = auth.currentUser;
  const name = user?.email ? user.email.split('@')[0] : 'barista';

  const [profile, setProfile] = useState(null);
  const [news, setNews] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [baristas, setBaristas] = useState([]);
  const [cafes, setCafes] = useState([]);
  const [posts, setPosts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const loadData = useCallback(async () => {
    const uid = user?.uid;
    const [prof, articles, recs, baristaList, cafeList, postList, blogList] = await Promise.all([
      uid ? getProfile(uid) : null,
      getNews(),
      uid ? getRecipes(uid) : [],
      uid ? getBaristas(uid) : [],
      uid ? getCafes(uid) : [],
      uid ? getPosts(uid) : [],
      getBlogs(),
    ]);
    setProfile(prof);
    setNews(articles);
    setRecipes(recs);
    setBaristas(baristaList);
    setCafes(cafeList);
    setPosts(postList);
    setBlogs(blogList);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (!loading) loadData();
    });
    return unsubscribe;
  }, [navigation, loading, loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleDrawerNavigate = (key) => {
    setDrawerOpen(false);
    if (key === 'ai') {
      navigation.navigate('AI');
    } else if (key === 'editProfile' || key === 'settings') {
      navigation.navigate('Profile');
    } else if (key === 'resources') {
      navigation.getParent().navigate('Diagnostic', { type: 'resources' });
    }
  };


  const formatDate = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  const renderNewsCard = ({ item, index }) => (
    <TouchableOpacity
      style={styles.imageCard}
      onPress={() => Linking.openURL(item.link)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: COFFEE_IMAGES[index % COFFEE_IMAGES.length] }}
        style={styles.cardImage}
      />
      <View style={styles.cardBody}>
        <Text style={styles.cardSource}>{item.source}</Text>
        <Text style={styles.cardTitle} numberOfLines={3}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderRecipeCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
      activeOpacity={0.7}
    >
      <View style={styles.recipeArtWrap}>
        <RecipeArtCover artSeed={item.artSeed} artStyle={item.artStyle} size={CARD_WIDTH - 24} />
      </View>
      <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.cardSubtitle} numberOfLines={1}>{item.method}</Text>
    </TouchableOpacity>
  );

  const renderBaristaCard = ({ item }) => (
    <TouchableOpacity
      style={styles.baristaCard}
      onPress={() => navigation.navigate('BaristaDetail', { barista: item })}
      activeOpacity={0.7}
    >
      {item.avatarUrl ? (
        <Image source={{ uri: item.avatarUrl }} style={styles.baristaPhoto} />
      ) : (
        <View style={[styles.baristaAvatarFallback, { backgroundColor: item.avatarColor || Colors.primary }]}>
          <Text style={styles.baristaAvatarText}>
            {item.name.split(' ').map((w) => w[0]).join('')}
          </Text>
        </View>
      )}
      <Text style={styles.baristaName} numberOfLines={1}>{item.name.split(' ')[0]}</Text>
    </TouchableOpacity>
  );

  const renderCafeCard = ({ item, index }) => (
    <TouchableOpacity
      style={styles.imageCard}
      onPress={() => navigation.navigate('CafeDetail', { cafe: item })}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: CAFE_IMAGES[index % CAFE_IMAGES.length] }}
        style={styles.cardImage}
      />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.name}</Text>
        {item.location ? (
          <Text style={styles.cardSubtitle} numberOfLines={1}>{item.location}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );

  const renderPostCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('BlogWrite', { post: item })}
      activeOpacity={0.7}
    >
      <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.postPreview} numberOfLines={4}>{item.body}</Text>
      <Text style={styles.cardDate}>{formatDate(item.updatedAt || item.createdAt)}</Text>
    </TouchableOpacity>
  );

  const renderBlogCard = ({ item, index }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => Linking.openURL(item.link)}
      activeOpacity={0.7}
    >
      <View style={styles.blogHeader}>
        <Image
          source={{ uri: BLOGGER_AVATARS[index % BLOGGER_AVATARS.length] }}
          style={styles.bloggerAvatar}
        />
        <Text style={styles.cardSource}>{item.source}</Text>
      </View>
      <Text style={styles.blogTitle} numberOfLines={4}>{item.title}</Text>
      <Text style={styles.cardDate}>{formatDate(item.date)}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingWrap]}>
        <CoffeeFlower size={40} spinning />
        <Text style={styles.loadingText}>Brewing your feed...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => setDrawerOpen(true)}
            activeOpacity={0.7}
          >
            {profile?.avatarUri ? (
              <Image source={{ uri: profile.avatarUri }} style={styles.profileBtnImage} />
            ) : (
              <Text style={styles.profileBtnText}>
                {name.charAt(0).toUpperCase()}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View>
          <SectionRow
            title="Your Recipes"
            data={recipes}
            renderItem={renderRecipeCard}
            keyExtractor={(item) => item.id}
            onAdd={() => navigation.navigate('RecipeDetail', { isNew: true })}
          />
        </View>

        <View>
          <SectionRow
            title="Daily News"
            data={news}
            renderItem={renderNewsCard}
            keyExtractor={(item, i) => `news-${i}`}
          />
        </View>

        <View>
          <SectionRow
            title="Baristas"
            data={baristas}
            renderItem={renderBaristaCard}
            keyExtractor={(item) => item.id}
            onAdd={() => navigation.navigate('BaristaDetail', { isNew: true })}
          />
        </View>

        <View>
          <SectionRow
            title="Cafes"
            data={cafes}
            renderItem={renderCafeCard}
            keyExtractor={(item) => item.id}
            onAdd={() => navigation.navigate('CafeDetail', { isNew: true })}
          />
        </View>

        <View>
          <SectionRow
            title="Your Posts"
            data={posts}
            renderItem={renderPostCard}
            keyExtractor={(item) => item.id}
            onAdd={() => navigation.navigate('BlogWrite', { isNew: true })}
          />
        </View>

        <View>
          <SectionRow
            title="Blogs"
            data={blogs}
            renderItem={renderBlogCard}
            keyExtractor={(item, i) => `blog-${i}`}
          />
        </View>
      </ScrollView>

      <SideDrawer
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onNavigate={handleDrawerNavigate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 30,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 72,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AuthColors.buttonFill,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileBtnImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profileBtnText: {
    color: AuthColors.buttonText,
    fontSize: 17,
    fontWeight: '700',
    fontFamily: Fonts.mono,
  },
  loadingWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
    marginTop: 12,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: Colors.card,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'flex-start',
  },
  imageCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: Colors.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  cardImage: {
    width: CARD_WIDTH,
    height: 90,
    backgroundColor: Colors.border,
  },
  cardBody: {
    flex: 1,
    padding: 10,
  },
  cardSource: {
    fontSize: 10,
    color: Colors.primary,
    fontFamily: Fonts.mono,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 13,
    color: Colors.text,
    fontFamily: Fonts.mono,
    fontWeight: '600',
    lineHeight: 18,
  },
  cardSubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
    marginTop: 4,
  },
  cardDate: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
    marginTop: 'auto',
  },
  postPreview: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
    lineHeight: 16,
    marginTop: 6,
  },
  blogHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  blogTitle: {
    fontSize: 13,
    color: '#666666',
    fontFamily: Fonts.mono,
    fontWeight: '500',
    lineHeight: 18,
    marginTop: 4,
  },
  bloggerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.border,
    marginRight: 8,
  },
  recipeArtWrap: {
    alignItems: 'center',
    marginBottom: 8,
  },
  baristaCard: {
    width: 130,
    alignItems: 'center',
    paddingVertical: 8,
  },
  baristaPhoto: {
    width: 126,
    height: 126,
    borderRadius: 63,
    marginBottom: 10,
    backgroundColor: Colors.border,
  },
  baristaAvatarFallback: {
    width: 126,
    height: 126,
    borderRadius: 63,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  baristaAvatarText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    fontFamily: Fonts.mono,
  },
  baristaName: {
    fontSize: 13,
    color: Colors.text,
    fontFamily: Fonts.mono,
    fontWeight: '600',
    textAlign: 'center',
  },
  cafeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    alignSelf: 'center',
  },
  cafeIconText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: Fonts.mono,
  },
});
