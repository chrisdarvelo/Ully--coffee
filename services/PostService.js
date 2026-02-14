import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_PREFIX = '@ully_posts_';

function postKey(uid) {
  return `${KEY_PREFIX}${uid}`;
}

export async function getPosts(uid) {
  try {
    const json = await AsyncStorage.getItem(postKey(uid));
    return json ? JSON.parse(json) : [];
  } catch {
    return [];
  }
}

export async function savePost(uid, post) {
  const posts = await getPosts(uid);
  const index = posts.findIndex((p) => p.id === post.id);
  if (index >= 0) {
    posts[index] = { ...posts[index], ...post, updatedAt: new Date().toISOString() };
  } else {
    posts.push({
      ...post,
      id: post.id || `post_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  await AsyncStorage.setItem(postKey(uid), JSON.stringify(posts));
  return posts;
}

export async function deletePost(uid, postId) {
  const posts = await getPosts(uid);
  const filtered = posts.filter((p) => p.id !== postId);
  await AsyncStorage.setItem(postKey(uid), JSON.stringify(filtered));
  return filtered;
}
