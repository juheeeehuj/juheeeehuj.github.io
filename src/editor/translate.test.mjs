import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { updateEnglishPost } from './translate.mjs';

const SOURCE = `---
title: '배너 만들기'
description: '작업 과정을 정리했어요.'
pubDate: 2026-10-08
category: ai
tags: ['banner', 'ai-workflow']
heroImage: '../../../assets/blog/demo/hero.png'
featured: true
custom:
  value: preserved
---

## 제작 과정

![그림 설명](../../../assets/blog/demo/image.png)

[서비스](https://example.com/path?query=1)

\`\`\`js
const text = '한글은 그대로';
\`\`\`

실행: \`npm run build\`
`;

const OLD_ENGLISH = `---
title: 'Old title'
description: 'Old description'
pubDate: 2020-01-01
draft: true
---

Old English body.
`;

async function fixture(t, { existing = true, source = SOURCE } = {}) {
	const root = await fs.mkdtemp(path.join(os.tmpdir(), 'editor-translation-'));
	t.after(() => fs.rm(root, { recursive: true, force: true }));
	const sourceFile = path.join(root, 'src/content/blog/ko/demo.md');
	const targetFile = path.join(root, 'src/content/blog/en/demo.md');
	await fs.mkdir(path.dirname(sourceFile), { recursive: true });
	await fs.mkdir(path.dirname(targetFile), { recursive: true });
	await fs.writeFile(sourceFile, source);
	if (existing) await fs.writeFile(targetFile, OLD_ENGLISH);
	return { root, sourceFile, targetFile };
}

// Only the external model is substituted; all parsing, checks, and file writes are real.
const translate = async ({ body }) => ({
	title: "Let's make a banner",
	description: 'A record of the process.',
	body: body.replace('## 제작 과정', '## Workflow').replace('그림 설명', 'Illustration').replace('서비스', 'Service').replace('실행:', 'Run:'),
});

test('creates an English file with translated text and Korean publication metadata', async (t) => {
	const { root, sourceFile, targetFile } = await fixture(t, { existing: false });
	await updateEnglishPost(root, 'demo', { generate: translate });
	const english = await fs.readFile(targetFile, 'utf8');
	assert.match(english, /title: 'Let''s make a banner'/);
	assert.match(english, /description: 'A record of the process\.'/);
	assert.match(english, /pubDate: 2026-10-08/);
	assert.match(english, /category: ai/);
	assert.match(english, /tags: \['banner', 'ai-workflow'\]/);
	assert.match(english, /heroImage: '\.\.\/\.\.\/\.\.\/assets\/blog\/demo\/hero\.png'/);
	assert.match(english, /featured: true\ncustom:\n  value: preserved/);
	assert.doesNotMatch(english, /^draft:/m);
	assert.match(english, /## Workflow/);
	assert.equal(await fs.readFile(sourceFile, 'utf8'), SOURCE);
});

test('updates old English content and aligns its draft status with Korean', async (t) => {
	const { root, targetFile } = await fixture(t);
	await updateEnglishPost(root, 'demo', { generate: async (input) => {
		assert.equal(input.previous.title, 'Old title');
		assert.match(input.previous.body, /Old English body/);
		return translate(input);
	} });
	const english = await fs.readFile(targetFile, 'utf8');
	assert.doesNotMatch(english, /Old English body|draft: true|2020-01-01/);
	assert.match(english, /## Workflow/);
});

test('keeps a Korean draft unpublished in the generated English edition', async (t) => {
	const { root, targetFile } = await fixture(t, { source: SOURCE.replace('featured: true', 'draft: true\nfeatured: true') });
	await updateEnglishPost(root, 'demo', { generate: translate });
	assert.match(await fs.readFile(targetFile, 'utf8'), /^draft: true$/m);
});

test('preserves image/link destinations and code while translating visible captions', async (t) => {
	const { root, targetFile } = await fixture(t);
	await updateEnglishPost(root, 'demo', { generate: translate });
	const english = await fs.readFile(targetFile, 'utf8');
	assert.ok(english.includes('![Illustration](../../../assets/blog/demo/image.png)'));
	assert.ok(english.includes('[Service](https://example.com/path?query=1)'));
	assert.ok(english.includes("```js\nconst text = '한글은 그대로';\n```"));
	assert.ok(english.includes('Run: `npm run build`'));
});

test('protects multiple image destinations on the same line and URLs containing parentheses', async (t) => {
	const source = SOURCE + '\n![하나](../first.png) ![둘](../second(2).png)\n';
	const { root, targetFile } = await fixture(t, { source });
	await updateEnglishPost(root, 'demo', { generate: async (input) => ({
		...await translate(input),
		body: input.body.replaceAll('second', 'wrong').replaceAll('하나', 'One').replaceAll('둘', 'Two'),
	}) });
	const english = await fs.readFile(targetFile, 'utf8');
	assert.ok(english.includes('![One](../first.png) ![Two](../second(2).png)'));
});

test('preserves blank lines inside tilde-fenced code after translation', async (t) => {
	const code = '~~~text\na\n\n\nb\n~~~\n';
	const { root, targetFile } = await fixture(t, { source: SOURCE + '\n' + code });
	await updateEnglishPost(root, 'demo', { generate: translate });
	assert.ok((await fs.readFile(targetFile, 'utf8')).includes(code));
});

test('rejects lost Markdown structure even when protected tokens survive', async (t) => {
	const source = SOURCE + '\n1. 첫째\n2. 둘째\n\n| 항목 | 내용 |\n| --- | --- |\n| 예시 | 값 |\n';
	const { root, targetFile } = await fixture(t, { source });
	const mutations = [
		body => body.replace('## 제작 과정', '제작 과정'),
		body => body.replace(/!\[[^\]]*\]\(([^)]*)\)/, '$1'),
		body => body.replace('1. 첫째\n2. 둘째', '첫째 둘째'),
		body => body.replace('| 예시 | 값 |\n', ''),
	];
	for (const mutate of mutations) {
		await assert.rejects(updateEnglishPost(root, 'demo', { generate: async input => ({title:'Title',description:'Summary',body:mutate(input.body)}) }), error=>error.status===502);
		assert.equal(await fs.readFile(targetFile, 'utf8'), OLD_ENGLISH);
	}
});

