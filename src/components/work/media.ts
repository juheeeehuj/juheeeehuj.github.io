import type { ImageMetadata } from 'astro';
import sharp from 'sharp';

// 케이스스터디 본문(MDX)은 미디어를 "webmd/empathy-map.png" 처럼 이름으로 부른다.
// 한/영 두 파일이 같은 이미지를 쓰므로, 파일마다 import 를 늘어놓지 않으려고 여기서 한 번에 찾는다.
//   - 이미지: src/assets/work/<name>  (빌드 때 webp 로 줄어든다)
//   - 영상  : public/work/<name>.mp4, 첫 프레임 포스터는 같은 이름의 .jpg (확장자 없이 부른다)
const images = import.meta.glob<{ default: ImageMetadata }>('/src/assets/work/**/*.{png,jpg,jpeg,webp}', {
	eager: true,
});

export const isImage = (name: string) => /\.(png|jpe?g|webp)$/i.test(name);

export function workImage(name: string): ImageMetadata {
	const mod = images[`/src/assets/work/${name}`];
	if (!mod) throw new Error(`[work] 이미지가 없습니다: src/assets/work/${name}`);
	return mod.default;
}

export async function workVideo(name: string) {
	const poster = `/work/${name}.jpg`;
	// 한 줄에 나란히 놓을 때 높이를 맞추려면 비율이 필요해서 포스터 크기를 읽는다
	const { width = 16, height = 9 } = await sharp(`public${poster}`).metadata();
	return { src: `/work/${name}.mp4`, poster, width, height };
}

/** 이미지·영상 공통: 이름 하나로 크기까지 */
export async function workMedia(name: string) {
	if (isImage(name)) {
		const img = workImage(name);
		return { kind: 'image' as const, img, width: img.width, height: img.height };
	}
	const video = await workVideo(name);
	return { kind: 'video' as const, video, width: video.width, height: video.height };
}
