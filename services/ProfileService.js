import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_PREFIX = '@ully_profile_';

function profileKey(uid) {
  return `${KEY_PREFIX}${uid}`;
}

export async function getProfile(uid) {
  try {
    const json = await AsyncStorage.getItem(profileKey(uid));
    return json ? JSON.parse(json) : null;
  } catch {
    return null;
  }
}

export async function saveProfile(uid, data) {
  const existing = await getProfile(uid);
  const profile = { ...existing, ...data, onboarded: true };
  await AsyncStorage.setItem(profileKey(uid), JSON.stringify(profile));
  return profile;
}

export async function isOnboarded(uid) {
  const profile = await getProfile(uid);
  return profile?.onboarded === true;
}
