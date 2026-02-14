import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors, Fonts } from '../utils/constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = SCREEN_WIDTH * 0.50;

const MENU_ITEMS = [
  { key: 'news', label: 'Daily News' },
  { key: 'recipes', label: 'Recipes' },
  { key: 'baristas', label: 'Baristas' },
  { key: 'cafes', label: 'Cafes' },
  { key: 'blogs', label: 'Blogs' },
  { key: 'divider' },
  { key: 'profile', label: 'Profile' },
];

export default function SideDrawer({ visible, onClose, onNavigate, userName }) {
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 240,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 240,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, fadeAnim]);

  if (!visible && slideAnim._value === -DRAWER_WIDTH) {
    return null;
  }

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents={visible ? 'auto' : 'none'}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeAnim }]}>
          <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill} />
          <View style={styles.overlay} />
        </Animated.View>
      </TouchableWithoutFeedback>

      <Animated.View
        style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}
      >
        <TouchableOpacity
          style={styles.drawerHeader}
          activeOpacity={0.7}
          onPress={() => onNavigate('profile')}
        >
          <View style={styles.avatarContainer}>
            <View style={styles.drawerAvatar}>
              <Text style={styles.drawerAvatarText}>
                {userName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.editBadge}>
              <Text style={styles.editBadgeIcon}>{'\u270E'}</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.menuList}>
          {MENU_ITEMS.map((item) => {
            if (item.key === 'divider') {
              return <View key="divider" style={styles.divider} />;
            }
            return (
              <TouchableOpacity
                key={item.key}
                style={styles.menuItem}
                activeOpacity={0.6}
                onPress={() => onNavigate(item.key)}
              >
                <Text style={styles.menuLabel}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.bottomLine} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: DRAWER_WIDTH,
    backgroundColor: 'rgba(245, 240, 235, 0.64)',
    borderRightWidth: 1,
    borderRightColor: Colors.border,
    paddingTop: 64,
    borderBottomRightRadius: 16,
  },
  drawerHeader: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 44,
    height: 44,
  },
  drawerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.text,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerAvatarText: {
    color: Colors.background,
    fontSize: 17,
    fontWeight: '700',
    fontFamily: Fonts.mono,
  },
  editBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.background,
  },
  editBadgeIcon: {
    color: '#FFFFFF',
    fontSize: 9,
  },
  menuList: {
    paddingTop: 12,
    paddingHorizontal: 12,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  menuLabel: {
    fontSize: 15,
    color: '#555555',
    fontFamily: Fonts.mono,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 6,
    marginHorizontal: 12,
  },
  bottomLine: {
    height: 1,
    backgroundColor: Colors.border,
    marginTop: 6,
    marginHorizontal: 24,
    marginBottom: 28,
  },
});
