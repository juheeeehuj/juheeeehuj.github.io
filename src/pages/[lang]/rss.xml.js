import rss from '@astrojs/rss';
import { getPosts, languages, postUrl, slugFromId, ui } from '../../i18n/ui';

export function getStaticPaths() {
	return Object.keys(languages).map((lang) => ({ params: { lang } }));
}

export async function GET(context) {
	const { lang } = context.params;
	const posts = (await getPosts(lang)).filter((p) => !p.data.draft);

	return rss({
		title: ui[lang].siteTitle,
		description: ui[lang].siteDescription,
		site: context.site,
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			link: postUrl(lang, slugFromId(post.id)),
		})),
	});
}
