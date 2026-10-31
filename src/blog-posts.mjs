/**
 * @template {{ id: string, data: { pubDate: Date, category?: string, tags?: string[], draft?: boolean } }} T
 * @param {T[]} posts
 * @param {string} currentId
 * @returns {{ previous: T | undefined, next: T | undefined, related: T[] }}
 */
export function selectPostRecommendations(posts, currentId) {
  const current = posts.find(post => post.id === currentId);
  if (!current) return { previous: undefined, next: undefined, related: [] };

  const language = currentId.split('/')[0];
  const eligible = posts
    .filter(post => post.id.split('/')[0] === language && (!post.data.draft || post.id === currentId))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf() || a.id.localeCompare(b.id));
  const index = eligible.findIndex(post => post.id === currentId);
  const tags = new Set(current.data.tags ?? []);
  const related = eligible
    .filter(post => post.id !== currentId)
    .map(post => ({
      post,
      score: [...new Set(post.data.tags ?? [])].filter(tag => tags.has(tag)).length * 2
        + Number(Boolean(current.data.category && post.data.category === current.data.category)),
    }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score
      || b.post.data.pubDate.valueOf() - a.post.data.pubDate.valueOf()
      || a.post.id.localeCompare(b.post.id))
    .slice(0, 3)
    .map(item => item.post);

  return { previous: eligible[index + 1], next: eligible[index - 1], related };
}
