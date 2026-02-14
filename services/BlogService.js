import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = '@ully_blogs_cache';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

const FEEDS = [
  { url: 'https://sprudge.com/feed', source: 'Sprudge' },
  { url: 'https://www.homegrounds.co/feed/', source: 'Home Grounds' },
  { url: 'https://perfectdailygrind.com/category/equipment/feed/', source: 'PDG Equipment' },
];

function parseItems(xml, source) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const title = block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1]
      || block.match(/<title>(.*?)<\/title>/)?.[1]
      || '';
    const link = block.match(/<link>(.*?)<\/link>/)?.[1] || '';
    const pubDate = block.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';
    if (title && link) {
      items.push({
        title: title.trim(),
        link: link.trim(),
        date: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        source,
      });
    }
  }
  return items;
}

async function fetchFeed({ url, source }) {
  try {
    const res = await fetch(url);
    const xml = await res.text();
    return parseItems(xml, source);
  } catch {
    return [];
  }
}

export async function getBlogs() {
  try {
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    if (cached) {
      const { articles, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL) {
        return articles;
      }
    }
  } catch {
    // cache miss
  }

  const results = await Promise.all(FEEDS.map(fetchFeed));
  const articles = results
    .flat()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  try {
    await AsyncStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ articles, timestamp: Date.now() })
    );
  } catch {
    // cache write failure is non-critical
  }

  return articles;
}
