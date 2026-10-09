'use client'

import { useEffect, useRef } from 'react'
import { tr } from '../../locale'

/**
 * PROBLEM → SOLUTION 4쌍 컬럼 + 모션.
 * 레이아웃: 좌측 레일(숫자 + 세로선 + 하단 엘보 화살표) / 우측 콘텐츠(Challenge → UX STRATEGY).
 * 세로선이 왼쪽에서 아래로 내려오다 하단에서 오른쪽 아래로 꺾여(╲) 해결로 이어짐.
 * 스크롤 진입 시: [문제 등장] → [선 draw-down] → [엘보] → [해결 등장], 컬럼별 스태거.
 * 감소모션이면 애니메이션 없이 그대로 노출.
 */

const PAIRS = [
  { n: '1', cTitle: '업체 검색', cDesc: '필요한 업체를 채널마다 하나씩 찾기', sTitle: '한 번에 연결', sDesc: '한 번의 요청으로 맞는 업체 연결' },
  { n: '2', cTitle: '가격 비교', cDesc: '가격·조건을 같은 기준으로 보기 어려움', sTitle: '한눈에 비교', sDesc: '같은 기준으로 정리된 견적' },
  { n: '3', cTitle: '후기 확인', cDesc: '후기·업체 정보가 여러 채널에 분산', sTitle: '한곳에 모아보기', sDesc: '업체 정보·후기를 한 화면에' },
  { n: '4', cTitle: '반복 문의', cDesc: '같은 조건을 여러 업체에 다시 설명', sTitle: '한 번만 입력', sDesc: '조건은 한 번만 입력하면 완료' },
]

export default function StrategyColumns() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let active = true
    let context: { revert: () => void } | undefined
    let mediaContext: gsap.MatchMedia | undefined

    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([gsapModule, triggerModule]) => {
      if (!active || !ref.current) return
      const gsap = gsapModule.gsap
      const ScrollTrigger = triggerModule.ScrollTrigger
      const columns = Array.from(el.querySelectorAll<HTMLElement>('[data-strategy-column]'))
      gsap.registerPlugin(ScrollTrigger)

      context = gsap.context(() => {
        gsap.set('[data-line]', { transformOrigin: 'top center' })
        mediaContext = gsap.matchMedia()

        mediaContext.add('(min-width: 1024px)', () => {
          gsap
            .timeline({ scrollTrigger: { trigger: el, start: 'top 78%', once: true } })
            .from('[data-challenge]', { y: 24, autoAlpha: 0, duration: 0.55, ease: 'power2.out', stagger: 0.09 })
            .fromTo('[data-line]', { scaleY: 0 }, { scaleY: 1, duration: 0.7, ease: 'power2.inOut', stagger: 0.09 }, '-=0.15')
            .from('[data-arrow]', { autoAlpha: 0, duration: 0.3, stagger: 0.09 }, '-=0.2')
            .from('[data-solution]', { y: 24, autoAlpha: 0, duration: 0.55, ease: 'power2.out', stagger: 0.09 }, '-=0.35')
        })

        mediaContext.add('(max-width: 1023px)', () => {
          columns.forEach((column) => {
            const challenge = column.querySelector<HTMLElement>('[data-challenge]')
            const line = column.querySelector<HTMLElement>('[data-line]')
            const arrow = column.querySelector<SVGElement>('[data-arrow]')
            const solution = column.querySelector<HTMLElement>('[data-solution]')
            if (!challenge || !line || !arrow || !solution) return

            gsap
              .timeline({ scrollTrigger: { trigger: column, start: 'top 78%', once: true } })
              .from(challenge, { y: 24, autoAlpha: 0, duration: 0.5, ease: 'power2.out' })
              .fromTo(line, { scaleY: 0 }, { scaleY: 1, duration: 0.62, ease: 'power2.inOut' }, '-=0.12')
              .from(arrow, { autoAlpha: 0, duration: 0.26 }, '-=0.18')
              .from(solution, { y: 24, autoAlpha: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
          })
        })
      }, el)
    })

    return () => {
      active = false
      mediaContext?.revert()
      context?.revert()
    }
  }, [])

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4" ref={ref}>
      {PAIRS.map((p) => (
        <div
          className="relative flex min-h-[26rem] flex-col pr-8 lg:min-h-[32rem]"
          data-strategy-column
          key={p.n}
        >
          {/* Challenge — 숫자(선 위에 정렬) + 라벨, 아래 제목·설명은 라벨과 정렬(pl-12) */}
          <div data-challenge>
            <div className="flex items-baseline">
              <span className="w-12 shrink-0 font-mono text-[15px] text-white/55">{p.n}</span>
              <span className="text-[15px] font-medium tracking-[-0.01em] text-white">Challenge</span>
            </div>
            <h3 className="mt-7 pl-12 text-[clamp(1.3rem,1.7vw,1.65rem)] font-bold tracking-[-0.02em]">{tr(p.cTitle)}</h3>
            <p className="mt-3.5 pl-12 text-[14px] leading-[1.65] text-white/50">{tr(p.cDesc)}</p>
          </div>

          {/* 좌측 레일 — 세로 직선 500px(숫자 22px 아래부터) → 꺾인선 20px @46° 위-오른쪽 체크마크(╱) */}
          <div aria-hidden className="relative h-[430px]">
            <div className="absolute left-[2px] top-[-80px] h-[500px] w-px bg-white/25" data-line />
            <svg
              className="absolute left-0 top-[400px] h-5 w-5 text-white/25"
              data-arrow
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              viewBox="0 0 20 20"
            >
              {/* (2,20)=세로선 끝(꼭짓점) → (16.4,6.1)=위-오른쪽, 20px @46° */}
              <path d="M2 20 L16.4 6.1" />
            </svg>
          </div>

          {/* UX STRATEGY — Challenge와 동일하게 pl-12 정렬 */}
          <div data-solution>
            <span className="block pl-12 text-[15px] font-medium tracking-[-0.01em] text-[#69A8FF]">UX STRATEGY</span>
            <h3 className="mt-7 pl-12 text-[clamp(1.3rem,1.7vw,1.65rem)] font-bold tracking-[-0.02em]">{tr(p.sTitle)}</h3>
            <p className="mt-3.5 pl-12 text-[14px] leading-[1.65] text-white/50">{tr(p.sDesc)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
