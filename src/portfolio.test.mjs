import assert from 'node:assert/strict';
import test from 'node:test';
import { selectPortfolio } from './portfolio.mjs';

const entries = [
  { id: 'ko/chaisa' },
  { id: 'en/chaisa' },
  { id: 'ko/witim-identity' },
  { id: 'ko/yeosu-saegomak' },
  { id: 'ko/refine-clinic' },
  { id: 'ko/witim-ax-studio' },
  { id: 'ko/3w-website-brochure' },
  { id: 'ko/3w-hospital-brochure' },
  { id: 'ko/witim-wingo' },
  { id: 'en/wwf' },
  { id: 'ko/ringle' },
  { id: 'ko/wiblog' },
  { id: 'en/wiblog' },
  { id: 'ko/witim-brand-communication' },
  { id: 'en/witim-brand-communication' },
  { id: 'ko/witim-rebranding' },
  { id: 'en/witim-rebranding' },
  { id: 'ko/oneq-pivot' },
  { id: 'en/oneq-pivot' },
  { id: 'ko/sga100' },
  { id: 'en/sga100' },
  { id: 'ko/theanswers' },
  { id: 'en/theanswers' },
];

test('Work includes the requested projects in either language without mixing in case studies', () => {
  assert.deepEqual(selectPortfolio(entries, 'work').map((entry) => entry.id), [
    'ko/chaisa', 'en/chaisa', 'ko/witim-identity', 'ko/yeosu-saegomak',
    'ko/refine-clinic', 'ko/witim-ax-studio', 'ko/3w-website-brochure',
    'ko/3w-hospital-brochure',
    'ko/wiblog', 'en/wiblog',
    'ko/witim-brand-communication', 'en/witim-brand-communication',
    'ko/witim-rebranding', 'en/witim-rebranding',
    'ko/oneq-pivot', 'en/oneq-pivot', 'ko/sga100', 'en/sga100',
  ]);
});

test('Case Studies includes The Answers while keeping Work projects separate', () => {
  assert.deepEqual(selectPortfolio(entries, 'case-studies').map((entry) => entry.id), [
    'ko/witim-wingo', 'en/wwf', 'ko/ringle', 'ko/theanswers', 'en/theanswers',
  ]);
});

test('selecting all portfolio entries preserves both languages without dropping projects', () => {
  assert.deepEqual(selectPortfolio(entries), entries);
});

test('a new project defaults to Case Studies without disappearing or entering Work', () => {
  const future = [{ id: 'ko/new-project' }];
  assert.deepEqual(selectPortfolio(future, 'case-studies'), future);
  assert.deepEqual(selectPortfolio(future, 'work'), []);
});
