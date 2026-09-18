// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// 배포 주소. 개인 도메인을 연결하면 여기와 public/CNAME 을 같이 바꾼다.
const SITE = 'https://juheeeehuj.github.io';

// https://astro.build/config
export default defineConfig({
	site: SITE,

	// 한/영 모두 URL 앞에 언어를 붙인다 (/ko/, /en/) → 언어 토글이 경로 앞부분만 바꾸면 된다
	i18n: {
		defaultLocale: 'ko',
		locales: ['ko', 'en'],
		routing: {
			prefixDefaultLocale: true,
		},
	},

	// GitHub Pages 는 서버 리디렉트가 없어서 '/' 는 기본 언어로 보내는 스텁 페이지가 된다
	redirects: {
		'/': '/ko/',
	},

	// 코드 블록: 라이트/다크 두 벌 색을 같이 뽑고 global.css 가 html.dark 일 때 다크 색으로 바꾼다
	markdown: {
		shikiConfig: {
			themes: { light: 'github-light', dark: 'github-dark' },
		},
	},

	integrations: [
		mdx(),
		sitemap({
			i18n: {
				defaultLocale: 'ko',
				locales: { ko: 'ko-KR', en: 'en-US' },
			},
		}),
	],
});
