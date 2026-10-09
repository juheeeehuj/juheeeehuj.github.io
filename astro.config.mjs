// @ts-check

import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { defineHastPlugin } from 'satteri';
import localEditor from './src/editor/integration.mjs';

// 본문에 이미지만 있는 문단을 <figure> 로 감싸고 alt 를 캡션(<figcaption>)으로 보여준다.
// Astro 7 의 기본 마크다운 처리기(Sätteri)용 플러그인이다. rehype 플러그인은 여기서 동작하지 않는다.
const figureCaptions = defineHastPlugin({
	name: 'figure-captions',
	element: {
		filter: ['p'],
		visit(node, ctx) {
			const kids = node.children.filter((c) => !(c.type === 'text' && !c.value.trim()));
			const img = kids[0];
			if (kids.length !== 1 || img.type !== 'element' || img.tagName !== 'img') return;
			const alt = String(img.properties?.alt ?? '').trim();
			const caption = { type: 'element', tagName: 'figcaption', properties: {}, children: [{ type: 'text', value: alt }] };
			ctx.replaceNode(node, {
				type: 'element',
				tagName: 'figure',
				properties: {},
				children: alt ? [img, caption] : [img],
			});
		},
	},
});

// 배포 주소 (개인 도메인). 도메인 연결 자체는 GitHub 레포 Settings → Pages 에서 한다.
const SITE = 'https://juheeoh.com';

// https://astro.build/config
export default defineConfig({
	site: SITE,

	// 한/영 모두 URL 앞에 언어를 붙인다 (/en/, /ko/) → 언어 토글이 경로 앞부분만 바꾸면 된다
	i18n: {
		defaultLocale: 'en',
		locales: ['en', 'ko'],
		routing: {
			prefixDefaultLocale: true,
		},
	},

	// GitHub Pages 는 서버 리디렉트가 없어서 '/' 는 기본 언어로 보내는 스텁 페이지가 된다
	redirects: {
		'/': '/en/',
		// 카테고리가 블로그 안으로 들어가기 전 주소
		'/[lang]/category/[category]': '/[lang]/blog/category/[category]',
	},

	// 코드 블록: 라이트/다크 두 벌 색을 같이 뽑고 global.css 가 html.dark 일 때 다크 색으로 바꾼다
	markdown: {
		shikiConfig: {
			themes: { light: 'github-light', dark: 'github-dark' },
		},
		processor: satteri({ hastPlugins: [figureCaptions] }),
	},

	// Tailwind 는 AX Studio 에서 옮겨 온 케이스스터디(src/studio)만 쓴다. studio.css 를 불러오는 페이지에만 실린다
	vite: {
		plugins: [tailwindcss()],
	},

	integrations: [
		mdx(),
		react(),
		// 로컬 전용 글 편집기 (npm run dev 에서만 동작)
		localEditor(),
		sitemap({
			i18n: {
				defaultLocale: 'en',
				locales: { en: 'en-US', ko: 'ko-KR' },
			},
		}),
	],
});
