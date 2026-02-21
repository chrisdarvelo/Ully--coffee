import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { CameraView } from 'expo-camera';
import { Fonts } from '../../utils/constants';
import { CameraMode } from '../../hooks/useCamera';

interface CameraModalProps {
  visible: boolean;
  cameraRef: React.RefObject<CameraView>;
  recording: boolean;
  cameraMode: CameraMode;
  onClose: () => void;
  onTakePicture: () => Promise<void>;
  onStartBurst: () => void;
  onStopBurst: () => void;
}

export default function CameraModal({
  visible,
  cameraRef,
  recording,
  cameraMode,
  onClose,
  onTakePicture,
  onStartBurst,
  onStopBurst
}: CameraModalProps) {
  if (!visible) return null;

  const cameraInstruction = recording
    ? 'Recording... release to stop'
    : cameraMode === 'scan'
      ? 'Tap for photo, hold for video'
      : 'Tap for photo, hold to record extraction';

  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent>
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <CameraView style={styles.camera} ref={cameraRef} facing="back" />
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          <View style={styles.cameraOverlay}>
            <View style={styles.instructionBox}>
              <Text style={styles.instructionBoxText}>
                {cameraInstruction}
              </Text>
            </View>
            <View style={styles.scanFrame}>
              <View style={[styles.scanCorner, styles.scanTopLeft]} />
              <View style={[styles.scanCorner, styles.scanTopRight]} />
              <View style={[styles.scanCorner, styles.scanBottomLeft]} />
              <View style={[styles.scanCorner, styles.scanBottomRight]} />
            </View>
          </View>
          <View style={styles.cameraControls}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={onClose}
            >
              <Text style={styles.backButtonText}>{'\u2190'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.captureButton, recording && styles.captureButtonRecording]}
              onPress={recording ? onStopBurst : onTakePicture}
              onLongPress={onStartBurst}
              delayLongPress={400}
              activeOpacity={0.7}
            >
              <View style={recording ? styles.captureStopInner : styles.captureButtonInner} />
            </TouchableOpacity>
            <View style={{ width: 48 }} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  scanFrame: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 40,
  },
  scanCorner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#fff',
  },
  scanTopLeft: {
    top: 0,
    left: 30,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  scanTopRight: {
    top: 0,
    right: 30,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  scanBottomLeft: {
    bottom: 0,
    left: 30,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  scanBottomRight: {
    bottom: 0,
    right: 30,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 30,
    paddingBottom: 50,
  },
  backButton: {
    padding: 10,
    width: 48,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 28,
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
  captureButtonRecording: {
    borderColor: '#e74c3c',
    backgroundColor: '#e74c3c',
  },
  captureStopInner: {
    width: 28,
    height: 28,
    borderRadius: 4,
    backgroundColor: 'white',
  },
});
