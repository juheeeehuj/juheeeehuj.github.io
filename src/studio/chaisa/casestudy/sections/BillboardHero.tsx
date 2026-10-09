'use client'

import { useEffect, useRef } from 'react'
import { tr } from '../../locale'

/**
 * BillboardHero — 최상단 히어로(풀블리드). 차이사 빌보드 이미지(1920×1080) 풀사이즈.
 * 전광판 점등 → 블루 라이트 스윕 → 스크롤 카메라 드리프트의 세 단계로 움직인다.
 * 페이지 대표 h1을 여기 둔다(맨 위 섹션). reduced-motion 에서는 정적 이미지를 그대로 노출한다.
 */
export default function BillboardHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const sweepRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const media = mediaRef.current
    const image = imageRef.current
    const sweep = sweepRef.current

    if (!section || !media || !image || !sweep) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let active = true
    let context: { revert: () => void } | undefined

    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([gsapModule, triggerModule]) => {
        if (!active || !sectionRef.current) return

        const gsap = gsapModule.gsap
        const ScrollTrigger = triggerModule.ScrollTrigger
        gsap.registerPlugin(ScrollTrigger)

        context = gsap.context(() => {
          gsap.set([image, media], { transformOrigin: 'center center' })

          gsap
            .timeline({ defaults: { ease: 'power3.out' } })
            .fromTo(
              image,
              {
                autoAlpha: 0,
                filter: 'brightness(0.25) blur(5px)',
                scale: 1.07,
              },
              {
                autoAlpha: 1,
                clearProps: 'filter',
                duration: 1.4,
                filter: 'brightness(1) blur(0px)',
                scale: 1,
              },
            )
            .fromTo(
              sweep,
              { autoAlpha: 0, xPercent: -180 },
              {
                autoAlpha: 0.62,
                duration: 0.75,
                ease: 'power2.inOut',
                xPercent: 280,
              },
              '-=0.55',
            )
            .to(sweep, { autoAlpha: 0, duration: 0.18 })

          gsap.to(media, {
            ease: 'none',
            scale: 1.035,
            scrollTrigger: {
              end: 'bottom top',
              invalidateOnRefresh: true,
              scrub: 1,
              start: 'top top',
              trigger: section,
            },
            yPercent: 5,
          })
        }, section)
      },
    )

    return () => {
      active = false
      context?.revert()
    }
  }, [])

  return (
    <section
      className="relative min-h-dvh w-full overflow-hidden bg-black"
      ref={sectionRef}
    >
      <h1 className="sr-only">{tr('CHAISA — 자동차 애프터마켓 서비스 플랫폼 케이스 스터디')}</h1>
      <div
        className="absolute inset-0 will-change-transform"
        data-billboard-media
        ref={mediaRef}
      >
        <img
          alt={tr('차이사 빌보드 — The Right Choice for Your Car')}
          className="absolute inset-0 h-full w-full object-contain object-center will-change-[filter,opacity,transform] md:object-cover"
          data-billboard-image
          fetchPriority="high"
          ref={imageRef}
          src="/work/chaisa/billboard-hero.webp"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-[-8%] left-0 w-[42%] -skew-x-12 bg-gradient-to-r from-transparent via-[#007AFF]/40 to-transparent opacity-0 blur-2xl mix-blend-screen will-change-transform"
          data-billboard-sweep
          ref={sweepRef}
        />
      </div>
    </section>
  )
}
