import Reveal from '../../primitives/Reveal'
import { tr } from '../../locale'

/**
 * BrandPromise — 3번째 섹션. "숨 고르는" 브랜드 선언(스플릿 스크린).
 * 좌: 네이비 다크 패널 + 담백한 약속 문구 2줄(센터).
 * 우: 블루 듀오톤 풀블리드 사진 — hover 시 컬러로 리빌("걱정이 색으로 바뀐다").
 * 규칙상 이미지 섹션이라 풀블리드(폭 제약 없음). 카피는 임시 하드코딩(→ content.ts 이동 가능).
 * 이미지는 자동차 도장 작업 전용 컷.
 */
export default function BrandPromise() {
  return (
    <section className="relative w-full overflow-hidden bg-[#07142f] text-white" id="promise">
      <div className="grid min-h-dvh grid-cols-1 lg:grid-cols-2">
        {/* 좌 — 다크 스테이트먼트 패널 */}
        <div className="relative flex flex-col items-center justify-center px-6 py-24 text-center md:px-12 lg:px-16 lg:py-0">
          <Reveal>
            <p className="text-[18px] font-normal leading-[1.9] tracking-[-0.01em] text-white [word-break:keep-all]">
              {tr('내 차 걱정, 이제 안 하셔도 됩니다.')}
              <br />
              {tr('견적부터 시공까지 — 차이사가 함께합니다.')}
            </p>
          </Reveal>
        </div>

        {/* 우 — 블루 듀오톤 사진(풀블리드), hover 시 컬러 리빌 */}
        <div className="group relative min-h-[58vh] overflow-hidden lg:min-h-0">
          <img
            alt={tr('자동차 도장 전문가가 차량 외장에 색상을 분사하는 모습')}
            className="absolute inset-0 block h-full w-full object-cover grayscale contrast-[1.06] transition duration-[900ms] ease-out will-change-transform group-hover:scale-[1.03] group-hover:grayscale-0 group-hover:contrast-100"
            src="/work/chaisa/generated/automotive-painting-960x1080.webp"
          />
          {/* 블루 듀오톤 틴트 — hover 시 사라지며 원색 노출 */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[#0d3fb0] mix-blend-color transition-opacity duration-[900ms] ease-out group-hover:opacity-0"
          />
          {/* 인터랙션 힌트 */}
          <span className="pointer-events-none absolute bottom-6 right-6 hidden font-mono text-[11px] uppercase tracking-[0.2em] text-white/70 transition-opacity duration-500 group-hover:opacity-0 lg:block">
            hover → color
          </span>
        </div>
      </div>
    </section>
  )
}
