// 로컬 전용 글 편집기. `npm run dev` 에서만 켜지고 배포 빌드에는 아무것도 들어가지 않는다.
//   - /ko/edit/?slug=<파일명> , /en/edit/?slug=<파일명> : 편집 화면 (src/editor/edit.astro)
//   - /ko/edit/ (slug 없이) : 새 글 만들기 화면
//   - /__editor/post?lang=&slug= : 마크다운 파일을 읽고(GET) 고쳐 쓰고(PUT) 새로 만드는(POST) API
//   - /__editor/image?lang=&slug=&name= : 그림 파일을 src/assets/blog/<slug>/ 에 저장하는(POST) API
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const LANGS = ['ko', 'en'];
const IMAGE_TYPES = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'avif', 'svg'];
const MAX_IMAGE_BYTES = 20 * 1024 * 1024;
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/;

function readScalar(raw) {
	const v = raw.trim();
	if (v.startsWith("'") && v.endsWith("'") && v.length > 1) return v.slice(1, -1).replace(/''/g, "'");
	if (v.startsWith('"') && v.endsWith('"') && v.length > 1) return JSON.parse(v);
	return v;
}

const quote = (value) => `'${value.replace(/\r?\n/g, ' ').trim().replace(/'/g, "''")}'`;

// `tags: ['a', 'b']` 한 줄 형태와 `tags:` 아래 `- a` 여러 줄 형태를 모두 읽는다
function readList(raw) {
	const v = raw.trim();
	if (v.startsWith('[')) {
		return (v.slice(1, v.lastIndexOf(']')).match(/'(?:[^']|'')*'|"(?:[^"\\]|\\.)*"|[^,]+/g) ?? [])
			.map(readScalar)
			.filter(Boolean);
	}
	return v
		.split('\n')
		.map((line) => line.trim())
		.filter((line) => line.startsWith('- '))
		.map((line) => readScalar(line.slice(2)));
}

