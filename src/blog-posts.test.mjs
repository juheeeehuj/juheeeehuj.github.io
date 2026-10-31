import assert from 'node:assert/strict';
import test from 'node:test';
import { selectPostRecommendations } from './blog-posts.mjs';

const post = (id, date, category = 'design', tags = [], draft = false) => ({
  id, data: { pubDate: new Date(date), category, tags, draft },
});

test('previous and next follow publication date without crossing languages or exposing drafts', () => {
  const entries = [
    post('ko/older', '2026-05-01'),
    post('en/translation', '2026-06-02'),
    post('ko/draft', '2026-06-03', 'design', [], true),
    post('ko/current', '2026-06-01'),
    post('ko/newer', '2026-07-01'),
  ];
  const result = selectPostRecommendations(entries, 'ko/current');
  assert.equal(result.previous.id, 'ko/older');
  assert.equal(result.next.id, 'ko/newer');
});

test('a draft preview can find adjacent published posts while other drafts stay hidden', () => {
  const entries = [
    post('ko/current', '2026-06-01', 'design', ['ai'], true),
    post('ko/private', '2026-06-02', 'design', ['ai'], true),
    post('ko/published', '2026-07-01', 'ai', ['ai']),
  ];
  const result = selectPostRecommendations(entries, 'ko/current');
  assert.equal(result.previous, undefined);
  assert.equal(result.next.id, 'ko/published');
  assert.deepEqual(result.related.map(p => p.id), ['ko/published']);
});

test('related posts prefer shared tags, then category and recency, with no unrelated filler', () => {
  const entries = [
    post('ko/current', '2026-06-01', 'design', ['ai', 'brand']),
    post('ko/category', '2026-10-01', 'design'),
    post('ko/tag', '2026-09-01', 'product', ['ai']),
    post('ko/both-tags', '2026-07-01', 'product', ['ai', 'brand']),
    post('ko/tag-and-category', '2026-08-01', 'design', ['brand']),
    post('ko/unrelated', '2026-11-01', 'product'),
  ];
  const result = selectPostRecommendations(entries, 'ko/current');
  assert.deepEqual(result.related.map(p => p.id), [
    'ko/both-tags', 'ko/tag-and-category', 'ko/tag',
  ]);
});

test('single posts and unknown posts have no self links or empty recommendations', () => {
  const only = [post('ko/only', '2026-06-01')];
  assert.deepEqual(selectPostRecommendations(only, 'ko/only'), {
    previous: undefined, next: undefined, related: [],
  });
  assert.deepEqual(selectPostRecommendations(only, 'ko/missing'), {
    previous: undefined, next: undefined, related: [],
  });
});
