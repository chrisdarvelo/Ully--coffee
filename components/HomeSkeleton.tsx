import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Skeleton } from './SkeletonLoader';
import { Colors } from '../utils/constants';

export default function HomeSkeleton() {
  const renderSection = (titleWidth: number, cardWidth: number, cardHeight: number, count = 3, isCircle = false) => (
    <View style={styles.section}>
      <Skeleton width={titleWidth} height={20} style={styles.sectionTitle} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.listContent}>
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton 
            key={i} 
            width={cardWidth} 
            height={cardHeight} 
            borderRadius={isCircle ? cardWidth / 2 : 10} 
            style={styles.card} 
          />
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Skeleton width={40} height={40} borderRadius={20} />
      </View>

      <View style={styles.funFact}>
        <Skeleton width="100%" height={80} borderRadius={12} />
      </View>

      {renderSection(120, 150, 200)} {/* Recipes */}
      {renderSection(100, 150, 200)} {/* News */}
      {renderSection(80, 130, 130, 4, true)} {/* Baristas */}
      {renderSection(60, 150, 200)} {/* Cafes */}
      {renderSection(60, 150, 200)} {/* Blogs */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 72,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  funFact: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    marginLeft: 24,
    marginBottom: 16,
  },
  listContent: {
    paddingHorizontal: 24,
  },
  card: {
    marginRight: 12,
  },
});
