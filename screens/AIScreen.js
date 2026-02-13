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
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  const toggleMic = () => {
    // TODO: wire up expo-speech-recognition on dev build
    setListening((v) => !v);
  };

  const handleSubmit = async () => {
    const text = query.trim();
    if (!text || loading) return;

    const userMsg = { role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      const result = await ClaudeService.chat(text);
      setMessages((prev) => [...prev, { role: 'ully', text: result }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'ully', text: 'Could not reach Ully AI. Check your connection and try again.' },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const hasMessages = messages.length > 0;

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
          ) : (
            <View style={styles.fill}>
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
                    <View key={i} style={styles.userBubble}>
                      <Text style={styles.userText}>{msg.text}</Text>
                    </View>
                  ) : (
                    <View key={i} style={styles.ullyBubble}>
                      <Text style={styles.ullyText}>{msg.text}</Text>
                    </View>
                  )
                )}
                {loading && (
                  <View style={styles.loadingRow}>
                    <CoffeeFlower size={32} spinning bold />
                  </View>
                )}
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
  chatScroll: {
    flex: 1,
  },
  chatContent: {
    padding: 20,
    paddingTop: 64,
    paddingBottom: 8,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.text,
    borderRadius: 18,
    borderBottomRightRadius: 4,
    padding: 14,
    maxWidth: '80%',
    marginBottom: 12,
  },
  userText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: Fonts.mono,
    lineHeight: 20,
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
});
