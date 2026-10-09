'use client'

import { useEffect, useRef } from 'react'
import { tr } from '../../locale'

/** CHAISA 케이스 스터디를 마무리하는 16:9 풀블리드 비주얼. */
const PANEL_COLORS = ['bg-black', 'bg-[#111820]', 'bg-[#27313f]', 'bg-[#06326f]']

export default function ClosingVisual() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const image = root.querySelector<HTMLElement>('[data-closing-image]')
    const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-closing-panel]'))
    const sweep = root.querySelector<HTMLElement>('[data-closing-sweep]')
    if (!image || panels.length !== 4 || !sweep) return

    let active = true
    let context: { revert: () => void } | undefined
    let mediaContext: gsap.MatchMedia | undefined

    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([gsapModule, triggerModule]) => {
      if (!active || !rootRef.current) return
      const gsap = gsapModule.gsap
      const ScrollTrigger = triggerModule.ScrollTrigger
      gsap.registerPlugin(ScrollTrigger)

      context = gsap.context(() => {
        const createIgnition = (duration: number, stagger: number, sweepDuration: number, start: string) => {
          gsap.set(panels, {
            autoAlpha: 1,
            scaleX: 1,
            transformOrigin: 'right center',
          })

          gsap
            .timeline({ scrollTrigger: { trigger: root, start, once: true } })
            .fromTo(
              image,
              { filter: 'brightness(0.62)' },
              {
                clearProps: 'filter',
                duration: duration + stagger * 3,
                ease: 'power2.out',
                filter: 'brightness(1)',
              },
            )
            .to(
              panels,
              {
                duration,
                ease: 'power3.inOut',
                scaleX: 0,
                stagger,
              },
              0,
            )
            .fromTo(
              sweep,
              { autoAlpha: 0, xPercent: -170 },
              {
                autoAlpha: 0.68,
                duration: sweepDuration,
                ease: 'power2.inOut',
                xPercent: 470,
              },
              '-=0.2',
            )
            .to(sweep, { autoAlpha: 0, duration: 0.18 })
            .set(panels, { autoAlpha: 0 })
        }

        mediaContext = gsap.matchMedia()
        mediaContext.add('(min-width: 1024px)', () => {
          createIgnition(0.68, 0.13, 0.82, 'top 78%')
        })
        mediaContext.add('(max-width: 1023px)', () => {
          createIgnition(0.42, 0.07, 0.56, 'top 90%')
        })
      }, root)
    })

    return () => {
      active = false
      mediaContext?.revert()
      context?.revert()
    }
  }, [])

  return (
    <section
      aria-label={tr('차이사 클로징 비주얼')}
      className="relative aspect-video w-full overflow-hidden bg-black"
      ref={rootRef}
    >
      <img
        alt={tr('검은 스포츠카가 검정, 회색, 블루 색상 구간을 가로질러 달리는 모습')}
        className="absolute inset-0 block h-full w-full object-cover"
        data-closing-image
        loading="lazy"
        src="/work/chaisa/brand/applications/last-scene.webp"
      />

      <div aria-hidden className="pointer-events-none absolute inset-0">
        {Array.from({ length: 4 }, (_, index) => (
          <span
            className={`absolute inset-y-0 opacity-0 motion-reduce:hidden ${PANEL_COLORS[index]}`}
            data-closing-panel
            key={PANEL_COLORS[index]}
            style={{ left: `${index * 25}%`, width: '25%' }}
          />
        ))}
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-[-12%] left-0 w-[28%] -skew-x-12 bg-gradient-to-r from-transparent via-[#1688ff]/70 to-transparent opacity-0 blur-2xl mix-blend-screen motion-reduce:hidden"
        data-closing-sweep
      />
    </section>
  )
}
