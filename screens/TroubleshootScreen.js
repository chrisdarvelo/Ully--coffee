import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Colors, Fonts, DiagnosticTypes } from '../utils/constants';

export default function TroubleshootScreen({ navigation: tabNav }) {
  const navigation = tabNav.getParent();
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Troubleshoot</Text>
        <Text style={styles.subtitle}>Pick a diagnostic to get started</Text>
      </View>

      <View style={styles.grid}>
        {Object.entries(DiagnosticTypes).map(([key, value]) => (
          <TouchableOpacity
            key={key}
            style={styles.card}
            onPress={() => navigation.navigate('Diagnostic', { type: key })}
            activeOpacity={0.7}
          >
            <Text style={styles.cardIcon}>{value.icon}</Text>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{value.label}</Text>
              <Text style={styles.cardDescription}>{value.description}</Text>
            </View>
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
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    fontFamily: Fonts.mono,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
    marginTop: 4,
  },
  grid: {
    padding: 24,
    paddingTop: 16,
    gap: 10,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardIcon: {
    fontSize: 28,
    marginRight: 14,
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    fontFamily: Fonts.mono,
    marginBottom: 3,
  },
  cardDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
    lineHeight: 18,
  },
});