test('retains existing English when the provider fails and releases the request lock', async (t) => {
	const { root, targetFile } = await fixture(t);
	await assert.rejects(updateEnglishPost(root, 'demo', { generate: async () => { throw new Error('Provider unavailable'); } }), /Provider unavailable/);
	assert.equal(await fs.readFile(targetFile, 'utf8'), OLD_ENGLISH);
	await updateEnglishPost(root, 'demo', { generate: translate });
	assert.match(await fs.readFile(targetFile, 'utf8'), /## Workflow/);
});

test('rejects a translation that drops protected resources without replacing English', async (t) => {
	const { root, targetFile } = await fixture(t);
	await assert.rejects(updateEnglishPost(root, 'demo', { generate: async () => ({ title: 'English', description: 'Summary', body: 'No images or code.' }) }));
	assert.equal(await fs.readFile(targetFile, 'utf8'), OLD_ENGLISH);
});

test('rejects empty or malformed model fields without replacing English', async (t) => {
	const { root, targetFile } = await fixture(t);
	for (const invalid of [null, { title: '', description: 'Summary', body: 'English' }, { title: 'Title', description: 7, body: 'English' }]) {
		await assert.rejects(updateEnglishPost(root, 'demo', { generate: async () => invalid }));
		assert.equal(await fs.readFile(targetFile, 'utf8'), OLD_ENGLISH);
	}
});

test('does not replace English if Korean changes during translation', async (t) => {
	const { root, sourceFile, targetFile } = await fixture(t);
	await assert.rejects(updateEnglishPost(root, 'demo', { generate: async (input) => {
		await fs.writeFile(sourceFile, SOURCE + '\nNew Korean edit.\n');
		return translate(input);
	} }), (error) => error.status === 409);
	assert.equal(await fs.readFile(targetFile, 'utf8'), OLD_ENGLISH);
	assert.match(await fs.readFile(sourceFile, 'utf8'), /New Korean edit/);
});

test('does not overwrite manual English edits made during translation', async (t) => {
	const { root, targetFile } = await fixture(t);
	await assert.rejects(updateEnglishPost(root, 'demo', { generate: async (input) => {
		await fs.writeFile(targetFile, OLD_ENGLISH + '\nManual edit.\n');
		return translate(input);
	} }), (error) => error.status === 409);
	assert.equal(await fs.readFile(targetFile, 'utf8'), OLD_ENGLISH + '\nManual edit.\n');
});

test('rejects a duplicate translation while the first request is running', async (t) => {
	const { root } = await fixture(t);
	let release;
	let started;
	const entered = new Promise((resolve) => { started = resolve; });
	const gate = new Promise((resolve) => { release = resolve; });
	const first = updateEnglishPost(root, 'demo', { generate: async (input) => {
		started();
		await gate;
		return translate(input);
	} });
	await entered;
	try {
		await assert.rejects(updateEnglishPost(root, 'demo', { generate: translate }), (error) => error.status === 409);
	} finally {
		release();
		await first;
	}
});

test('rejects path traversal before calling the provider', async (t) => {
	const { root } = await fixture(t);
	let called = false;
	await assert.rejects(updateEnglishPost(root, '../demo', { generate: async () => { called = true; } }), (error) => error.status === 400);
	assert.equal(called, false);
});
