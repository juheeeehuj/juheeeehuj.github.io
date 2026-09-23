// 스크롤 모션 (GSAP + ScrollTrigger). 케이스스터디·홈·작업 목록이 같이 쓴다.
//   - 덩어리(글·그림)는 화면에 들어올 때 아래에서 떠오른다
//   - 한 줄에 여러 개인 그림·카드는 차례로(stagger) 들어온다
//   - 단계 띠의 큰 질문은 한 박자 늦게 올라온다
//   - 폰 화면 장면은 폰이 먼저, 글이 옆에서 따라온다
//   - 커버 이미지는 스크롤할 때 살짝 느리게 움직인다(패럴랙스)
// 동작 줄이기 설정이면 아무것도 움직이지 않는다. 자바스크립트가 없어도 내용은 그대로 보인다.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

function reveal(targets: Element[]) {
	if (!targets.length) return;
	gsap.set(targets, { autoAlpha: 0, y: 48 });
	ScrollTrigger.batch(targets, {
		start: 'top 88%',
		once: true,
		onEnter: (batch) =>
			gsap.to(batch, {
				autoAlpha: 1,
				x: 0,
				y: 0,
				duration: 0.9,
				ease: 'power3.out',
				stagger: 0.12,
				overwrite: true,
				// 끝나면 transform 을 지운다 (남아 있으면 안쪽 position: fixed 요소의 기준이 바뀐다)
				clearProps: 'transform',
			}),
	});
}

const all = (sel: string, root: ParentNode = document) => [...root.querySelectorAll(sel)];

if (!reduce) {
	// 케이스스터디 머리: 라벨·제목·커버가 차례로
	const hero = document.querySelector('.case-hero');
	if (hero) {
		gsap.from(all('.category-badge, .title, .cover', hero), {
			autoAlpha: 0,
			y: 36,
			duration: 1,
			ease: 'power3.out',
			stagger: 0.12,
		});
		const cover = hero.querySelector('.cover');
		if (cover)
			gsap.to(cover, {
				yPercent: 8,
				ease: 'none',
				scrollTrigger: { trigger: cover, start: 'top top', end: 'bottom top', scrub: true },
			});
	}

	// 단계 띠: 라벨이 먼저, 큰 질문이 한 박자 늦게
	for (const phase of all('.case-phase, .case-statement')) {
		const parts = all('.phase-label, .phase-question, .statement-body', phase);
		gsap.set(parts, { autoAlpha: 0, y: 60 });
		ScrollTrigger.create({
			trigger: phase,
			start: 'top 80%',
			once: true,
			onEnter: () => gsap.to(parts, { autoAlpha: 1, y: 0, duration: 1.1, ease: 'power4.out', stagger: 0.15 }),
		});
	}

	// 덩어리의 글
	reveal(all('.case-block .block-text, .case-takeaways > div:first-child, .section-header'));

	// 그림: 한 줄·칸에 모인 것은 하나씩 차례로
	reveal(
		all('.case-body .media-item, .case-stages > li, .takeaway').filter(
			(el) => !el.closest('.case-feature'),
		),
	);

	// 폰 화면 장면: 폰은 아래에서, 글은 옆에서
	for (const feature of all('.case-feature')) {
		const screens = all('.screen', feature);
		const text = feature.querySelector('.text');
		const fromRight = !feature.classList.contains('reverse');
		gsap.set(screens, { autoAlpha: 0, y: 80 });
		if (text) gsap.set(text, { autoAlpha: 0, x: fromRight ? 60 : -60 });
		ScrollTrigger.create({
			trigger: feature,
			start: 'top 78%',
			once: true,
			onEnter: () => {
				const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
				tl.to(screens, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.15 });
				if (text) tl.to(text, { autoAlpha: 1, x: 0, duration: 0.9 }, 0.25);
			},
		});
	}

	// 홈·작업 목록 카드, 블로그 카드
	reveal(all('.work-list > li, .post-grid-list > li, .more-work > li'));

	// 이미지가 늦게 불러와져 높이가 바뀌면 위치를 다시 잰다
	addEventListener('load', () => ScrollTrigger.refresh());
}
