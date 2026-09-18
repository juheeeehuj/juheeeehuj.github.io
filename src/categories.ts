// 글 카테고리. 목록·메뉴·카테고리 페이지가 모두 이 배열을 따른다.
// content.config.ts 에서도 쓰므로 astro:content 를 import 하지 않는다.
export const categories = ['product', 'design', 'ai'] as const;

export type Category = (typeof categories)[number];
