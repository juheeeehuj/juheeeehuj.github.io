import { getCollection, type CollectionEntry } from 'astro:content';
import type { Category } from '../categories';

export const languages = {
	en: 'English',
	ko: '한국어',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'en';

// 화면 문구 (글 내용이 아니라 제목·버튼 등)
export const ui = {
	en: {
		siteTitle: 'Juhee Oh',
		siteDescription: 'Where product, design, and AI meet.',
		author: 'Juhee Oh',
		navHome: 'Home',
		navAbout: 'About',
		posts: 'Posts',
		noPosts: 'No posts yet.',
		featured: 'Featured posts',
		share: 'Copy link',
		copied: 'Link copied',
		readPost: 'Read post',
		pagination: 'Pages',
		prevPage: 'Previous page',
		nextPage: 'Next page',
		backToTop: 'Back to Top',
		breadcrumb: 'Breadcrumb',
		shareOn: 'Share on',
		authorBio: 'I write about building products, where product thinking, design, and AI meet.',
		search: 'Search',
		searchPlaceholder: 'Search posts...',
		searchHint: 'Press ESC to close',
		noResults: 'No posts found.',
		close: 'Close',
		updatedOn: 'Updated',
		backToList: '← All posts',
		noTranslation: 'This post is not available in Korean yet.',
		themeToggle: 'Toggle dark mode',
		locale: 'en-US',
	},
	ko: {
		siteTitle: 'Juhee Oh',
		siteDescription: '프로덕트, 디자인, AI가 만나는 곳.',
		author: '오주희',
		navHome: '홈',
		navAbout: '소개',
		posts: '글',
		noPosts: '아직 글이 없습니다.',
		featured: '추천 글',
		share: '링크 복사',
		copied: '링크를 복사했어요',
		readPost: '글 보기',
		pagination: '페이지',
		prevPage: '이전 페이지',
		nextPage: '다음 페이지',
		backToTop: '맨 위로',
		breadcrumb: '현재 위치',
		shareOn: '공유하기',
		authorBio: '프로덕트, 디자인, AI가 만나는 지점에서 제품을 만들며 배운 것을 기록합니다.',
		search: '검색',
		searchPlaceholder: '글 검색...',
		searchHint: 'ESC 를 누르면 닫혀요',
		noResults: '검색 결과가 없어요.',
		close: '닫기',
		updatedOn: '수정',
		backToList: '← 전체 글',
		noTranslation: '이 글은 아직 영어판이 없습니다.',
		themeToggle: '다크 모드 전환',
		locale: 'ko-KR',
	},
} as const;

export const categoryLabels: Record<Lang, Record<Category, string>> = {
	en: { product: 'Product', design: 'Design', ai: 'AI' },
	ko: { product: '프로덕트', design: '디자인', ai: 'AI' },
};

export function categoryUrl(lang: Lang, category: Category): string {
	return `/${lang}/category/${category}/`;
}

// 홈·카테고리 목록 한 페이지에 보이는 글 수 (3열 × 3줄)
export const PAGE_SIZE = 9;

export function pageUrl(lang: Lang, page: number): string {
	return page === 1 ? `/${lang}/` : `/${lang}/page/${page}/`;
}

export const social = {
	linkedin: 'https://www.linkedin.com/in/juheeoh-product-designer/',
	threads: 'https://www.threads.com/@ai_design_jh',
	email: 'juheeeehuj94@gmail.com',
	resume:
		'https://cdn.prod.website-files.com/6949ddf0c2b7024c50022cf3/699f278601861c54cd92be5f_4f9de4c2b39327a1f419dd11d863b4a0_JuheeOh%20CV%28Eng%2BKor%29.pdf',
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

export function formatDate(date: Date, lang: Lang, month: 'long' | 'short' = 'long'): string {
	return date.toLocaleDateString(ui[lang].locale, {
		year: 'numeric',
		month,
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
