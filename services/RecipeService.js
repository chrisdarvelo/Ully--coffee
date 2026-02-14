import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_PREFIX = '@ully_recipes_';

function recipeKey(uid) {
  return `${KEY_PREFIX}${uid}`;
}

const STARTER_RECIPES = [
  {
    id: 'starter_1',
    name: 'Blossoms',
    method: 'Pour Over',
    description: 'Light floral notes with a citrus finish. 15g coffee, 250ml water, 93°C.',
    artSeed: 1001,
    artStyle: 'lam',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'starter_2',
    name: 'Aroma',
    method: 'French Press',
    description: 'Rich and full-bodied with chocolate undertones. 30g coarse grind, 500ml, 4 min steep.',
    artSeed: 2002,
    artStyle: 'rothko',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'starter_3',
    name: 'Funky Way',
    method: 'AeroPress',
    description: 'Experimental inverted method. 17g fine grind, 200ml at 85°C, 1:30 steep.',
    artSeed: 3003,
    artStyle: 'picasso',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'starter_4',
    name: 'E27',
    method: 'Espresso',
    description: 'Classic double shot. 18g in, 36g out, 25-30 seconds, 93.5°C.',
    artSeed: 4004,
    artStyle: 'lam',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function getRecipes(uid) {
  try {
    const json = await AsyncStorage.getItem(recipeKey(uid));
    if (json) {
      return JSON.parse(json);
    }
    // First load: seed starter recipes
    await AsyncStorage.setItem(recipeKey(uid), JSON.stringify(STARTER_RECIPES));
    return STARTER_RECIPES;
  } catch {
    return [];
  }
}

export async function saveRecipe(uid, recipe) {
  const recipes = await getRecipes(uid);
  const index = recipes.findIndex((r) => r.id === recipe.id);
  const now = new Date().toISOString();
  if (index >= 0) {
    recipes[index] = { ...recipe, updatedAt: now };
  } else {
    recipes.push({
      ...recipe,
      id: recipe.id || `recipe_${Date.now()}`,
      artSeed: recipe.artSeed || Math.floor(Math.random() * 10000),
      artStyle: recipe.artStyle || ['lam', 'rothko', 'picasso'][Math.floor(Math.random() * 3)],
      createdAt: now,
      updatedAt: now,
    });
  }
  await AsyncStorage.setItem(recipeKey(uid), JSON.stringify(recipes));
  return recipes;
}

export async function deleteRecipe(uid, recipeId) {
  const recipes = await getRecipes(uid);
  const filtered = recipes.filter((r) => r.id !== recipeId);
  await AsyncStorage.setItem(recipeKey(uid), JSON.stringify(filtered));
  return filtered;
}
