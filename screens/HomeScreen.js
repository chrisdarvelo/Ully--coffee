import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { auth } from '../services/FirebaseConfig';
import { Colors, Fonts } from '../utils/constants';
import CoffeeFlower from '../components/CoffeeFlower';

export default function HomeScreen() {
  const user = auth.currentUser;
  const name = user?.email ? user.email.split('@')[0] : 'barista';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.logo}>Ully</Text>
          <View style={styles.flowerWrap}>
            <CoffeeFlower size={24} />
          </View>
        </View>
        <Text style={styles.greeting}>Hello, {name}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 64,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  logo: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    fontFamily: Fonts.mono,
  },
  flowerWrap: {
    marginLeft: 6,
    marginTop: 4,
  },
  greeting: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
  },
});
