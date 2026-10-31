import assert from 'node:assert/strict';
import test from 'node:test';
import { selectPostRecommendations } from './blog-posts.mjs';

const post = (id, date, draft = false) => ({ id, data: { pubDate: new Date(date), draft } });

test('previous and next follow publication date without crossing languages or exposing drafts', () => {
  const entries = [
    post('ko/older', '2026-05-01'),
    post('en/translation', '2026-06-02'),
    post('ko/draft', '2026-06-03', true),
    post('ko/current', '2026-06-01'),
    post('ko/newer', '2026-07-01'),
  ];
  const result = selectPostRecommendations(entries, 'ko/current');
  assert.equal(result.previous.id, 'ko/older');
  assert.equal(result.next.id, 'ko/newer');
});

test('a draft preview can find adjacent published posts while other drafts stay hidden', () => {
  const entries = [
    post('ko/current', '2026-06-01', true),
    post('ko/private', '2026-06-02', true),
    post('ko/published', '2026-07-01'),
  ];
  const result = selectPostRecommendations(entries, 'ko/current');
  assert.equal(result.previous, undefined);
  assert.equal(result.next.id, 'ko/published');
});

test('dev preview prefers published neighbours over nearer drafts and falls back to drafts', () => {
  const entries = [
    post('ko/published-old', '2026-03-01'),
    post('ko/draft-old', '2026-05-01', true),
    post('ko/current', '2026-06-01'),
    post('ko/draft-new', '2026-07-01', true),
  ];
  assert.equal(selectPostRecommendations(entries, 'ko/current').next, undefined);
  const result = selectPostRecommendations(entries, 'ko/current', { includeDrafts: true });
  assert.equal(result.previous.id, 'ko/published-old', 'published beats a nearer draft');
  assert.equal(result.next.id, 'ko/draft-new', 'draft fills in when no published post exists');
});

test('single posts and unknown posts have no self links', () => {
  const only = [post('ko/only', '2026-06-01')];
  assert.deepEqual(selectPostRecommendations(only, 'ko/only'), { previous: undefined, next: undefined });
  assert.deepEqual(selectPostRecommendations(only, 'ko/missing'), { previous: undefined, next: undefined });
});
