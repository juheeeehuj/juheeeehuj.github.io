import Reveal from '../../primitives/Reveal'
import { tr } from '../../locale'

/**
 * Mockup — 목업/비주얼 보드 섹션(풀블리드 이미지). MoodBoard 아래.
 * 블루 카 디테일 콜라주(1920×1444, 4:3)를 폭 꽉 채워 노출. 이미지는 추후 교체 가능.
 */
export default function Mockup() {
  return (
    <section className="relative w-full overflow-hidden bg-black" id="mockup">
      <Reveal className="group overflow-hidden">
        <img
          alt={tr('차이사 비주얼 무드 — 블루 카 디테일')}
          className="block h-auto w-full origin-center scale-100 transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transform-none motion-reduce:transition-none lg:group-hover:scale-[1.02]"
          loading="lazy"
          src="/work/chaisa/mockup-board.webp"
        />
      </Reveal>
    </section>
  )
}
