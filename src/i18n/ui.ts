import { getCollection, type CollectionEntry } from 'astro:content';
import type { Category } from '../categories';
import { selectPortfolio } from '../portfolio.mjs';
export { portfolioSection } from '../portfolio.mjs';
export type { PortfolioSection } from '../portfolio.mjs';
import type { PortfolioSection } from '../portfolio.mjs';

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
		navWork: 'Work',
		navCaseStudies: 'Case Studies',
		navBlog: 'Blog',
		blogIntro: 'Notes on product, design, and AI.',
		allCategories: 'All',
		selectedWork: 'Selected Work',
		allWork: 'All work',
		viewMoreWork: 'View more work',
		viewMoreCaseStudies: 'View more case studies',
		moreWork: 'More Work',
		private: 'Private',
		openPdf: 'Open PDF',
		pdfKorean: 'PDF · Korean',
		viewPdf: 'View as PDF (Korean)',
		visitSite: 'Visit site',
		recentPosts: 'Recent Posts',
		allPosts: 'All posts',
		workTitle: 'Work',
		workIntro: 'Selected work in branding, digital design, and implementation.',
		caseStudiesTitle: 'Case Studies',
		caseStudiesIntro: 'Research, design decisions, and lessons from each project.',
		moreCaseStudies: 'More Case Studies',
		backToCaseStudies: '← All case studies',
		projectType: 'Project type',
		duration: 'Duration',
		role: 'Role',
		tools: 'Tools',
		contents: 'Contents',
		overview: 'Overview',
		projectOverview: 'Project Overview',
		otherProjects: 'Other projects',
		viewProject: 'View project',
		backToWork: '← All work',
		viewLarger: 'View larger',
		prevImage: 'Previous image',
		nextImage: 'Next image',
		posts: 'Posts',
		noPosts: 'No posts yet.',
		featured: 'Featured posts',
		share: 'Copy link',
		copied: 'Link copied',
		readPost: 'Read post',
		previousPost: 'Previous post',
		nextPost: 'Next post',
		postNavigation: 'Post navigation',
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
		navWork: '작업',
		navCaseStudies: '케이스스터디',
		navBlog: '블로그',
		blogIntro: '프로덕트, 디자인, AI에 대해 씁니다.',
		allCategories: '전체',
		selectedWork: '주요 작업',
		allWork: '전체 작업',
		viewMoreWork: '작업 더보기',
		viewMoreCaseStudies: '케이스스터디 더보기',
		moreWork: '다른 작업',
		private: '비공개',
		openPdf: 'PDF 열기',
		pdfKorean: 'PDF',
		viewPdf: 'PDF로 보기',
		visitSite: '사이트 보기',
		recentPosts: '최근 글',
		allPosts: '전체 글',
		workTitle: '작업',
		workIntro: '브랜딩부터 디지털 디자인과 구현까지, 주요 작업을 모았습니다.',
		caseStudiesTitle: '케이스스터디',
		caseStudiesIntro: '문제를 살펴보고, 설계하고, 배운 과정을 정리했습니다.',
		moreCaseStudies: '다른 케이스스터디',
		backToCaseStudies: '← 전체 케이스스터디',
		projectType: '프로젝트 유형',
		duration: '기간',
		role: '역할',
		tools: '툴',
		contents: '목차',
		overview: '개요',
		projectOverview: '프로젝트 개요',
		otherProjects: '다른 프로젝트',
		viewProject: '프로젝트 보기',
		backToWork: '← 전체 작업',
		viewLarger: '크게 보기',
		prevImage: '이전 그림',
		nextImage: '다음 그림',
		posts: '글',
		noPosts: '아직 글이 없습니다.',
		featured: '추천 글',
		share: '링크 복사',
		copied: '링크를 복사했어요',
		readPost: '글 보기',
		previousPost: '이전 글',
		nextPost: '다음 글',
		postNavigation: '이전 글과 다음 글',
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

// 카테고리(프로덕트·디자인·AI)는 블로그 안에 있다
export function blogUrl(lang: Lang): string {
	return `/${lang}/blog/`;
}

export function categoryUrl(lang: Lang, category: Category): string {
	return `/${lang}/blog/category/${category}/`;
}

// 블로그 목록 한 페이지에 보이는 글 수 (3열 × 3줄)
export const PAGE_SIZE = 9;

export function pageUrl(lang: Lang, page: number): string {
	return page === 1 ? blogUrl(lang) : `/${lang}/blog/page/${page}/`;
}

export const social = {
	linkedin: 'https://www.linkedin.com/in/juhee-oh-2137a6336/',
	threads: 'https://www.threads.com/@ai_design_jh',
	email: 'juheeeehuj94@gmail.com',
	// 언어별 이력서 (public/cv/)
	resume: { en: '/cv/juhee-oh-cv-en.pdf', ko: '/cv/juhee-oh-cv-ko.pdf' },
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

export function workUrl(lang: Lang, slug: string): string {
	return `/${lang}/work/${slug}/`;
}

export function portfolioIndexUrl(lang: Lang, section: PortfolioSection): string {
	return `/${lang}/${section}/`;
}

// 케이스스터디 페이지가 있는 작업인지 (PDF 로 여는 작업, 비공개 작업은 페이지가 없다)
export const hasPage = (w: CollectionEntry<'work'>) => !w.data.link && !w.data.locked;

// 작업 목록은 order 순. 배포 빌드에서는 draft 와 비공개(locked) 작업을 뺀다.
// 비공개 작업은 개발 서버에서만 보인다 (정리 중인 목록을 확인하는 용도)
export async function getWork(lang?: Lang, section?: PortfolioSection): Promise<CollectionEntry<'work'>[]> {
	const work = await getCollection(
		'work',
		(w) =>
			(import.meta.env.DEV || (!w.data.draft && !w.data.locked)) && (!lang || langFromId(w.id) === lang),
	);
	return selectPortfolio(work, section).sort((a, b) => a.data.order - b.data.order);
}
