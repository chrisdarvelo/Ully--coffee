import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native';
import { Colors, Fonts } from '../utils/constants';

export default function ResultScreen({ route, navigation }) {
  const { photo, diagnosis } = route.params;

  return (
    <ScrollView style={styles.container}>
      {photo && (
        <Image source={{ uri: photo }} style={styles.photo} />
      )}

      <View style={styles.content}>
        <Text style={styles.title}>Diagnosis</Text>

        <View style={styles.diagnosisCard}>
          <Text style={styles.diagnosisText}>{diagnosis}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => navigation.navigate('Tabs', { screen: 'Home' })}
          >
            <Text style={styles.doneButtonText}>Back to Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.newDiagnosisButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.newDiagnosisButtonText}>New Diagnosis</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  photo: {
    width: '100%',
    height: 220,
    backgroundColor: Colors.border,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    fontFamily: Fonts.mono,
    marginBottom: 16,
  },
  diagnosisCard: {
    backgroundColor: Colors.card,
    padding: 18,
    borderRadius: 10,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  diagnosisText: {
    fontSize: 14,
    color: Colors.text,
    fontFamily: Fonts.mono,
    lineHeight: 22,
  },
  buttonContainer: {
    gap: 10,
  },
  doneButton: {
    backgroundColor: Colors.text,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: Fonts.mono,
  },
  newDiagnosisButton: {
    backgroundColor: 'transparent',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  newDiagnosisButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts.mono,
  },
});
