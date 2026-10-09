'use client'

import { useEffect, useRef } from 'react'
import Container from '../primitives/Container'
import Section from '../primitives/Section'
import { tr } from '../../locale'

/**
 * UI DESIGN — ColorTypography 다음. 라이트 캔버스 위 거대 고스트 타이틀 "UI / DESIGN".
 * 그 아래 차이사 화면들을 리얼 디바이스 프레임에 담아 가로로 나란히(#89 톤).
 * 홈 · 견적 · 커뮤니티 3개. 각 폰 위에 번호 + 라벨.
 *
 * 모션: 각 단계가 보일 때 라벨 → 레일 → 엘보 → 폰 순서로 연결된다.
 * UI 원본의 상단은 이동·확대하지 않고 온전히 유지하며, 감소모션에서는 정적으로 노출된다.
 */

const ARCHIVO = { fontFamily: 'Archivo, sans-serif' } as const

// 대각선 계단 — 오른쪽으로 갈수록 아래로(겹치는 캐스케이드)
const STAIR = ['lg:mt-0', 'lg:mt-[clamp(8rem,15vw,14rem)]', 'lg:mt-[clamp(16rem,30vw,28rem)]']

const STEPS = [
  { n: '1', name: 'HOME', sub: '홈', desc: '서비스 선택부터 무료 견적까지, 한 화면에서 시작합니다.', src: '/work/chaisa/ui/main.webp', alt: '차이사 홈 화면' },
  { n: '2', name: 'ESTIMATE', sub: '견적 요청', desc: '차량 정보·일정·서비스·지역을 한 흐름으로 입력합니다.', src: '/work/chaisa/ui/flow/estimate-long.webp', alt: '차이사 견적 요청' },
  { n: '3', name: 'COMMUNITY', sub: '커뮤니티', desc: '시공 후기와 차량 정보를 나누는 공간으로 이어집니다.', src: '/work/chaisa/ui/community.webp', alt: '차이사 커뮤니티 화면' },
]

/** 화면 — 베젤 없이 라운드 코너 + 은은한 그림자. pad=true면 좌우 안쪽 여백(타이트한 화면 숨통). */
function DeviceFrame({ src, alt, pad }: { src: string; alt: string; pad?: boolean }) {
  return (
    <div
      className={`overflow-hidden rounded-[1.25rem] bg-white shadow-[0_30px_70px_-30px_rgba(12,17,32,0.28)] ring-1 ring-black/[0.05] ${pad ? 'px-[14px]' : ''}`}
    >
      <img
        alt={alt}
        className="block w-full"
        data-ui-screen
        loading="lazy"
        src={src}
      />
    </div>
  )
}

