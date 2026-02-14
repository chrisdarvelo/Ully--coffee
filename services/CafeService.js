import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProfile } from './ProfileService';

const KEY_PREFIX = '@ully_cafes_';
const MIGRATED_KEY = '@ully_cafes_migrated_';

function cafeKey(uid) {
  return `${KEY_PREFIX}${uid}`;
}

export async function getCafes(uid) {
  try {
    // Check if we need to migrate shops from profile
    const migrated = await AsyncStorage.getItem(`${MIGRATED_KEY}${uid}`);
    const json = await AsyncStorage.getItem(cafeKey(uid));

    if (!migrated) {
      const profile = await getProfile(uid);
      const existingCafes = json ? JSON.parse(json) : [];
      const shopNames = existingCafes.map((c) => c.name);

      if (profile?.shops?.length) {
        const migrated_cafes = profile.shops
          .filter((name) => !shopNames.includes(name))
          .map((name, i) => ({
            id: `migrated_${Date.now()}_${i}`,
            name,
            location: '',
            notes: '',
            addedAt: new Date().toISOString(),
          }));

        const all = [...existingCafes, ...migrated_cafes];
        await AsyncStorage.setItem(cafeKey(uid), JSON.stringify(all));
        await AsyncStorage.setItem(`${MIGRATED_KEY}${uid}`, 'true');
        return all;
      }
      await AsyncStorage.setItem(`${MIGRATED_KEY}${uid}`, 'true');
    }

    return json ? JSON.parse(json) : [];
  } catch {
    return [];
  }
}

export async function addCafe(uid, cafe) {
  const cafes = await getCafes(uid);
  const newCafe = {
    id: cafe.id || `cafe_${Date.now()}`,
    name: cafe.name || '',
    location: cafe.location || '',
    notes: cafe.notes || '',
    addedAt: new Date().toISOString(),
  };
  cafes.push(newCafe);
  await AsyncStorage.setItem(cafeKey(uid), JSON.stringify(cafes));
  return cafes;
}

export async function saveCafe(uid, cafe) {
  const cafes = await getCafes(uid);
  const index = cafes.findIndex((c) => c.id === cafe.id);
  if (index >= 0) {
    cafes[index] = { ...cafes[index], ...cafe };
  }
  await AsyncStorage.setItem(cafeKey(uid), JSON.stringify(cafes));
  return cafes;
}

export async function removeCafe(uid, cafeId) {
  const cafes = await getCafes(uid);
  const filtered = cafes.filter((c) => c.id !== cafeId);
  await AsyncStorage.setItem(cafeKey(uid), JSON.stringify(filtered));
  return filtered;
}
