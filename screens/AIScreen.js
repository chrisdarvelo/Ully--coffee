import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Colors, Fonts } from '../utils/constants';
import CoffeeFlower from '../components/CoffeeFlower';

export default function AIScreen({ navigation: tabNav }) {
  const navigation = tabNav.getParent();
  const features = [
    {
      key: 'extraction',
      title: 'Analyze Extraction',
      desc: 'Snap a photo of your shot and get instant feedback',
    },
    {
      key: 'part',
      title: 'Identify Parts',
      desc: 'Photograph a machine part to find the name and source',
    },
    {
      key: 'dialin',
      title: 'Dial-In Help',
      desc: 'Get grind and dose suggestions from your shot photo',
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <CoffeeFlower size={48} />
        <Text style={styles.title}>Ully AI</Text>
        <Text style={styles.subtitle}>
          Your coffee companion, powered by vision AI
        </Text>
      </View>

      <View style={styles.section}>
        {features.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={styles.card}
            onPress={() => navigation.navigate('Diagnostic', { type: f.key })}
            activeOpacity={0.7}
          >
            <Text style={styles.cardTitle}>{f.title}</Text>
            <Text style={styles.cardDesc}>{f.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    paddingTop: 64,
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    fontFamily: Fonts.mono,
    marginTop: 12,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 24,
    paddingTop: 8,
    gap: 10,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    fontFamily: Fonts.mono,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
    lineHeight: 18,
  },
});
