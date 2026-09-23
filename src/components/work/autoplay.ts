// data-autoplay 영상: 화면에 보이면 재생, 벗어나면 멈춤 (여러 개가 한꺼번에 받아지지 않게).
// 동작 줄이기 설정이면 포스터만 보여준다. MediaItem·Feature 가 같이 쓰고, 번들에는 한 번만 들어간다.
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
	const io = new IntersectionObserver(
		(entries) => {
			for (const e of entries) {
				const v = e.target as HTMLVideoElement;
				if (e.isIntersecting) v.play().catch(() => {});
				else v.pause();
			}
		},
		{ rootMargin: '200px 0px' },
	);
	document.querySelectorAll('video[data-autoplay]').forEach((v) => io.observe(v));
}
