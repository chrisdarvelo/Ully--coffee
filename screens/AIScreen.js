import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Path, Line } from 'react-native-svg';
import { auth } from '../services/FirebaseConfig';
import ClaudeService from '../services/ClaudeService';
import { Colors, Fonts } from '../utils/constants';
import CoffeeFlower from '../components/CoffeeFlower';
import PaperBackground from '../components/PaperBackground';

const HISTORY_KEY = '@ully_chat_history';

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

export default function AIScreen() {
  const user = auth.currentUser;
  const name = user?.email ? user.email.split('@')[0] : 'friend';

  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

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
      messages: msgs,
    };
    const updated = [entry, ...history].slice(0, 50);
    setHistory(updated);
    try {
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch (e) {}
  }, [history]);

  const toggleMic = () => {
    setListening((v) => !v);
  };

  const handleSubmit = async () => {
    const text = query.trim();
    if (!text || loading) return;

    const userMsg = { role: 'user', text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setQuery('');
    setLoading(true);

    try {
      const result = await ClaudeService.chat(text);
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

  const openChat = (entry) => {
    setMessages(entry.messages);
    setShowHistory(false);
  };

  const startNewChat = () => {
    setMessages([]);
    setShowHistory(false);
  };

  const hasMessages = messages.length > 0;

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
            <TouchableOpacity
              style={styles.newChatBtn}
              onPress={startNewChat}
              activeOpacity={0.7}
            >
              <Text style={styles.newChatText}>New Chat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </PaperBackground>
    );
  }

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
    backgroundColor: Colors.text,
  },
  newChatText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: Fonts.mono,
    fontWeight: '600',
  },
});
