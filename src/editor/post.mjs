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

export function parsePost(raw) {
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
export function tidyBody(body) {
	const parts = body.replace(/\r\n/g, '\n').split(/(^```[\s\S]*?^```[^\n]*$)/m);
	return (
		parts
			.map((part, i) => (i % 2 ? part : part.replace(/\n{3,}/g, '\n\n')))
			.join('')
			.trim() + '\n'
	);
}

export function createPost(title) {
	return `---\ntitle: ${quote(title)}\ndescription: ''\npubDate: ${readDate(new Date().toString())}\ndraft: true\n---\n\n`;
}


// Change only requested fields; preserve unknown frontmatter and untouched Markdown.
export function updatePost(raw, input, { normalizeBody = true } = {}) {
	const post = parsePost(raw);
	let frontmatter = post.frontmatter;
	for (const [key, field] of Object.entries(FIELDS)) {
		const value = input[key];
		if (value === undefined || JSON.stringify(value) === JSON.stringify(post.fields[key])) continue;
		const problem = field.check(value);
		if (problem) throw Object.assign(new Error(problem), { status: 400 });
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
	const body = typeof input.body === 'string' ? (normalizeBody ? tidyBody(input.body) : input.body) : post.body;
	return `---\n${frontmatter.trimEnd()}\n---\n${post.gap}${body}`;
}
