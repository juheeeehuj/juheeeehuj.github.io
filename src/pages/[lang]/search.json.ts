// 검색 팝업이 불러가는 글 목록. 빌드할 때 언어별로 한 번 만들어진다.
import type { APIRoute } from 'astro';
import {
	categoryLabels,
	formatDate,
	getPosts,
	languages,
	postUrl,
	slugFromId,
	type Lang,
} from '../../i18n/ui';

export function getStaticPaths() {
	return (Object.keys(languages) as Lang[]).map((lang) => ({ params: { lang } }));
}

// 마크다운 기호·코드·링크 주소를 걷어내고 검색용 평문만 남긴다
function plain(markdown = ''): string {
	return markdown
		.replace(/```[\s\S]*?```/g, ' ')
		.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/<[^>]+>/g, ' ')
		.replace(/[#>*_`~|\-]+/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

export const GET: APIRoute = async ({ params }) => {
	const lang = params.lang as Lang;
	const posts = await getPosts(lang);
	const items = posts.map((p) => ({
		title: p.data.title,
		description: p.data.description,
		url: postUrl(lang, slugFromId(p.id)),
		date: formatDate(p.data.pubDate, lang, 'short'),
		category: p.data.category ? categoryLabels[lang][p.data.category] : '',
		tags: p.data.tags,
		text: plain(p.body).slice(0, 6000),
	}));
	return new Response(JSON.stringify(items), {
		headers: { 'Content-Type': 'application/json; charset=utf-8' },
	});
};
