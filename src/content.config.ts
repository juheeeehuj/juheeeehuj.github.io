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

export const collections = { blog };
