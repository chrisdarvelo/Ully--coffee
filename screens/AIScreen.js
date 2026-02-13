import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { auth } from '../services/FirebaseConfig';
import ClaudeService from '../services/ClaudeService';
import { Colors, Fonts } from '../utils/constants';
import CoffeeFlower from '../components/CoffeeFlower';
import PaperBackground from '../components/PaperBackground';

function MicIcon({ color, size }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3z"
        fill={color}
      />
      <Path
        d="M19 11a7 7 0 01-14 0"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <Path
        d="M12 18v3M9 21h6"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default function AIScreen() {
  const user = auth.currentUser;
  const name = user?.email ? user.email.split('@')[0] : 'friend';

  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const inputRef = useRef(null);

  const toggleMic = () => {
    // TODO: wire up expo-speech-recognition on dev build
    setListening((v) => !v);
  };

  const handleSubmit = async () => {
    const text = query.trim();
    if (!text || loading) return;
    Keyboard.dismiss();

    setLoading(true);
    setResponse('');
    try {
      const result = await ClaudeService.chat(text);
      setResponse(result);
      setQuery('');
    } catch (error) {
      setResponse('Could not reach Ully AI. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaperBackground>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={80}
        >
          {loading ? (
            <View style={[styles.fill, styles.centered]}>
              <CoffeeFlower size={80} spinning bold />
              <Text style={styles.brewingText}>Brewing...</Text>
            </View>
        ) : response ? (
          <View style={styles.fill}>
            <ScrollView
              style={styles.responseScroll}
              contentContainerStyle={styles.responseContent}
            >
              <View style={styles.responseBubble}>
                <Text style={styles.responseText}>{response}</Text>
              </View>
            </ScrollView>

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
        ) : (
          <View style={[styles.fill, styles.centered]}>
            <CoffeeFlower size={64} spinning={listening} bold />
            <Text style={styles.greeting}>Hello {name},</Text>
            <Text style={styles.subGreeting}>how can I help?</Text>

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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  brewingText: {
    color: Colors.textSecondary,
    fontSize: 15,
    fontFamily: Fonts.mono,
    marginTop: 20,
    textAlign: 'center',
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
  responseScroll: {
    flex: 1,
  },
  responseContent: {
    padding: 24,
    paddingTop: 64,
    paddingBottom: 16,
  },
  responseBubble: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  responseText: {
    color: Colors.text,
    fontSize: 14,
    fontFamily: Fonts.mono,
    lineHeight: 22,
    marginTop: 0,
  },
  inputBar: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 8,
  },
});
