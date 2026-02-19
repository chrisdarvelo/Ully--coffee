import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  FlatList,
  Modal,
  Alert,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
let ExpoSpeechRecognitionModule = null;
let useSpeechRecognitionEvent = () => {};
try {
  const speech = require('expo-speech-recognition');
  ExpoSpeechRecognitionModule = speech.ExpoSpeechRecognitionModule;
  useSpeechRecognitionEvent = speech.useSpeechRecognitionEvent;
} catch {
  // Native module not available (Expo Go) — mic button will show alert
}
import { GoldGradient } from '../components/GoldGradient';
import * as VideoThumbnails from 'expo-video-thumbnails';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Path, Line } from 'react-native-svg';
import { auth } from '../services/FirebaseConfig';
import ClaudeService from '../services/ClaudeService';
import { Colors, AuthColors, Fonts } from '../utils/constants';
import CoffeeFlower from '../components/CoffeeFlower';
import PaperBackground from '../components/PaperBackground';
import { ScanIcon, PortafilterIcon } from '../components/DiagnosticIcons';

const HISTORY_KEY = '@ully_chat_history';

const SYSTEM_PROMPT =
  'You are Ully, a coffee AI. You ONLY answer coffee-related questions — espresso, equipment, grinders, water chemistry, roasting, brewing, latte art, origins, processing, café management, barista techniques, and coffee culture.\n\nRules:\n- Answer immediately. No preamble, no self-introduction.\n- Keep responses short and practical.\n- Don\'t explain your background or qualifications.\n- Don\'t repeat what the user said.\n- Don\'t narrate what you\'re about to do — just do it.\n- Use bullet points for multi-step answers.\n- Non-coffee question? Say: "That\'s outside my expertise. Ask me anything about coffee."';

function MicIcon({ color, size }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3z" fill={color} />
      <Path d="M19 11a7 7 0 01-14 0" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M12 18v3M9 21h6" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function BookIcon({ color, size }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 19.5A2.5 2.5 0 016.5 17H20"
        stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      />
      <Path
        d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"
        stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      />
      <Line x1="9" y1="7" x2="16" y2="7" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
      <Line x1="9" y1="11" x2="14" y2="11" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
    </Svg>
  );
}

/**
 * Converts our internal message array into the Claude API format.
 * Internal messages: { role: 'user'|'ully', text, image? (base64) }
 * Claude API messages: { role: 'user'|'assistant', content: string|Array }
 */
function buildApiMessages(messages) {
  return messages.map((msg) => {
    const role = msg.role === 'ully' ? 'assistant' : 'user';
    if (msg.frames && msg.frames.length > 0) {
      // Multi-frame video analysis
      const content = msg.frames.map((frame) => ({
        type: 'image',
        source: { type: 'base64', media_type: 'image/jpeg', data: frame },
      }));
      content.push({ type: 'text', text: msg.text });
      return { role, content };
    }
    if (msg.image) {
      return {
        role,
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: 'image/jpeg', data: msg.image },
          },
          { type: 'text', text: msg.text },
        ],
      };
    }
    return { role, content: msg.text };
  });
}

/**
 * Extract evenly-spaced frames from a video and return as base64 strings.
 * Uses expo-video-thumbnails to grab frames at intervals.
 */
async function extractFrames(videoUri, count = 5, durationMs = 10000) {
  const frames = [];
  for (let i = 0; i < count; i++) {
    const time = Math.round((i / (count - 1)) * durationMs);
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
        time,
        quality: 0.7,
      });
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      frames.push(base64);
    } catch {
      // skip frames that fail (e.g. past end of video)
    }
  }
  return frames;
}

