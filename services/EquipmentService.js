import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_PREFIX = '@ully_equipment_';

function equipmentKey(uid) {
  return `${KEY_PREFIX}${uid}`;
}

export async function getEquipment(uid) {
  try {
    const json = await AsyncStorage.getItem(equipmentKey(uid));
    return json ? JSON.parse(json) : [];
  } catch {
    return [];
  }
}

export async function saveEquipmentItem(uid, item) {
  const items = await getEquipment(uid);
  const index = items.findIndex((i) => i.id === item.id);
  if (index >= 0) {
    items[index] = item;
  } else {
    items.push(item);
  }
  await AsyncStorage.setItem(equipmentKey(uid), JSON.stringify(items));
  return items;
}

export async function removeEquipmentItem(uid, itemId) {
  const items = await getEquipment(uid);
  const filtered = items.filter((i) => i.id !== itemId);
  await AsyncStorage.setItem(equipmentKey(uid), JSON.stringify(filtered));
  return filtered;
}
