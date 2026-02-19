import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, AuthColors, Fonts } from '../utils/constants';
import { GoldGradient } from './GoldGradient';

export default function SectionRow({ title, data, renderItem, onAdd, keyExtractor, emptyText }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {onAdd && (
          <TouchableOpacity onPress={onAdd} activeOpacity={0.7}>
            <GoldGradient style={styles.addButton}>
              <Text style={styles.addText}>+</Text>
            </GoldGradient>
          </TouchableOpacity>
        )}
      </View>
      {data.length === 0 && emptyText ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>{emptyText}</Text>
        </View>
      ) : (
        <FlatList
          horizontal
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractor || ((item, index) => String(index))}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    color: Colors.text,
    fontFamily: Fonts.header,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addText: {
    color: AuthColors.buttonText,
    fontSize: 18,
    fontWeight: '700',
    fontFamily: Fonts.mono,
    marginTop: -1,
  },
  list: {
    paddingHorizontal: 24,
    gap: 10,
  },
  emptyWrap: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
  },
});
