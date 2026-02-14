import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_PREFIX = '@ully_baristas_';

function baristaKey(uid) {
  return `${KEY_PREFIX}${uid}`;
}

const STARTER_BARISTAS = [
  {
    id: 'barista_1',
    name: 'Lina Morales',
    specialty: 'Latte Art & Pour Over',
    bio: 'World Latte Art champion. Specializes in single-origin pour overs and creative milk patterns.',
    avatarSeed: 7701,
    avatarColor: '#6B4226',
    avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    recipes: ['Blossoms', 'Cascara Fizz'],
    blogs: ['The Art of Pouring', 'Water Temperature Myths'],
    recommendations: ['Kalita Wave 185', 'Acaia Pearl Scale'],
    addedAt: new Date().toISOString(),
  },
  {
    id: 'barista_2',
    name: 'James Osei',
    specialty: 'Espresso & Roasting',
    bio: 'Head roaster at Origin Labs. Known for dialing in light roasts on traditional Italian machines.',
    avatarSeed: 8802,
    avatarColor: '#2E4057',
    avatarUrl: 'https://randomuser.me/api/portraits/men/81.jpg',
    recipes: ['E27', 'Nordic Light'],
    blogs: ['Roast Profiles Decoded', 'Pressure Profiling 101'],
    recommendations: ['La Marzocco Linea Mini', 'Niche Zero'],
    addedAt: new Date().toISOString(),
  },
  {
    id: 'barista_3',
    name: 'Yuki Tanaka',
    specialty: 'Japanese Brewing',
    bio: 'Pioneer of iced pour over and flash brew techniques. Runs a kissaten-style cafe in Kyoto.',
    avatarSeed: 9903,
    avatarColor: '#8B3A3A',
    avatarUrl: 'https://randomuser.me/api/portraits/women/79.jpg',
    recipes: ['Funky Way', 'Flash Brew'],
    blogs: ['Kissaten Culture', 'Ice & Extraction'],
    recommendations: ['Hario V60', 'Fellow Stagg Kettle'],
    addedAt: new Date().toISOString(),
  },
  {
    id: 'barista_4',
    name: 'Sofia Lindgren',
    specialty: 'Competition & Cupping',
    bio: 'Three-time national brewers cup finalist. Cupping judge and green coffee buyer.',
    avatarSeed: 1104,
    avatarColor: '#5B6E4E',
    avatarUrl: 'https://randomuser.me/api/portraits/women/32.jpg',
    recipes: ['Aroma', 'Competition V60'],
    blogs: ['Cupping Protocols', 'Buying Green Coffee'],
    recommendations: ['Comandante C40', 'Origami Dripper'],
    addedAt: new Date().toISOString(),
  },
  {
    id: 'barista_5',
    name: 'Marco Di Stefano',
    specialty: 'Traditional Espresso',
    bio: 'Fourth-generation Italian barista. Believes in the simplicity of a perfect ristretto.',
    avatarSeed: 2205,
    avatarColor: '#704214',
    avatarUrl: 'https://randomuser.me/api/portraits/men/36.jpg',
    recipes: ['Ristretto Classico', 'Cappuccino Tradizionale'],
    blogs: ['Espresso Is Not a Science', 'The Perfect Crema'],
    recommendations: ['Mazzer Mini', 'IMS Precision Basket'],
    addedAt: new Date().toISOString(),
  },
];

export async function getBaristas(uid) {
  try {
    const json = await AsyncStorage.getItem(baristaKey(uid));
    if (json) {
      const parsed = JSON.parse(json);
      // Re-seed if avatar URLs are missing (data migration)
      const needsMigration = parsed.some(
        (b) => b.id?.startsWith('barista_') && !b.avatarUrl
      );
      if (needsMigration) {
        const urlMap = {};
        STARTER_BARISTAS.forEach((s) => { urlMap[s.id] = s.avatarUrl; });
        const migrated = parsed.map((b) => ({
          ...b,
          avatarUrl: b.avatarUrl || urlMap[b.id] || null,
        }));
        await AsyncStorage.setItem(baristaKey(uid), JSON.stringify(migrated));
        return migrated;
      }
      return parsed;
    }
    await AsyncStorage.setItem(baristaKey(uid), JSON.stringify(STARTER_BARISTAS));
    return STARTER_BARISTAS;
  } catch {
    return [];
  }
}

export async function getBarista(uid, baristaId) {
  const baristas = await getBaristas(uid);
  return baristas.find((b) => b.id === baristaId) || null;
}

export async function saveBarista(uid, barista) {
  const baristas = await getBaristas(uid);
  const index = baristas.findIndex((b) => b.id === barista.id);
  if (index >= 0) {
    baristas[index] = { ...baristas[index], ...barista };
  } else {
    baristas.push({
      ...barista,
      id: barista.id || `barista_${Date.now()}`,
      avatarSeed: barista.avatarSeed || Math.floor(Math.random() * 10000),
      avatarColor: barista.avatarColor || '#6B4226',
      addedAt: new Date().toISOString(),
    });
  }
  await AsyncStorage.setItem(baristaKey(uid), JSON.stringify(baristas));
  return baristas;
}

export async function removeBarista(uid, baristaId) {
  const baristas = await getBaristas(uid);
  const filtered = baristas.filter((b) => b.id !== baristaId);
  await AsyncStorage.setItem(baristaKey(uid), JSON.stringify(filtered));
  return filtered;
}
