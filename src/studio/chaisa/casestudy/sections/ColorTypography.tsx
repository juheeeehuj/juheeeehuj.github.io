'use client'

import { useEffect, useRef } from 'react'
import Reveal from '../../primitives/Reveal'
import Container from '../primitives/Container'
import Section from '../primitives/Section'
import { tr } from '../../locale'

/**
 * COLOR & TYPOGRAPHY — CharacterSection 다음. 헤더 포맷은 CHARACTER 섹션과 동일
 * (라벨 + 큰 타이틀 좌 + 본문 우). 브랜드북 스프레드처럼 다크 캔버스 위에
 * 얇은 컬러 띠 + 거대 타입 스펙이먼 단 두 요소만 두고 여백을 크게 가져간다.
 *
 * 배경 #141B2E — 브랜드 네이비 #0C1120 의 형제 톤(같은 hue, 명도만 위).
 * 팔레트 안의 #0C1120 스와치가 배경보다 깊어 또렷이 구분되고,
 * 앞선 LogoConstruction(#080A14)과도 톤이 갈려 다크 반복으로 읽히지 않는다.
 * 카드·라운드·테두리를 쓰지 않는다 — 배경 자체가 지면이다.
 */

const COLORS = [
  { name: 'CHAISA Blue', hex: '#007AFF', rgb: '0, 122, 255' },
  { name: 'White', hex: '#FFFFFF', rgb: '255, 255, 255' },
  { name: 'Dark Navy', hex: '#0C1120', rgb: '12, 17, 32' },
  { name: 'Neutral Gray', hex: '#E7ECF2', rgb: '231, 236, 242' },
  { name: 'Character Yellow', hex: '#FDC320', rgb: '253, 195, 32' },
]

const ARCHIVO = { fontFamily: 'Archivo, sans-serif' } as const
const PRETENDARD = { fontFamily: '"Pretendard Variable", Pretendard, sans-serif' } as const

export default function ColorTypography() {
  const paletteRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const palette = paletteRef.current
    if (!palette) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let active = true
    let context: { revert: () => void } | undefined

    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([gsapModule, triggerModule]) => {
        if (!active || !paletteRef.current) return

        const gsap = gsapModule.gsap
        const ScrollTrigger = triggerModule.ScrollTrigger
        const segments = Array.from(palette.querySelectorAll<HTMLElement>('[data-color-segment]'))
        const labels = Array.from(palette.querySelectorAll<HTMLElement>('[data-color-label]'))

        gsap.registerPlugin(ScrollTrigger)

        context = gsap.context(() => {
          gsap.set(segments, { scaleX: 0, transformOrigin: 'left center' })
          gsap.set(labels, { autoAlpha: 0, y: 14 })

          const timeline = gsap.timeline({
            scrollTrigger: {
              once: true,
              start: 'top 72%',
              trigger: palette,
            },
          })

          segments.forEach((segment, index) => {
            const offset = index * 0.12
            const label = labels[index]

            timeline.to(
              segment,
              {
                clearProps: 'transform',
                duration: 0.55,
                ease: 'power3.out',
                scaleX: 1,
              },
              offset,
            )

            if (label) {
              timeline.to(
                label,
                {
                  autoAlpha: 1,
                  clearProps: 'opacity,transform,visibility',
                  duration: 0.42,
                  ease: 'power2.out',
                  y: 0,
                },
                offset + 0.18,
              )
            }
          })
        }, palette)
      },
    )

    return () => {
      active = false
      context?.revert()
    }
  }, [])

  return (
    <Section className="overflow-hidden !bg-[#141B2E]" id="color-typography" theme="dark">
      <Container className="[text-wrap:pretty] [word-break:keep-all]">
        {/* 헤더 — CHARACTER 섹션과 동일 포맷(라벨 + 타이틀 좌 + 본문 우) */}
        <Reveal>
          <p
            className="text-[18px] font-semibold leading-[1.4] tracking-[0.14em] text-white/35"
            style={ARCHIVO}
          >
            COLOR &amp; TYPOGRAPHY
          </p>
        </Reveal>

        <div className="mt-[50px] grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
          <Reveal>
            <h2 className="max-w-[760px] text-[clamp(2rem,3.2vw,2.75rem)] font-medium leading-[1.35] tracking-[-0.03em] text-white">
              {tr('복잡한 과정을 명료하게,')}
              <br className="hidden sm:block" />{' '}{tr('낯선 서비스를 친근하게')}
            </h2>
          </Reveal>
          <Reveal className="lg:justify-self-end" delay={80}>
            <p className="max-w-[520px] text-[16px] leading-[1.8] text-white/55">
              {tr('차이사의 색과 타이포그래피는 신뢰감과 친근함을 일관되게 전합니다.')}
            </p>
          </Reveal>
        </div>

        {/* 컬러 팔레트 — 얇은 플러시 띠 + 세그먼트 시작점에 정렬한 hex/RGB */}
        <div
          className="mt-[clamp(6rem,13vw,15rem)] block"
          data-color-palette
          ref={paletteRef}
        >
          <div className="flex h-[clamp(20px,1.7vw,28px)] w-full">
            {COLORS.map((c) => (
              <div
                className="h-full flex-1 will-change-transform"
                data-color-segment
                key={c.hex}
                style={{ background: c.hex }}
              />
            ))}
          </div>
          {/* 띠와 동일한 5등분 그리드 — 각 hex 가 자기 색 세그먼트 왼쪽 끝에 맞는다 */}
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-5">
            {COLORS.map((c) => (
              <div className="will-change-[opacity,transform]" data-color-label key={c.hex}>
                <p className="text-[15px] leading-[1.4] tracking-[0.01em] text-white/85" style={ARCHIVO}>
                  {c.name}
                </p>
                <p className="mt-1.5 text-[14px] leading-[1.5] tracking-[0.01em] text-white/40" style={ARCHIVO}>
                  {c.hex}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 타이포그래피 — 거대 스펙이먼 한 덩어리 + 베이스라인에 붙은 초소형 폰트 정보 */}
        <Reveal className="mt-[clamp(7rem,16vw,18rem)] block">
          <div className="flex flex-wrap items-end justify-end gap-x-[clamp(1.5rem,4vw,4.5rem)] gap-y-8">
            <p
              className="text-[clamp(3rem,14vw,14rem)] font-medium leading-[0.9] tracking-[-0.04em] text-white"
              style={PRETENDARD}
            >
              Ab<span className="text-[0.88em]">가</span>
            </p>
            <div className="pb-[clamp(0.5rem,1.5vw,2rem)]">
              <p
                className="text-[13px] uppercase leading-[1.9] tracking-[0.16em] text-white/70"
                style={PRETENDARD}
              >
                Pretendard
              </p>
              <p className="text-[12px] leading-[1.9] tracking-[0.08em] text-white/35">
                {tr('제목과 본문 전반에 사용')}
              </p>
              <p className="mt-5 text-[12px] uppercase leading-[1.9] tracking-[0.2em] text-white/45">
                Regular / Medium / Bold
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
