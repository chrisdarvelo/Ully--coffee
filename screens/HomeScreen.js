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
import { getBaristas, getFollowedBlogPosts } from '../services/BaristaService';
import { Colors, AuthColors, Fonts } from '../utils/constants';
import { LinearGradient } from 'expo-linear-gradient';
import CoffeeFlower from '../components/CoffeeFlower';
import SectionRow from '../components/SectionRow';
import RecipeArtCover from '../components/RecipeArtCover';
import SideDrawer from '../components/SideDrawer';
import { GoldGradient } from '../components/GoldGradient';

const CARD_WIDTH = 150;
const CARD_HEIGHT = 200;

// Farm-oriented coffee images — plants, processing, roasting, origin
const CAFE_IMAGES = [
  'https://images.unsplash.com/photo-1524350876685-274059332603?w=300&h=200&fit=crop', // coffee farm rows
  'https://images.unsplash.com/photo-1611070960620-f0e3e2b1d082?w=300&h=200&fit=crop', // coffee cherries on branch
  'https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=300&h=200&fit=crop', // green beans drying
  'https://images.unsplash.com/photo-1610632380989-680fe40816c6?w=300&h=200&fit=crop', // coffee roasting
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&h=200&fit=crop', // coffee farm landscape
  'https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=300&h=200&fit=crop', // roasted beans close up
  'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=300&h=200&fit=crop', // green coffee plants
  'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=300&h=200&fit=crop', // harvest baskets
  'https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=300&h=200&fit=crop', // cupping session
  'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=300&h=200&fit=crop', // plantation aerial
];

const COFFEE_IMAGES = [
  'https://images.unsplash.com/photo-1524350876685-274059332603?w=300&h=200&fit=crop', // coffee farm
  'https://images.unsplash.com/photo-1611070960620-f0e3e2b1d082?w=300&h=200&fit=crop', // cherries
  'https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=300&h=200&fit=crop', // drying beds
  'https://images.unsplash.com/photo-1610632380989-680fe40816c6?w=300&h=200&fit=crop', // roasting
  'https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=300&h=200&fit=crop', // roasted beans
  'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=300&h=200&fit=crop', // coffee plants
  'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=300&h=200&fit=crop', // farm workers
  'https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=300&h=200&fit=crop', // cupping
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&h=200&fit=crop', // landscape
  'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=300&h=200&fit=crop', // plantation
];

