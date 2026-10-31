/**
 * 글 하단의 이전/다음 글.
 * 공개 글을 우선하고, includeDrafts(개발 모드)일 때만 빈자리를 초안으로 채운다.
 * @template {{ id: string, data: { pubDate: Date, category?: string, tags?: string[], draft?: boolean } }} T
 * @param {T[]} posts
 * @param {string} currentId
 * @param {{ includeDrafts?: boolean }} [options]
 * @returns {{ previous: T | undefined, next: T | undefined }}
 */
export function selectPostRecommendations(posts, currentId, { includeDrafts = false } = {}) {
  const current = posts.find(post => post.id === currentId);
  if (!current) return { previous: undefined, next: undefined };

  const language = currentId.split('/')[0];
  const byDate = (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf() || a.id.localeCompare(b.id);
  const all = posts
    .filter(post => post.id.split('/')[0] === language && (includeDrafts || !post.data.draft || post === current))
    .sort(byDate);
  const index = all.indexOf(current);
  const older = all.slice(index + 1);
  const newer = all.slice(0, index).reverse();
  const nearest = list => list.find(post => !post.data.draft) ?? list[0];
  const previous = nearest(older);
  const next = nearest(newer);

  return { previous, next };
}

