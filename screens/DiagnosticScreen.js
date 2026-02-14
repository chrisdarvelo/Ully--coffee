import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import ClaudeService from '../services/ClaudeService';
import CoffeeFlower from '../components/CoffeeFlower';
import { Colors, AuthColors, Fonts } from '../utils/constants';

export default function DiagnosticScreen({ route, navigation }) {
  const { type } = route.params;
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const cameraRef = useRef(null);

  const titles = {
    extraction: 'Extraction & Dial-In',
    part: 'Scan',
    resources: 'Resources',
  };

  const instructions = {
    extraction: 'Capture espresso extraction showing flow pattern, portafilter, or finished shot for dial-in suggestions',
    part: 'Take clear photo of the part from multiple angles if possible',
    resources: 'Data analysis and volumetrics — coming soon',
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const p = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
        });
        setPhoto(p);
        setShowCamera(false);
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture. Please try again.');
      }
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled) {
        setPhoto(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const analyzePhoto = async () => {
    if (!photo) return;

    setIsAnalyzing(true);

    try {
      let result;
      if (type === 'part') {
        result = await ClaudeService.identifyPart(photo.base64);
      } else {
        result = await ClaudeService.diagnoseExtraction(
          photo.base64,
          'Unknown',
          instructions[type]
        );
      }

      navigation.navigate('Result', {
        photo: photo.uri,
        diagnosis: result,
        type: type,
      });

    } catch (error) {
      console.error('Analysis error:', error);
      Alert.alert(
        'Analysis Failed',
        'Could not analyze image. Check your API key.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!permission) {
    return (
      <View style={[styles.container, styles.centered]}>
        <CoffeeFlower size={60} spinning />
        <Text style={styles.brewingText}>Tamping...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Camera Access Needed</Text>
          <Text style={styles.permissionText}>
            Ully needs camera access to diagnose equipment issues
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (showCamera) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <CameraView style={styles.camera} ref={cameraRef} facing="back" />
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          <View style={styles.cameraOverlay}>
            <View style={styles.instructionBox}>
              <Text style={styles.instructionBoxText}>{instructions[type]}</Text>
            </View>
          </View>

          <View style={styles.cameraControls}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowCamera(false)}
            >
              <Text style={styles.controlButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>

            <View style={{ width: 80 }} />
          </View>
        </View>
      </View>
    );
  }

  if (isAnalyzing) {
    return (
      <View style={[styles.container, styles.centered]}>
        <CoffeeFlower size={100} spinning />
        <Text style={styles.brewingText}>Brewing...</Text>
      </View>
    );
  }

  if (type === 'resources') {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>{titles[type]}</Text>
          <Text style={styles.instruction}>{instructions[type]}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{titles[type]}</Text>
        <Text style={styles.instruction}>{instructions[type]}</Text>

        {photo ? (
          <View style={styles.photoPreview}>
            <Image source={{ uri: photo.uri }} style={styles.photoImage} />
            <TouchableOpacity
              style={styles.retakeButton}
              onPress={() => setPhoto(null)}
            >
              <Text style={styles.retakeButtonText}>Retake</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.photoButtons}>
            <TouchableOpacity
              style={styles.photoButton}
              onPress={() => setShowCamera(true)}
            >
              <Text style={styles.photoButtonText}>
                {type === 'part' ? 'Scan Part' : 'Take Photo'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.photoButton, styles.photoButtonOutline]}
              onPress={pickImage}
            >
              <Text style={[styles.photoButtonText, { color: Colors.text }]}>
                {type === 'part' ? 'Upload Photo' : 'Choose from Library'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {photo && (
          <TouchableOpacity
            style={styles.analyzeButton}
            onPress={analyzePhoto}
            disabled={isAnalyzing}
          >
            <Text style={styles.analyzeButtonText}>Analyze with Ully</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  brewingText: {
    color: Colors.textSecondary,
    fontSize: 15,
    fontFamily: Fonts.mono,
    marginTop: 20,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    fontFamily: Fonts.mono,
    marginBottom: 8,
  },
  instruction: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
    marginBottom: 28,
    lineHeight: 22,
  },
  photoButtons: {
    gap: 12,
  },
  photoButton: {
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: AuthColors.buttonFill,
  },
  photoButtonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  photoButtonText: {
    color: AuthColors.buttonText,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts.mono,
  },
  photoPreview: {
    alignItems: 'center',
  },
  photoImage: {
    width: '100%',
    height: 350,
    borderRadius: 10,
    marginBottom: 16,
  },
  retakeButton: {
    padding: 12,
    paddingHorizontal: 24,
    backgroundColor: Colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  retakeButtonText: {
    color: Colors.text,
    fontSize: 14,
    fontFamily: Fonts.mono,
  },
  analyzeButton: {
    backgroundColor: AuthColors.buttonFill,
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  analyzeButtonText: {
    color: AuthColors.buttonText,
    fontSize: 17,
    fontWeight: '700',
    fontFamily: Fonts.mono,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 20,
    paddingTop: 60,
  },
  instructionBox: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 15,
    borderRadius: 10,
  },
  instructionBoxText: {
    color: '#fff',
    fontSize: 15,
    textAlign: 'center',
    fontFamily: Fonts.mono,
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 30,
    paddingBottom: 50,
  },
  cancelButton: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 8,
    width: 80,
    alignItems: 'center',
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: Fonts.mono,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ccc',
  },
  captureButtonInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    fontFamily: Fonts.mono,
    marginBottom: 10,
  },
  permissionText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontFamily: Fonts.mono,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  permissionButton: {
    backgroundColor: AuthColors.buttonFill,
    padding: 14,
    borderRadius: 10,
    paddingHorizontal: 30,
  },
  permissionButtonText: {
    color: AuthColors.buttonText,
    fontSize: 15,
    fontWeight: '600',
    fontFamily: Fonts.mono,
  },
});