function readDate(raw) {
	const v = readScalar(raw);
	if (/^\d{4}-\d{2}-\d{2}/.test(v)) return v.slice(0, 10);
	const d = new Date(v);
	if (Number.isNaN(d.getTime())) return '';
	const pad = (n) => String(n).padStart(2, '0');
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// 편집 화면에서 고칠 수 있는 frontmatter 항목.
//   read: 파일에 적힌 값 → 화면 값,  write: 화면 값 → 파일에 적을 값 (null 이면 그 줄을 지운다)
//   check: 문제가 있으면 안내 문구를 돌려준다
const FIELDS = {
	title: {
		read: readScalar,
		write: quote,
		check: (v) => typeof v === 'string' && !v.trim() && '제목은 비워둘 수 없습니다.',
	},
	description: {
		read: readScalar,
		write: quote,
		check: (v) => typeof v === 'string' && !v.trim() && '한 줄 요약은 비워둘 수 없습니다.',
	},
	category: {
		read: readScalar,
		write: (v) => v || null,
		check: (v) => !/^[\w-]*$/.test(v) && '카테고리 값이 올바르지 않습니다.',
	},
	tags: {
		read: readList,
		write: (v) => (v.length ? `[${v.map(quote).join(', ')}]` : null),
		check: (v) => (!Array.isArray(v) || v.some((t) => typeof t !== 'string')) && '태그 값이 올바르지 않습니다.',
		empty: [],
	},
	pubDate: {
		read: readDate,
		write: (v) => v,
		check: (v) => !/^\d{4}-\d{2}-\d{2}$/.test(v) && '작성일을 골라 주세요.',
	},
	// 마크다운 파일 기준 상대경로. 비우면 대표 이미지 없이 보인다 (그림 파일은 지우지 않는다).
	heroImage: {
		read: readScalar,
		write: (v) => (v ? quote(v) : null),
		check: (v) => typeof v !== 'string' && '대표 이미지 값이 올바르지 않습니다.',
	},
	// false(공개)면 줄을 지운다. README 의 "draft 는 선택 항목" 규칙과 같다.
	draft: {
		read: (raw) => readScalar(raw) === 'true',
		write: (v) => (v ? 'true' : null),
		check: (v) => typeof v !== 'boolean' && '상태 값이 올바르지 않습니다.',
		empty: false,
	},
};

// 항목 한 줄과, 그 아래 들여쓴 줄(여러 줄 값)까지 한 덩어리로 잡는다
const fieldBlock = (key) => new RegExp(`^${key}:[ \\t]*(.*(?:\\n[ \\t]+.*)*)$`, 'm');

function parsePost(raw) {
	const match = raw.match(FRONTMATTER);
	if (!match) throw new Error('frontmatter 를 찾지 못했습니다.');
	const frontmatter = match[1].replace(/\r\n/g, '\n');
	const rest = raw.slice(match[0].length);
	// frontmatter 와 본문 사이 빈 줄은 그대로 둔다
	const gap = rest.match(/^\s*/)[0];
	const fields = {};
	for (const [key, field] of Object.entries(FIELDS)) {
		const block = frontmatter.match(fieldBlock(key));
		fields[key] = block ? field.read(block[1]) : (field.empty ?? '');
	}
	return { frontmatter, gap, body: rest.slice(gap.length), fields };
}

// 에디터가 내보낸 마크다운 정리: 코드 블록 밖의 3줄 이상 빈 줄을 한 줄로, 끝에 개행 하나
function tidyBody(body) {
	const parts = body.replace(/\r\n/g, '\n').split(/(^```[\s\S]*?^```[^\n]*$)/m);
	return (
		parts
			.map((part, i) => (i % 2 ? part : part.replace(/\n{3,}/g, '\n\n')))
			.join('')
			.trim() + '\n'
	);
}

function postFile(root, url) {
	const lang = url.searchParams.get('lang');
	const slug = url.searchParams.get('slug') ?? '';
	if (!LANGS.includes(lang) || !/^[\w-]+$/.test(slug)) return null;
	return path.join(root, 'src/content/blog', lang, `${slug}.md`);
}

// 올린 파일 이름을 주소에 쓰기 좋게 바꾼다. 한글 등은 빠지므로 남는 게 없으면 image 로 한다.
function safeImageName(name) {
	const ext = path.extname(name).slice(1).toLowerCase();
	if (!IMAGE_TYPES.includes(ext)) return null;
	const base = path
		.basename(name, path.extname(name))
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
	return { base: base || 'image', ext };
}

async function readBody(req, limit) {
	const chunks = [];
	let size = 0;
	for await (const chunk of req) {
		size += chunk.length;
		if (size > limit) throw new Error('그림이 너무 큽니다. (20MB 까지)');
		chunks.push(chunk);
	}
	return Buffer.concat(chunks);
}

function send(res, status, data) {
	res.statusCode = status;
	res.setHeader('Content-Type', 'application/json; charset=utf-8');
	res.end(JSON.stringify(data));
}

const readJson = async (req) => JSON.parse((await readBody(req, MAX_IMAGE_BYTES)).toString('utf8'));

export default function localEditor() {
	let root = process.cwd();

	return {
		name: 'local-editor',
		hooks: {
			'astro:config:setup': ({ command, config, injectRoute }) => {
				if (command !== 'dev') return;
				root = fileURLToPath(config.root);
				for (const lang of LANGS) {
					injectRoute({ pattern: `/${lang}/edit`, entrypoint: './src/editor/edit.astro' });
				}
			},
			'astro:server:setup': ({ server }) => {
				server.middlewares.use('/__editor/image', async (req, res) => {
					try {
						const url = new URL(req.url, 'http://localhost');
						const slug = url.searchParams.get('slug') ?? '';
						if (req.method !== 'POST') return send(res, 405, { error: '지원하지 않는 요청입니다.' });
						if (!postFile(root, url)) return send(res, 400, { error: '잘못된 글 주소입니다.' });
						// 다른 사이트가 보낸 요청은 받지 않는다 (image/* 요청은 브라우저가 먼저 허락을 구한다)
						if (!String(req.headers['content-type']).startsWith('image/')) {
							return send(res, 415, { error: '그림 파일만 받습니다.' });
						}
						const name = safeImageName(url.searchParams.get('name') ?? '');
						if (!name) {
							return send(res, 400, { error: `올릴 수 있는 그림: ${IMAGE_TYPES.join(', ')}` });
						}
						const data = await readBody(req, MAX_IMAGE_BYTES);

						const dir = path.join(root, 'src/assets/blog', slug);
						await fs.mkdir(dir, { recursive: true });
						// 같은 이름이 있으면 덮어쓰지 않고 -2, -3 … 을 붙인다
						let fileName = `${name.base}.${name.ext}`;
						for (let n = 2; ; n++) {
							try {
								await fs.writeFile(path.join(dir, fileName), data, { flag: 'wx' });
								break;
							} catch (err) {
								if (err.code !== 'EEXIST') throw err;
								fileName = `${name.base}-${n}.${name.ext}`;
							}
						}
						// 글(src/content/blog/<lang>/x.md)에서 본 상대경로
						return send(res, 200, { path: `../../../assets/blog/${slug}/${fileName}` });
					} catch (err) {
						return send(res, 500, { error: String(err?.message ?? err) });
					}
				});

				server.middlewares.use('/__editor/post', async (req, res) => {
					try {
						const file = postFile(root, new URL(req.url, 'http://localhost'));
						if (!file) return send(res, 400, { error: '잘못된 글 주소입니다.' });

						if (req.method === 'POST') {
							if (!String(req.headers['content-type']).startsWith('application/json')) {
								return send(res, 415, { error: 'JSON 만 받습니다.' });
							}
							if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(path.basename(file, '.md'))) {
								return send(res, 400, { error: '주소는 영문 소문자, 숫자, 하이픈(-)만 쓸 수 있습니다.' });
							}
							const { title } = await readJson(req);
							if (typeof title !== 'string' || !title.trim()) {
								return send(res, 400, { error: '제목을 적어 주세요.' });
							}
							// 새 글은 초안으로 시작한다. 같은 이름의 글이 있으면 덮어쓰지 않는다.
							const today = readDate(new Date().toString());
							const fresh = `---\ntitle: ${quote(title)}\ndescription: ''\npubDate: ${today}\ndraft: true\n---\n\n`;
							try {
								await fs.writeFile(file, fresh, { flag: 'wx' });
							} catch (err) {
								if (err.code === 'EEXIST') return send(res, 409, { error: '같은 주소의 글이 이미 있습니다.' });
								throw err;
							}
							return send(res, 201, { ok: true });
						}

						let raw;
						try {
							raw = await fs.readFile(file, 'utf8');
						} catch {
							return send(res, 404, { error: '글 파일을 찾지 못했습니다. (.md 파일만 편집할 수 있습니다)' });
						}
						const post = parsePost(raw);

						if (req.method === 'GET') {
							return send(res, 200, { ...post.fields, body: post.body });
						}

						if (req.method === 'PUT') {
							// 다른 사이트가 보낸 요청은 받지 않는다 (JSON 요청은 브라우저가 먼저 허락을 구한다)
							if (!String(req.headers['content-type']).startsWith('application/json')) {
								return send(res, 415, { error: 'JSON 만 받습니다.' });
							}
							const input = await readJson(req);
							let frontmatter = post.frontmatter;
							for (const [key, field] of Object.entries(FIELDS)) {
								const value = input[key];
								// 안 바뀐 항목은 파일에 적힌 모양 그대로 둔다
								if (value === undefined || JSON.stringify(value) === JSON.stringify(post.fields[key])) continue;
								const problem = field.check(value);
								if (problem) return send(res, 400, { error: problem });
								const written = field.write(value);
								const block = fieldBlock(key);
								if (written === null) {
									frontmatter = frontmatter.replace(new RegExp(`${block.source}\\n?`, 'm'), '');
								} else if (block.test(frontmatter)) {
									frontmatter = frontmatter.replace(block, () => `${key}: ${written}`);
								} else {
									frontmatter = `${frontmatter.trimEnd()}\n${key}: ${written}`;
								}
							}
							// 본문은 에디터에서 손댔을 때만 온다. 안 건드린 글은 원래 마크다운 그대로 둔다.
							const body = typeof input.body === 'string' ? tidyBody(input.body) : post.body;
							await fs.writeFile(file, `---\n${frontmatter.trimEnd()}\n---\n${post.gap}${body}`);
							return send(res, 200, { ok: true });
						}

						return send(res, 405, { error: '지원하지 않는 요청입니다.' });
					} catch (err) {
						return send(res, 500, { error: String(err?.message ?? err) });
					}
				});
			},
		},
	};
}
