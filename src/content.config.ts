import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { categories } from './categories';

// 글은 src/content/blog/<lang>/<slug>.md 에 둔다.
//   - 언어는 폴더 이름(ko/en)으로 정해진다
//   - ko/와 en/에 같은 파일명이 있으면 서로 번역 짝으로 연결된다
const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			category: z.enum(categories).optional(),
			tags: z.array(z.string()).default([]),
			// true 면 홈 상단 슬라이드에 올라간다
			featured: z.boolean().default(false),
			// true 면 배포에서 빠진다 (npm run dev 에서는 보인다)
			draft: z.boolean().default(false),
		}),
});

// 작업(케이스스터디)은 src/content/work/<lang>/<slug>.mdx 에 둔다. 번역 짝 규칙은 blog 와 같다.
//   - 이미지는 src/assets/work/<slug>/, 영상·PDF 는 public/work/<slug>/ 에 둔다
//   - link 나 locked 가 있는 작업은 상세 페이지 없이 목록 아래 한 줄로만 보인다
const work = defineCollection({
	loader: glob({ base: './src/content/work', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// 제목 위 작은 라벨 (예: App Redesign)
			kicker: z.string(),
			cover: image(),
			projectType: z.string().optional(),
			duration: z.string(),
			role: z.string().optional(),
			tools: z.array(z.string()).default([]),
			// 케이스스터디 페이지 대신 이 주소(예: PDF)를 연다
			link: z.string().optional(),
			// true 면 아직 준비 중: 목록에 자물쇠로만 보이고 페이지는 만들지 않는다
			locked: z.boolean().default(false),
			// 목록에 보이는 연도 (예: 2026)
			year: z.string().optional(),
			// 목록 정렬 순서 (작을수록 앞)
			order: z.number(),
			// true 면 홈 Selected Work 에 올라간다
			featured: z.boolean().default(false),
			draft: z.boolean().default(false),
		}),
});

export const collections = { blog, work };