const COFFEE_FUN_FACTS = [
  'Coffee is the seed of a cherry-like fruit. Coffee trees produce sweet cherries that turn bright red when ripe.',
  'Brazil produces about 1/3 of the world\'s coffee, making it the largest producer for over 150 years.',
  'A coffee tree takes 3-5 years to produce its first crop. Patience is part of the process.',
  'The word "espresso" means "pressed out" in Italian, referring to how the coffee is made under pressure.',
  'Coffee was discovered by an Ethiopian goat herder named Kaldi who noticed his goats dancing after eating coffee cherries.',
  'There are over 120 species of coffee, but we mainly drink two: Arabica (60%) and Robusta (40%).',
  'Coffee is grown in the "Bean Belt" — the area between the Tropics of Cancer and Capricorn.',
  'A single coffee tree produces about 1-2 pounds of roasted coffee per year.',
  'Green coffee beans can be stored for over a year, but roasted beans start losing flavor within weeks.',
  'Water temperature for espresso should be between 195°F and 205°F (90-96°C) for optimal extraction.',
  'The crema on espresso is created by CO2 gas trapped in oils, released under pressure during brewing.',
  'Coffee cherries are usually picked by hand. A skilled picker can harvest 100-200 pounds per day.',
  'Honey processing doesn\'t involve honey — it refers to the sticky mucilage left on the bean during drying.',
  'Light roasts actually have more caffeine than dark roasts. Roasting burns off caffeine.',
  'The first webcam was invented at Cambridge to monitor a coffee pot so researchers wouldn\'t make wasted trips.',
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
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [funFact] = useState(() => COFFEE_FUN_FACTS[Math.floor(Math.random() * COFFEE_FUN_FACTS.length)]);

  const loadData = useCallback(async () => {
    const uid = user?.uid;
    const [prof, articles, recs, baristaList, cafeList, blogList] = await Promise.all([
      uid ? getProfile(uid) : null,
      getNews(),
      uid ? getRecipes(uid) : [],
      uid ? getBaristas(uid) : [],
      uid ? getCafes(uid) : [],
      uid ? getFollowedBlogPosts(uid) : [],
    ]);
    setProfile(prof);
    setNews(articles);
    setRecipes(recs);
    setBaristas(baristaList);
    setCafes(cafeList);
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
      navigation.navigate('AI');
    }
  };

  const renderNewsCard = ({ item, index }) => (
    <TouchableOpacity
      style={styles.imageCard}
      onPress={() => Linking.openURL(item.link)}
      activeOpacity={0.7}
    >
      <View style={styles.cardImageWrap}>
        <Image
          source={{ uri: COFFEE_IMAGES[index % COFFEE_IMAGES.length] }}
          style={styles.cardImage}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.imageOverlay}
        />
      </View>
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
      <View>
        {item.avatarUrl ? (
          <Image source={{ uri: item.avatarUrl }} style={[styles.baristaPhoto, item.followed && styles.baristaPhotoFollowed]} />
        ) : (
          <View style={[styles.baristaAvatarFallback, { backgroundColor: item.avatarColor || Colors.primary }]}>
            <Text style={styles.baristaAvatarText}>
              {item.name.split(' ').map((w) => w[0]).join('')}
            </Text>
          </View>
        )}
        {item.followed && (
          <View style={styles.followBadge}>
            <Text style={styles.followBadgeText}>{'\u2713'}</Text>
          </View>
        )}
      </View>
      <Text style={styles.baristaName} numberOfLines={1}>{item.name.split(' ')[0]}</Text>
    </TouchableOpacity>
  );

  const renderCafeCard = ({ item, index }) => (
    <TouchableOpacity
      style={styles.imageCard}
      onPress={() => navigation.navigate('CafeDetail', { cafe: item })}
      activeOpacity={0.7}
    >
      <View style={styles.cardImageWrap}>
        <Image
          source={{ uri: CAFE_IMAGES[index % CAFE_IMAGES.length] }}
          style={styles.cardImage}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.imageOverlay}
        />
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.name}</Text>
        {item.location ? (
          <Text style={styles.cardSubtitle} numberOfLines={1}>{item.location}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );

  const renderBlogCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => Linking.openURL(item.url)}
      activeOpacity={0.7}
    >
      <View style={styles.blogHeader}>
        <Image
          source={{ uri: item.baristaAvatarUrl }}
          style={styles.bloggerAvatar}
        />
        <Text style={styles.cardSource}>{item.source}</Text>
      </View>
      <Text style={styles.blogTitle} numberOfLines={4}>{item.title}</Text>
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
            onPress={() => setDrawerOpen(true)}
            activeOpacity={0.7}
            style={{ borderRadius: 20, overflow: 'hidden' }}
          >
            {profile?.avatarUri ? (
              <Image source={{ uri: profile.avatarUri }} style={styles.profileBtnImage} />
            ) : (
              <GoldGradient style={styles.profileBtn}>
                <Text style={styles.profileBtnText}>
                  {name.charAt(0).toUpperCase()}
                </Text>
              </GoldGradient>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.funFactCard}>
          <Text style={styles.funFactLabel}>Did you know?</Text>
          <Text style={styles.funFactText}>{funFact}</Text>
        </View>

        <View>
          <SectionRow
            title="Your Recipes"
            data={recipes}
            renderItem={renderRecipeCard}
            keyExtractor={(item) => item.id}
            onAdd={() => navigation.navigate('RecipeDetail', { isNew: true })}
            emptyText="Tap + to create your first recipe"
          />
        </View>

        <View>
          <SectionRow
            title="Daily News"
            data={news}
            renderItem={renderNewsCard}
            keyExtractor={(item, i) => `news-${i}`}
            emptyText="Pull down to refresh"
          />
        </View>

        <View>
          <SectionRow
            title="Baristas"
            data={baristas}
            renderItem={renderBaristaCard}
            keyExtractor={(item) => item.id}
          />
        </View>

        <View>
          <SectionRow
            title="Cafes"
            data={cafes}
            renderItem={renderCafeCard}
            keyExtractor={(item) => item.id}
            onAdd={() => navigation.navigate('CafeDetail', { isNew: true })}
            emptyText="Tap + to save your favorite cafes"
          />
        </View>

        <View>
          <SectionRow
            title="Blogs"
            data={blogs}
            renderItem={renderBlogCard}
            keyExtractor={(item, i) => `blog-${i}`}
            emptyText="Follow baristas to see their posts here"
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
    justifyContent: 'center',
    alignItems: 'center',
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
  funFactCard: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
    padding: 16,
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  funFactLabel: {
    fontSize: 11,
    color: Colors.primary,
    fontFamily: Fonts.mono,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  funFactText: {
    fontSize: 13,
    color: Colors.text,
    fontFamily: Fonts.mono,
    lineHeight: 19,
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
  cardImageWrap: {
    position: 'relative',
  },
  cardImage: {
    width: CARD_WIDTH,
    height: 90,
    backgroundColor: Colors.border,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 35,
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
  blogHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  blogTitle: {
    fontSize: 13,
    color: Colors.textSecondary,
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
  baristaPhotoFollowed: {
    borderWidth: 3,
    borderColor: '#C8923C',
  },
  followBadge: {
    position: 'absolute',
    bottom: 8,
    right: 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#C8923C',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.background,
  },
  followBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
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
