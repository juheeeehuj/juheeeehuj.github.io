import Reveal from '../../primitives/Reveal'
import { tr } from '../../locale'

/** CHAISA 옥외 광고 애플리케이션을 비대칭 풀블리드 리듬으로 보여주는 3개 이미지 섹션. */
export default function BrandApplicationsShowcase() {
  return (
    <>
      <section
        aria-label={tr('차이사 행잉 배너 애플리케이션')}
        className="w-full overflow-hidden bg-black"
        id="brand-application-hanging-banner"
      >
        <Reveal
          as="figure"
          className="group w-full overflow-hidden md:w-[84%] lg:w-[76%]"
        >
          <img
            alt={tr('밝은 전시장 천장에 매달린 차이사 자동차 도장 서비스 배너')}
            className="block h-auto w-full origin-center scale-100 transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transform-none motion-reduce:transition-none lg:group-hover:scale-[1.02]"
            loading="lazy"
            src="/work/chaisa/brand/applications/chaisa-hanging-banner-blue.webp"
          />
        </Reveal>
      </section>

      <section
        aria-label={tr('차이사 커브드 빌보드 애플리케이션')}
        className="w-full overflow-hidden bg-black"
        id="brand-application-curved-billboard"
      >
        <Reveal
          as="figure"
          className="group w-full overflow-hidden md:ml-auto md:mr-[4%] md:w-[80%] lg:w-[64%]"
        >
          <img
            alt={tr('자동차 보호 필름 시공 장면을 담은 차이사 대형 커브드 빌보드')}
            className="block h-auto w-full origin-center scale-100 transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transform-none motion-reduce:transition-none lg:group-hover:scale-[1.02]"
            loading="lazy"
            src="/work/chaisa/brand/applications/chaisa-curved-billboard-ppf-blue.webp"
          />
        </Reveal>
      </section>

      <section
        aria-label={tr('차이사 듀얼 빌보드 애플리케이션')}
        className="w-full overflow-hidden bg-black"
        id="brand-application-dual-billboard"
      >
        <Reveal as="figure" className="group w-full overflow-hidden">
          <img
            alt={tr('어두운 전시장에 설치된 차이사 타이어와 자동차 정비 듀얼 빌보드')}
            className="block h-auto w-full origin-center scale-100 transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transform-none motion-reduce:transition-none lg:group-hover:scale-[1.02]"
            loading="lazy"
            src="/work/chaisa/brand/applications/chaisa-dual-billboard-blue-v2.webp"
          />
        </Reveal>
      </section>
    </>
  )
}
