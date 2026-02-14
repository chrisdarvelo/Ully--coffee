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

export default function SideDrawer({ visible, onClose, onNavigate, recentPages }) {
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

  const items = recentPages && recentPages.length > 0 ? recentPages : [];

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
        {items.length > 0 && (
          <View style={styles.menuList}>
            <Text style={styles.sectionLabel}>Recent</Text>
            {items.map((item, i) => (
              <TouchableOpacity
                key={`${item.key}-${i}`}
                style={styles.menuItem}
                activeOpacity={0.6}
                onPress={() => onNavigate(item.key, item.params)}
              >
                <Text style={styles.menuLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.divider} />

        <View style={styles.menuList}>
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.6}
            onPress={() => onNavigate('settings')}
          >
            <Text style={styles.menuLabel}>Settings</Text>
          </TouchableOpacity>
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
    paddingTop: 80,
    borderBottomRightRadius: 16,
  },
  sectionLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  menuList: {
    paddingTop: 8,
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
    marginHorizontal: 24,
  },
  bottomLine: {
    height: 1,
    backgroundColor: Colors.border,
    marginTop: 6,
    marginHorizontal: 24,
    marginBottom: 28,
  },
});
