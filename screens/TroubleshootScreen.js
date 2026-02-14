import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { auth } from '../services/FirebaseConfig';
import { getEquipment } from '../services/EquipmentService';
import { Colors, Fonts, DiagnosticTypes, EquipmentTypes } from '../utils/constants';
import { PortafilterIcon, SearchIcon, EquipmentTypeIcon } from '../components/DiagnosticIcons';

export default function TroubleshootScreen({ navigation: tabNav }) {
  const navigation = tabNav.getParent();
  const [equipment, setEquipment] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const uid = auth.currentUser?.uid;
      if (uid) {
        getEquipment(uid).then(setEquipment);
      }
    }, [])
  );

  const renderEquipmentCard = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.equipCard}
        onPress={() => navigation.navigate('EquipmentDetail', { item })}
        activeOpacity={0.7}
      >
        <EquipmentTypeIcon type={item.type} size={26} color={Colors.text} />
        <Text style={styles.equipName} numberOfLines={1}>{item.name}</Text>
        {item.brand ? <Text style={styles.equipBrand} numberOfLines={1}>{item.brand}</Text> : null}
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Troubleshoot</Text>
        <Text style={styles.subtitle}>Pick a diagnostic to get started</Text>
      </View>

      {/* Equipment Section */}
      <View style={styles.equipSection}>
        <View style={styles.equipHeader}>
          <Text style={styles.equipSectionTitle}>Your Equipment</Text>
          <TouchableOpacity
            style={styles.equipAddBtn}
            onPress={() => navigation.navigate('EquipmentDetail')}
            activeOpacity={0.7}
          >
            <Text style={styles.equipAddBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        {equipment.length === 0 ? (
          <TouchableOpacity
            style={styles.emptyCard}
            onPress={() => navigation.navigate('EquipmentDetail')}
            activeOpacity={0.7}
          >
            <Text style={styles.emptyIcon}>☕</Text>
            <View style={styles.emptyBody}>
              <Text style={styles.emptyTitle}>Add your first machine</Text>
              <Text style={styles.emptyHint}>Tap to register your coffee equipment</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <FlatList
            data={equipment}
            keyExtractor={(item) => item.id}
            renderItem={renderEquipmentCard}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.equipList}
          />
        )}
      </View>

      <View style={styles.grid}>
        {Object.entries(DiagnosticTypes).map(([key, value]) => {
          const svgIcons = {
            extraction: <PortafilterIcon size={28} color={Colors.text} />,
            part: <SearchIcon size={28} color={Colors.text} />,
          };
          return (
            <TouchableOpacity
              key={key}
              style={styles.card}
              onPress={() => navigation.navigate('Diagnostic', { type: key })}
              activeOpacity={0.7}
            >
              <View style={styles.cardIconWrap}>
                {svgIcons[key] || <Text style={styles.cardIcon}>{value.icon}</Text>}
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{value.label}</Text>
                <Text style={styles.cardDescription}>{value.description}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    paddingBottom: 30,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 90,
    paddingBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    fontFamily: Fonts.mono,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
    marginTop: 4,
  },
  equipSection: {
    paddingTop: 16,
  },
  equipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 10,
  },
  equipSectionTitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  equipAddBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.text,
    justifyContent: 'center',
    alignItems: 'center',
  },
  equipAddBtnText: {
    color: Colors.background,
    fontSize: 18,
    fontWeight: '700',
    fontFamily: Fonts.mono,
    lineHeight: 20,
  },
  equipList: {
    paddingHorizontal: 24,
    gap: 10,
  },
  equipCard: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    padding: 14,
    width: 120,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  equipIconWrap: {
    marginBottom: 6,
  },
  equipName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
    fontFamily: Fonts.mono,
    textAlign: 'center',
  },
  equipBrand: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
    marginTop: 2,
    textAlign: 'center',
  },
  emptyCard: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  emptyIcon: {
    fontSize: 28,
    marginRight: 14,
  },
  emptyBody: {
    flex: 1,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    fontFamily: Fonts.mono,
  },
  emptyHint: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
    marginTop: 2,
  },
  grid: {
    padding: 24,
    paddingTop: 16,
    gap: 10,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardIconWrap: {
    width: 28,
    height: 28,
    marginRight: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: 28,
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    fontFamily: Fonts.mono,
    marginBottom: 3,
  },
  cardDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
    lineHeight: 18,
  },
});
