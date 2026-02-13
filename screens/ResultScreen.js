import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image 
} from 'react-native';
import { Colors } from '../utils/constants';

export default function ResultScreen({ route, navigation }) {
  const { photo, diagnosis, type } = route.params;

  return (
    <ScrollView style={styles.container}>
      {photo && (
        <Image source={{ uri: photo }} style={styles.photo} />
      )}

      <View style={styles.content}>
        <Text style={styles.title}>AI Diagnosis</Text>
        
        <View style={styles.diagnosisCard}>
          <Text style={styles.diagnosisText}>{diagnosis}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => navigation.navigate('Home')}
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

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            💡 Tip: Save this diagnosis or share with your team
          </Text>
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
    height: 250,
    backgroundColor: Colors.card,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 20,
  },
  diagnosisCard: {
    backgroundColor: Colors.card,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: Colors.success,
  },
  diagnosisText: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
  },
  buttonContainer: {
    gap: 10,
  },
  doneButton: {
    backgroundColor: Colors.primary,
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
  },
  doneButtonText: {
    color: Colors.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
  newDiagnosisButton: {
    backgroundColor: 'transparent',
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  newDiagnosisButtonText: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: Colors.card,
    borderRadius: 8,
    alignItems: 'center',
  },
  footerText: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
});
