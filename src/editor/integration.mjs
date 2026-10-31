// 로컬 전용 글 편집기. `npm run dev` 에서만 켜지고 배포 빌드에는 아무것도 들어가지 않는다.
//   - /ko/edit/?slug=<파일명> , /en/edit/?slug=<파일명> : 편집 화면 (src/editor/edit.astro)
//   - /ko/edit/ (slug 없이) : 새 글 만들기 화면
//   - /__editor/post?lang=&slug= : 마크다운 파일을 읽고(GET) 고쳐 쓰고(PUT) 새로 만드는(POST) API
//   - /__editor/image?lang=&slug=&name= : 그림 파일을 src/assets/blog/<slug>/ 에 저장하는(POST) API
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createPost, parsePost, updatePost } from './post.mjs';
import { updateEnglishPost } from './translate.mjs';

const LANGS = ['ko', 'en'];
const IMAGE_TYPES = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'avif', 'svg'];
const MAX_IMAGE_BYTES = 20 * 1024 * 1024;

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

export default function localEditor({ generate } = {}) {
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
				server.middlewares.use('/__editor/translate', async (req, res) => {
					try {
						if (req.method !== 'POST') return send(res, 405, { error: '지원하지 않는 요청입니다.' });
						if (!String(req.headers['content-type']).startsWith('application/json')) {
							return send(res, 415, { error: 'JSON 만 받습니다.' });
						}
						if (req.headers.origin && new URL(req.headers.origin).host !== req.headers.host) {
							return send(res, 403, { error: '편집기 화면에서 요청해 주세요.' });
						}
						const url = new URL(req.url, 'http://localhost');
						if (url.searchParams.get('lang') !== 'ko' || !postFile(root, url)) {
							return send(res, 400, { error: '저장된 한글 글에서 영어판을 업데이트해 주세요.' });
						}
						try { await readJson(req); }
						catch { return send(res, 400, { error: '잘못된 번역 요청입니다.' }); }
						const result = await updateEnglishPost(root, url.searchParams.get('slug'), { generate });
						return send(res, 200, { ok: true, ...result });
					} catch (err) {
						return send(res, err.status ?? 500, { error: String(err?.message ?? err) });
					}
				});

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
						return send(res, err.status ?? 500, { error: String(err?.message ?? err) });
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
							const fresh = createPost(title);
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
							await fs.writeFile(file, updatePost(raw, input));
							return send(res, 200, { ok: true });
						}

						return send(res, 405, { error: '지원하지 않는 요청입니다.' });
					} catch (err) {
						return send(res, err.status ?? 500, { error: String(err?.message ?? err) });
					}
				});
			},
		},
	};
}
