import { getCollection, type CollectionEntry } from 'astro:content';

export const languages = {
	ko: '한국어',
	en: 'English',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'ko';

// 화면 문구 (글 내용이 아니라 제목·버튼 등)
export const ui = {
	ko: {
		siteTitle: 'Juhee',
		siteDescription: '만들고 배운 것을 기록합니다.',
		navHome: '홈',
		navAbout: '소개',
		posts: '글',
		noPosts: '아직 글이 없습니다.',
		updatedOn: '수정',
		backToList: '← 전체 글',
		noTranslation: '이 글은 아직 영어판이 없습니다.',
		themeToggle: '다크 모드 전환',
		locale: 'ko-KR',
	},
	en: {
		siteTitle: 'Juhee',
		siteDescription: 'Notes on what I make and learn.',
		navHome: 'Home',
		navAbout: 'About',
		posts: 'Posts',
		noPosts: 'No posts yet.',
		updatedOn: 'Updated',
		backToList: '← All posts',
		noTranslation: 'This post is not available in Korean yet.',
		themeToggle: 'Toggle dark mode',
		locale: 'en-US',
	},
} as const;

export const social = {
	github: 'https://github.com/juheeeehuj',
};

export function otherLang(lang: Lang): Lang {
	return lang === 'ko' ? 'en' : 'ko';
}

// 글 id 는 "ko/hello-world" 형태 → 앞은 언어, 뒤는 두 언어가 공유하는 slug
export function langFromId(id: string): Lang {
	return id.split('/')[0] as Lang;
}

export function slugFromId(id: string): string {
	return id.split('/').slice(1).join('/');
}

export function postUrl(lang: Lang, slug: string): string {
	return `/${lang}/blog/${slug}/`;
}

export function formatDate(date: Date, lang: Lang): string {
	return date.toLocaleDateString(ui[lang].locale, {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
}

// 배포 빌드에서는 draft 글을 뺀다
export async function getPosts(lang?: Lang): Promise<CollectionEntry<'blog'>[]> {
	const posts = await getCollection(
		'blog',
		(p) => (import.meta.env.DEV || !p.data.draft) && (!lang || langFromId(p.id) === lang),
	);
	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
