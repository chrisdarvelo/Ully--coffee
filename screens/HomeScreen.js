import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Colors, DiagnosticTypes } from '../utils/constants';

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Ully Coffee</Text>
        <Text style={styles.tagline}>AI-Powered Coffee Diagnostics</Text>
      </View>

      <View style={styles.grid}>
        {Object.entries(DiagnosticTypes).map(([key, value]) => (
          <TouchableOpacity
            key={key}
            style={styles.card}
            onPress={() => navigation.navigate('Diagnostic', { type: key })}
          >
            <Text style={styles.cardIcon}>{value.icon}</Text>
            <Text style={styles.cardTitle}>{value.label}</Text>
            <Text style={styles.cardDescription}>{value.description}</Text>
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
  header: {
    padding: 30,
    paddingTop: 60,
    alignItems: 'center',
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  grid: {
    padding: 15,
    gap: 12,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  cardIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
