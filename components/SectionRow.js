import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, AuthColors, Fonts } from '../utils/constants';

export default function SectionRow({ title, data, renderItem, onAdd, keyExtractor }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {onAdd && (
          <TouchableOpacity onPress={onAdd} style={styles.addButton} activeOpacity={0.7}>
            <Text style={styles.addText}>+</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        horizontal
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor || ((item, index) => String(index))}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
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
    fontSize: 20,
    color: Colors.text,
    fontFamily: Fonts.mono,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: AuthColors.buttonFill,
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
});