export default function UiDesign() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let active = true
    let context: { revert: () => void } | undefined
    let mediaContext: gsap.MatchMedia | undefined

    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([gsapModule, triggerModule]) => {
      if (!active || !rootRef.current) return
      const gsap = gsapModule.gsap
      const ScrollTrigger = triggerModule.ScrollTrigger
      const title = el.querySelector<HTMLElement>('[data-ui-title]')
      const steps = Array.from(el.querySelectorAll<HTMLElement>('[data-ui-step]'))
      gsap.registerPlugin(ScrollTrigger)

      context = gsap.context(() => {
        if (title) {
          gsap.fromTo(
            title,
            { clipPath: 'inset(0 0 100% 0)', y: 28 },
            {
              clearProps: 'clipPath,transform',
              clipPath: 'inset(0 0 0% 0)',
              duration: 0.9,
              ease: 'power3.out',
              scrollTrigger: { trigger: title, start: 'top 88%', once: true },
              y: 0,
            },
          )
        }

        const createStepTimeline = (step: HTMLElement, start: string) => {
          const label = step.querySelector<HTMLElement>('[data-ui-label]')
          const line = step.querySelector<HTMLElement>('[data-ui-line]')
          const elbow = step.querySelector<SVGElement>('[data-ui-elbow]')
          const phone = step.querySelector<HTMLElement>('[data-ui-phone]')
          if (!label || !line || !elbow || !phone) return

          gsap.set(line, { transformOrigin: 'top center' })
          gsap
            .timeline({ scrollTrigger: { trigger: step, start, once: true } })
            .from(label, { autoAlpha: 0, duration: 0.34, ease: 'power2.out', y: 16 })
            .fromTo(line, { scaleY: 0 }, { duration: 0.52, ease: 'power2.inOut', scaleY: 1 }, '-=0.1')
            .from(elbow, { autoAlpha: 0, duration: 0.26, ease: 'power2.out', x: -5, y: 5 }, '-=0.14')
            .from(phone, {
              autoAlpha: 0,
              duration: 0.66,
              ease: 'power3.out',
              scale: 0.97,
              transformOrigin: 'center top',
              y: 48,
            }, '-=0.16')
        }

        mediaContext = gsap.matchMedia()
        mediaContext.add('(max-width: 1023px)', () => {
          steps.forEach((step) => createStepTimeline(step, 'top 82%'))
        })

        mediaContext.add('(min-width: 1024px)', () => {
          steps.forEach((step) => createStepTimeline(step, 'top 78%'))
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
    <Section className="overflow-hidden !bg-[#f3f4f7]" id="ui-design" theme="light">
      <Container className="[text-wrap:pretty] [word-break:keep-all]">
        <div ref={rootRef}>
          {/* 거대 고스트 타이틀 — UI / DESIGN */}
          <p
            aria-hidden
            className="pointer-events-none select-none leading-[0.88] tracking-[-0.04em] text-[clamp(5rem,16vw,14rem)] font-semibold text-[#0c1120]/[0.07]"
            data-ui-title
            style={ARCHIVO}
          >
            UI
            <br />
            DESIGN
          </p>

          {/* 대각선 캐스케이드 — 유닛(라벨 + 세로선+엘보 + 긴 폰)이 오른쪽·아래로 흐름 */}
          <div className="mt-[clamp(3rem,6vw,5rem)] flex flex-col items-center gap-[clamp(5rem,12vw,10rem)] lg:flex-row lg:items-start lg:justify-start lg:gap-[clamp(3rem,12vw,11.5rem)]">
            {STEPS.map((s, i) => {
              return (
                <div
                  className={`relative w-full max-w-[28rem] pl-9 lg:w-auto lg:max-w-none lg:shrink-0 ${STAIR[i]}`}
                  data-ui-step
                  key={s.n}
                >
                  {/* 좌측 레일 — 끊김 없는 긴 세로선 + 오른쪽 위(↗) 엘보 (전 카드 동일) */}
                  <div aria-hidden className="pointer-events-none absolute bottom-0 left-0 top-[5.5rem] w-9">
                    <div
                      className="absolute bottom-0 left-[2px] top-0 w-px bg-[#0c1120]/20"
                      data-ui-line
                    />
                    <svg
                      className="absolute bottom-0 left-0 h-5 w-5 text-[#0c1120]/25"
                      data-ui-elbow
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      viewBox="0 0 20 20"
                    >
                      {/* 세로선 끝(2,20) → 오른쪽 위(16.4,6.1) */}
                      <path d="M2 20 L16.4 6.1" />
                    </svg>
                  </div>

                  {/* 라벨 — 직선 라인 바로 위에 정렬(-ml-9). 폰과 충분한 간격 유지 */}
                  <div className="mb-12 -ml-9" data-ui-label>
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-[13px] text-black/40">{s.n}</span>
                      <span className="text-[14px] font-semibold tracking-[0.03em] text-[#0c1120]" style={ARCHIVO}>
                        {s.name}
                      </span>
                      <span className="text-[13px] text-black/45">{tr(s.sub)}</span>
                    </div>
                    <p className="mt-2 max-w-[13rem] text-[13px] leading-[1.6] text-black/50">{tr(s.desc)}</p>
                  </div>

                  {/* 화면 (#2·#3은 좌우 여백 추가) */}
                  <figure
                    className="w-full max-w-[18rem] lg:w-[clamp(11rem,17vw,15rem)]"
                    data-ui-phone
                  >
                    <DeviceFrame alt={tr(s.alt)} pad={i !== 0} src={s.src} />
                  </figure>
                </div>
              )
            })}
          </div>
        </div>
      </Container>
    </Section>
  )
}
