// AX Studio 에서 가져온 케이스스터디 이미지(public/work/<slug>)의 PNG·JPG 를 WebP 로 바꾼다.
//   node scripts/studio-webp.mjs <slug>
// 바꾼 파일은 지우고, src/studio 안의 경로(.png/.jpg → .webp)도 함께 고친다.
import { readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const slug = process.argv[2];
if (!slug) throw new Error('usage: node scripts/studio-webp.mjs <slug>');
const dir = path.join('public/work', slug);

async function walk(d) {
	const out = [];
	for (const e of await readdir(d, { withFileTypes: true })) {
		const p = path.join(d, e.name);
		if (e.isDirectory()) out.push(...(await walk(p)));
		else out.push(p);
	}
	return out;
}

const renamed = [];
let before = 0;
let after = 0;
for (const file of await walk(dir)) {
	if (!/\.(png|jpe?g)$/i.test(file)) continue;
	const target = file.replace(/\.(png|jpe?g)$/i, '.webp');
	await sharp(file).webp({ quality: 88, alphaQuality: 100 }).toFile(target);
	before += (await stat(file)).size;
	after += (await stat(target)).size;
	await rm(file);
	renamed.push([file.replace(/^public/, ''), target.replace(/^public/, '')]);
}

for (const file of await walk('src/studio')) {
	if (!/\.(tsx?|json|css)$/.test(file)) continue;
	const text = await readFile(file, 'utf8');
	let next = text;
	for (const [from, to] of renamed) {
		next = next.split(from).join(to);
		// 경로를 조립해서 쓰는 곳은 파일 이름만 적혀 있다 (예: 스티커)
		next = next.split(`'${path.basename(from)}'`).join(`'${path.basename(to)}'`);
	}
	if (next !== text) await writeFile(file, next);
}

console.log(`${renamed.length} files: ${(before / 1e6).toFixed(1)}MB → ${(after / 1e6).toFixed(1)}MB`);
