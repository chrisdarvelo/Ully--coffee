import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Colors, AuthColors, Fonts } from '../../utils/constants';
import { GoldGradient } from '../GoldGradient';
import PaperBackground from '../PaperBackground';
import { ChatHistoryEntry } from '../../types';

interface ChatHistoryProps {
  visible: boolean;
  history: ChatHistoryEntry[];
  onClose: () => void;
  onSelectChat: (entry: ChatHistoryEntry) => void;
  onNewChat: () => void;
}

export default function ChatHistory({
  visible,
  history,
  onClose,
  onSelectChat,
  onNewChat
}: ChatHistoryProps) {
  if (!visible) return null;

  return (
    <PaperBackground>
      <View style={styles.historyContainer}>
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>Chat History</Text>
          <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
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
                onPress={() => onSelectChat(item)}
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
          <TouchableOpacity onPress={onNewChat} activeOpacity={0.7}>
            <GoldGradient style={styles.newChatBtn}>
              <Text style={styles.newChatText}>New Chat</Text>
            </GoldGradient>
          </TouchableOpacity>
        </View>
      </View>
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
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