export default function AIScreen() {
  const user = auth.currentUser;
  const name = user?.email ? user.email.split('@')[0] : 'friend';

  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);

  // Camera state
  const [showCamera, setShowCamera] = useState(false);
  const [cameraMode, setCameraMode] = useState(null); // 'scan' | 'extraction'
  const [recording, setRecording] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  const inputRef = useRef(null);
  const scrollRef = useRef(null);
  const burstRef = useRef(null);
  const burstFramesRef = useRef([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await AsyncStorage.getItem(HISTORY_KEY);
      if (data) setHistory(JSON.parse(data));
    } catch (e) {}
  };

  const saveChat = useCallback(async (msgs) => {
    if (msgs.length === 0) return;
    const firstUserMsg = msgs.find((m) => m.role === 'user');
    const preview = firstUserMsg?.text || 'Chat';
    const entry = {
      id: Date.now().toString(),
      preview: preview.length > 50 ? preview.slice(0, 50) + '...' : preview,
      date: new Date().toLocaleDateString(),
      messages: msgs.map((m) => ({
        role: m.role,
        text: m.text,
        imageUri: m.imageUri,
        isVideo: !!m.frames,
      })),
    };
    const updated = [entry, ...history].slice(0, 50);
    setHistory(updated);
    try {
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch (e) {}
  }, [history]);

  useSpeechRecognitionEvent('result', (event) => {
    const transcript = event.results[0]?.transcript;
    if (transcript) {
      setQuery(transcript);
      if (event.isFinal) {
        setListening(false);
      }
    }
  });

  useSpeechRecognitionEvent('end', () => {
    setListening(false);
  });

  useSpeechRecognitionEvent('error', () => {
    setListening(false);
  });

  const toggleMic = async () => {
    if (!ExpoSpeechRecognitionModule) {
      Alert.alert('Not Available', 'Voice input requires a development build.');
      return;
    }
    if (listening) {
      ExpoSpeechRecognitionModule.stop();
      setListening(false);
      return;
    }
    const { granted } = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!granted) {
      Alert.alert('Permission Required', 'Microphone access is needed for voice input.');
      return;
    }
    setQuery('');
    setListening(true);
    ExpoSpeechRecognitionModule.start({
      lang: 'en-US',
      interimResults: true,
    });
  };

  const sendToUlly = async (newMessages) => {
    setLoading(true);
    try {
      const apiMessages = buildApiMessages(newMessages);
      const result = await ClaudeService.chatWithHistory(apiMessages, SYSTEM_PROMPT, 1500);
      const withReply = [...newMessages, { role: 'ully', text: result }];
      setMessages(withReply);
      saveChat(withReply);
    } catch (error) {
      const withError = [
        ...newMessages,
        { role: 'ully', text: 'Could not reach Ully AI. Check your connection and try again.' },
      ];
      setMessages(withError);
    } finally {
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const handleSubmit = async () => {
    const text = query.trim();
    if (!text || loading) return;

    const userMsg = { role: 'user', text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setQuery('');
    await sendToUlly(newMessages);
  };

  const openCamera = (mode) => {
    if (!permission?.granted) {
      requestPermission().then((result) => {
        if (result.granted) {
          setCameraMode(mode);
          setShowCamera(true);
        }
      });
      return;
    }
    setCameraMode(mode);
    setShowCamera(true);
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;
    try {
      const p = await cameraRef.current.takePictureAsync({ quality: 0.8, base64: true });
      handlePhotoCaptured(p);
    } catch (error) {
      Alert.alert('Error', 'Failed to take picture. Please try again.');
    }
  };

  const startBurst = () => {
    if (!cameraRef.current || recording) return;
    setRecording(true);
    burstFramesRef.current = [];
    // Take first frame immediately, then every 2s, up to 5 frames
    const captureFrame = async () => {
      if (!cameraRef.current) return;
      try {
        const p = await cameraRef.current.takePictureAsync({ quality: 0.6, base64: true });
        burstFramesRef.current.push(p.base64);
        if (burstFramesRef.current.length >= 5) stopBurst();
      } catch {
        // skip failed frames
      }
    };
    captureFrame();
    burstRef.current = setInterval(captureFrame, 2000);
  };

  const stopBurst = () => {
    if (burstRef.current) {
      clearInterval(burstRef.current);
      burstRef.current = null;
    }
    if (!recording && burstFramesRef.current.length === 0) return;
    setRecording(false);
    const frames = [...burstFramesRef.current];
    burstFramesRef.current = [];
    if (frames.length > 0) {
      handleBurstCaptured(frames);
    }
  };

  const handleBurstCaptured = async (frames) => {
    setShowCamera(false);

    const promptText =
      cameraMode === 'scan'
        ? `Identify this coffee equipment from ${frames.length} photos taken in sequence. Provide: part name, manufacturer/model compatibility, what it does, signs of wear or damage, and where to source replacement parts.`
        : `Analyze this espresso extraction sequence (${frames.length} frames captured over time). Observe the flow pattern, color progression, and consistency. Provide: what you observe across the sequence, channeling or uneven extraction, whether it looks under/over-extracted, recommended grind, dose, or timing adjustments. Be specific and actionable.`;

    const userMsg = {
      role: 'user',
      text: promptText,
      frames,
    };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    await sendToUlly(newMessages);
  };

  const pickMedia = async (mode) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        quality: 0.8,
        base64: true,
        videoMaxDuration: 10,
      });
      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];
        setCameraMode(mode);
        if (asset.type === 'video') {
          handleVideoCaptured(asset.uri);
        } else {
          handlePhotoCaptured(asset);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick media.');
    }
  };

  const handlePhotoCaptured = async (photo) => {
    setShowCamera(false);

    const promptText =
      cameraMode === 'scan'
        ? 'Identify this coffee equipment part. Provide: part name, manufacturer/model compatibility, what it does, signs of wear or damage, recommended replacement part numbers, and where to source it.'
        : 'Analyze this espresso extraction image. Provide: what you observe, potential issues, recommended fixes or adjustments, and any parts that may need replacement. Be specific and actionable.';

    const userMsg = {
      role: 'user',
      text: promptText,
      image: photo.base64,
      imageUri: photo.uri,
    };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    await sendToUlly(newMessages);
  };

  const handleVideoCaptured = async (videoUri) => {
    setShowCamera(false);
    setLoading(true);

    try {
      const frames = await extractFrames(videoUri, 5, 10000);
      if (frames.length === 0) {
        Alert.alert('Error', 'Could not extract frames from video.');
        setLoading(false);
        return;
      }

      const promptText =
        cameraMode === 'scan'
          ? `Identify this coffee equipment from ${frames.length} video frames. Provide: part name, manufacturer/model compatibility, what it does, signs of wear or damage, and where to source replacement parts.`
          : `Analyze this espresso extraction sequence (${frames.length} frames from a video). Observe the flow pattern, color progression, and timing. Provide: what you observe across the sequence, channeling or uneven extraction, whether it looks under/over-extracted, recommended grind, dose, or timing adjustments. Be specific and actionable.`;

      const userMsg = {
        role: 'user',
        text: promptText,
        frames,
        imageUri: videoUri,
      };
      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      await sendToUlly(newMessages);
    } catch {
      setLoading(false);
      Alert.alert('Error', 'Failed to analyze video.');
    }
  };

  const openChat = (entry) => {
    setMessages(entry.messages);
    setShowHistory(false);
  };

  const startNewChat = () => {
    setMessages([]);
    setShowHistory(false);
  };

  const hasMessages = messages.length > 0;

  const cameraInstruction = recording
    ? 'Recording... release to stop'
    : cameraMode === 'scan'
      ? 'Tap for photo, hold for video'
      : 'Tap for photo, hold to record extraction';

  // Camera modal
  if (showCamera) {
    return (
      <Modal visible animationType="slide" statusBarTranslucent>
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
                onPress={() => { stopBurst(); setShowCamera(false); setRecording(false); }}
              >
                <Text style={styles.backButtonText}>{'\u2190'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.captureButton, recording && styles.captureButtonRecording]}
                onPress={recording ? stopBurst : takePicture}
                onLongPress={startBurst}
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

  // History view
  if (showHistory) {
    return (
      <PaperBackground>
        <View style={styles.historyContainer}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>Chat History</Text>
            <TouchableOpacity onPress={() => setShowHistory(false)} activeOpacity={0.7}>
              <Text style={styles.historyClose}>Done</Text>
            </TouchableOpacity>
          </View>

          {history.length === 0 ? (
            <View style={styles.emptyHistory}>
              <Text style={styles.emptyText}>No past chats yet</Text>
            </View>
          ) : (
            <FlatList
              data={history}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.historyList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.historyRow}
                  onPress={() => openChat(item)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.historyPreview} numberOfLines={1}>
                    {item.preview}
                  </Text>
                  <Text style={styles.historyDate}>{item.date}</Text>
                </TouchableOpacity>
              )}
            />
          )}

          <View style={styles.historyFooter}>
            <TouchableOpacity onPress={startNewChat} activeOpacity={0.7}>
              <GoldGradient style={styles.newChatBtn}>
                <Text style={styles.newChatText}>New Chat</Text>
              </GoldGradient>
            </TouchableOpacity>
          </View>
        </View>
      </PaperBackground>
    );
  }

  // Action chips (used in empty state and toolbar)
  const ActionChips = ({ compact }) => (
    <View style={compact ? styles.toolbarRow : styles.actionChipsRow}>
      <TouchableOpacity
        style={compact ? styles.chatChip : styles.actionChip}
        onPress={() => openCamera('extraction')}
        onLongPress={() => pickMedia('extraction')}
        activeOpacity={0.7}
      >
        <PortafilterIcon size={compact ? 16 : 20} color={compact ? Colors.primary : Colors.text} />
        <Text style={compact ? styles.chatChipText : styles.actionChipText}>Dial-in</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={compact ? styles.chatChip : styles.actionChip}
        onPress={() => openCamera('scan')}
        onLongPress={() => pickMedia('scan')}
        activeOpacity={0.7}
      >
        <ScanIcon size={compact ? 16 : 20} color={compact ? Colors.primary : Colors.text} />
        <Text style={compact ? styles.chatChipText : styles.actionChipText}>Troubleshoot</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <PaperBackground>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={80}
        >
          {!hasMessages ? (
            <View style={[styles.fill, styles.centered]}>
              <View style={styles.topBar}>
                <View style={{ width: 32 }} />
                <TouchableOpacity onPress={() => setShowHistory(true)} activeOpacity={0.7}>
                  <BookIcon color={Colors.text} size={24} />
                </TouchableOpacity>
              </View>

              <View style={styles.centerContent}>
                <CoffeeFlower size={54} spinning={listening} bold />
                <Text style={styles.greeting}>Hello {name},</Text>
                <Text style={styles.subGreeting}>how can I help?</Text>

                <ActionChips />

                <View style={styles.searchWrap}>
                  <View style={styles.searchContainer}>
                    <TextInput
                      ref={inputRef}
                      style={styles.searchInput}
                      placeholderTextColor={Colors.tabInactive}
                      value={query}
                      onChangeText={setQuery}
                      onSubmitEditing={handleSubmit}
                      returnKeyType="send"
                      multiline={false}
                      autoFocus={false}
                    />
                    <TouchableOpacity
                      style={[styles.micButton, listening && styles.micButtonActive]}
                      onPress={toggleMic}
                      activeOpacity={0.7}
                    >
                      <MicIcon
                        color={listening ? '#fff' : Colors.textSecondary}
                        size={20}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.fill}>
              <View style={styles.chatTopBar}>
                <TouchableOpacity onPress={startNewChat} activeOpacity={0.7}>
                  <Text style={styles.chatTopBtn}>New</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowHistory(true)} activeOpacity={0.7}>
                  <BookIcon color={Colors.text} size={22} />
                </TouchableOpacity>
              </View>

              <ScrollView
                ref={scrollRef}
                style={styles.chatScroll}
                contentContainerStyle={styles.chatContent}
                onContentSizeChange={() =>
                  scrollRef.current?.scrollToEnd({ animated: true })
                }
              >
                {messages.map((msg, i) =>
                  msg.role === 'user' ? (
                    <GoldGradient key={i} style={styles.userBubble}>
                      {msg.imageUri && !msg.frames && !msg.isVideo && (
                        <Image source={{ uri: msg.imageUri }} style={styles.bubbleImage} />
                      )}
                      {(msg.frames || msg.isVideo) && (
                        <View style={styles.videoBadge}>
                          <Text style={styles.videoBadgeText}>Video ({msg.frames?.length || '?'} frames)</Text>
                        </View>
                      )}
                      <Text style={styles.userText}>{msg.text}</Text>
                    </GoldGradient>
                  ) : (
                    <View key={i} style={styles.ullyBubble}>
                      <Text style={styles.ullyText}>{msg.text}</Text>
                    </View>
                  )
                )}
                {loading && (
                  <View style={styles.loadingRow}>
                    <CoffeeFlower size={27} spinning bold />
                  </View>
                )}
              </ScrollView>

              <ActionChips compact />
              <Text style={styles.aiDisclosure}>
                Responses are AI-generated by Ully and may not always be accurate.
              </Text>

              <View style={styles.inputBar}>
                <View style={styles.searchContainer}>
                  <TextInput
                    ref={inputRef}
                    style={styles.searchInput}
                    placeholderTextColor={Colors.tabInactive}
                    value={query}
                    onChangeText={setQuery}
                    onSubmitEditing={handleSubmit}
                    returnKeyType="send"
                    multiline={false}
                  />
                  <TouchableOpacity
                    style={[styles.micButton, listening && styles.micButtonActive]}
                    onPress={toggleMic}
                    activeOpacity={0.7}
                  >
                    <MicIcon
                      color={listening ? '#fff' : Colors.textSecondary}
                      size={20}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fill: {
    flex: 1,
  },
  centered: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  chatTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 8,
  },
  chatTopBtn: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
  },
  greeting: {
    fontSize: 20,
    color: Colors.text,
    fontFamily: Fonts.mono,
    marginTop: 20,
    textAlign: 'center',
  },
  subGreeting: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
    marginTop: 2,
    textAlign: 'center',
  },
  aiDisclosure: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
    textAlign: 'center',
    marginTop: 12,
  },
  // Action chips (empty state)
  actionChipsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.card,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionChipText: {
    fontSize: 14,
    color: Colors.text,
    fontFamily: Fonts.mono,
    fontWeight: '600',
  },
  // Toolbar (active chat)
  toolbarRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  chatChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chatChipText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '600',
    fontFamily: Fonts.mono,
  },
  searchWrap: {
    marginTop: 32,
    alignSelf: 'stretch',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: Fonts.mono,
    color: Colors.text,
    paddingVertical: 14,
  },
  micButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  micButtonActive: {
    backgroundColor: Colors.danger,
  },
  chatScroll: {
    flex: 1,
  },
  chatContent: {
    padding: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  userBubble: {
    alignSelf: 'flex-end',
    borderRadius: 18,
    borderBottomRightRadius: 4,
    padding: 14,
    maxWidth: '80%',
    marginBottom: 12,
  },
  userText: {
    color: AuthColors.buttonText,
    fontSize: 14,
    fontFamily: Fonts.mono,
    lineHeight: 20,
  },
  bubbleImage: {
    width: 200,
    height: 150,
    borderRadius: 10,
    marginBottom: 8,
  },
  videoBadge: {
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  videoBadgeText: {
    color: AuthColors.buttonText,
    fontSize: 12,
    fontFamily: Fonts.mono,
  },
  ullyBubble: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.card,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    padding: 14,
    maxWidth: '85%',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ullyText: {
    color: Colors.text,
    fontSize: 14,
    fontFamily: Fonts.mono,
    lineHeight: 22,
  },
  loadingRow: {
    alignSelf: 'flex-start',
    marginBottom: 12,
    marginLeft: 4,
  },
  inputBar: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 8,
  },
  // Camera styles
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
  // History view
  historyContainer: {
    flex: 1,
    paddingTop: 60,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    fontFamily: Fonts.mono,
  },
  historyClose: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
  },
  historyList: {
    paddingHorizontal: 24,
  },
  historyRow: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyPreview: {
    fontSize: 14,
    color: Colors.text,
    fontFamily: Fonts.mono,
    flex: 1,
    marginRight: 12,
  },
  historyDate: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
  },
  emptyHistory: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
  },
  historyFooter: {
    padding: 24,
    alignItems: 'center',
  },
  newChatBtn: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 20,
  },
  newChatText: {
    color: AuthColors.buttonText,
    fontSize: 14,
    fontFamily: Fonts.mono,
    fontWeight: '600',
  },
});
