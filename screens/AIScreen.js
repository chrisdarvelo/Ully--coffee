import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors, Fonts } from '../utils/constants';
import CoffeeFlower from '../components/CoffeeFlower';


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

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function AIScreen() {
  const [query, setQuery] = useState('');
  const [listening, setListening] = useState(false);
  const inputRef = useRef(null);

  const toggleMic = () => {
    // TODO: wire up expo-speech-recognition on dev build
    setListening((v) => !v);
  };

  const handleSubmit = () => {
    if (!query.trim()) return;
    Keyboard.dismiss();
    // TODO: send query to Ully AI
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <View style={styles.content}>
        <View style={styles.center}>
          <CoffeeFlower size={48} spinning={listening} />
          <Text style={styles.greeting}>{getGreeting()}</Text>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="How can I help?"
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  center: {
    alignItems: 'center',
    marginBottom: 40,
  },
  greeting: {
    fontSize: 18,
    color: Colors.text,
    fontFamily: Fonts.mono,
    marginTop: 16,
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
});
