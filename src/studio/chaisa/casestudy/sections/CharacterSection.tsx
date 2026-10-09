'use client'

import Image from '@studio/lib/Image'
import { useEffect, useRef } from 'react'
import Reveal from '../../primitives/Reveal'
import Container from '../primitives/Container'
import Section from '../primitives/Section'
import CharacterFeedCarousel from './CharacterFeedCarousel'
import { tr } from '../../locale'

export default function CharacterSection() {
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const heroRoot = heroRef.current
    if (!heroRoot) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let active = true
    let context: { revert: () => void } | undefined

    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([gsapModule, triggerModule]) => {
      if (!active || !heroRef.current) return
      const gsap = gsapModule.gsap
      const ScrollTrigger = triggerModule.ScrollTrigger
      const bubble = heroRoot.querySelector<HTMLElement>('[data-character-bubble]')
      const character = heroRoot.querySelector<HTMLElement>('[data-character-hero]')
      if (!bubble || !character) return

      gsap.registerPlugin(ScrollTrigger)
      context = gsap.context(() => {
        gsap
          .timeline({ scrollTrigger: { trigger: heroRoot, start: 'top 78%', once: true } })
          .from(bubble, {
            autoAlpha: 0,
            duration: 0.42,
            ease: 'back.out(1.8)',
            scale: 0.88,
            transformOrigin: 'center bottom',
            y: 10,
          })
          .from(character, {
            autoAlpha: 0,
            duration: 0.62,
            ease: 'power3.out',
            scale: 0.96,
            y: 36,
          }, '-=0.18')
      }, heroRoot)
    })

    return () => {
      active = false
      context?.revert()
    }
  }, [])

  return (
    <Section className="overflow-hidden !bg-[#0C1120]" id="character" theme="dark">
      <Container className="text-center [text-wrap:pretty] [word-break:keep-all]">
        <Reveal>
          <p
            className="text-center text-[18px] font-semibold leading-[1.4] tracking-[0.14em] text-white/35"
            style={{ fontFamily: 'Archivo, sans-serif' }}
          >
            CHARACTER
          </p>
        </Reveal>

        <div className="mt-[50px] flex flex-col items-center text-center">
          <Reveal className="flex w-full justify-center">
            <h2 className="mx-auto max-w-[760px] text-center text-[clamp(2rem,3.2vw,2.75rem)] font-medium leading-[1.35] tracking-[-0.03em] text-white">
              {tr('차를 잘 아는 든든한 안내자,')}
              <br className="hidden sm:block" />{' '}{tr('차타 이사님')}
            </h2>
          </Reveal>
          <Reveal className="mt-7 flex w-full justify-center" delay={80}>
            <p className="mx-auto max-w-[520px] text-center text-[16px] leading-[1.8] text-white/60">
              {tr('복잡하게 느껴지는 차량 서비스 과정을 친근하고 명확하게 안내합니다.')}
            </p>
          </Reveal>
        </div>

        <div className="mt-[clamp(4rem,8vw,7rem)]" ref={heroRef}>
          <figure
            aria-label={tr('차타 이사님 메인 비주얼')}
            className="flex flex-col items-center gap-[10px] bg-transparent"
          >
            <div
              className="relative z-10 rounded-full bg-white px-5 py-3 text-[15px] font-bold tracking-[-0.02em] text-[#007AFF] shadow-[0_12px_36px_rgba(5,8,22,0.1)] sm:px-7 sm:py-4 sm:text-[18px]"
              data-character-bubble
            >
              {tr('차타 이사님')}
              <span
                aria-hidden
                className="absolute -bottom-[6px] left-1/2 size-3 -translate-x-1/2 rotate-45 rounded-[1px] bg-white"
              />
            </div>

            <div
              className="w-[clamp(180px,43vw,280px)] max-w-[280px]"
              data-character-hero
            >
              <Image
                alt={tr('엄지를 들고 인사하는 차타 이사님 캐릭터')}
                className="h-auto w-full object-contain"
                height={2630}
                sizes="(max-width: 639px) 48vw, 280px"
                src="/work/chaisa/brand/character/cheetah-upscaled.webp"
                width={2392}
              />
            </div>
          </figure>
        </div>
      </Container>

      <CharacterFeedCarousel />
    </Section>
  )
}
