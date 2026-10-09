'use client'

import { useEffect, useRef } from 'react'
import { tr } from '../../locale'

export default function UiSocialShowcase() {
  const rootRef = useRef<HTMLElement>(null)
  const mediaRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const media = mediaRef.current
    if (!root || !media) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let active = true
    let context: { revert: () => void } | undefined
    let mediaContext: gsap.MatchMedia | undefined

    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([gsapModule, triggerModule]) => {
      if (!active || !rootRef.current || !mediaRef.current) return
      const gsap = gsapModule.gsap
      const ScrollTrigger = triggerModule.ScrollTrigger
      gsap.registerPlugin(ScrollTrigger)

      context = gsap.context(() => {
        mediaContext = gsap.matchMedia()

        mediaContext.add('(min-width: 1024px)', () => {
          gsap.fromTo(
            media,
            { clipPath: 'inset(0 100% 0 0)', filter: 'brightness(0.88)' },
            {
              clearProps: 'clipPath,filter',
              clipPath: 'inset(0 0% 0 0)',
              duration: 1.05,
              ease: 'power3.inOut',
              filter: 'brightness(1)',
              scrollTrigger: { trigger: root, start: 'top 82%', once: true },
            },
          )
        })

        mediaContext.add('(max-width: 1023px)', () => {
          gsap.fromTo(
            media,
            { autoAlpha: 0.35, filter: 'brightness(0.84)' },
            {
              autoAlpha: 1,
              clearProps: 'filter,opacity,visibility',
              duration: 0.62,
              ease: 'power2.out',
              filter: 'brightness(1)',
              scrollTrigger: { trigger: root, start: 'top 88%', once: true },
            },
          )
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
      aria-label={tr('차이사 모바일 홈과 소셜 프로필 UI')}
      className="w-full overflow-hidden bg-[#f5f5f5]"
      id="ui-social-showcase"
      ref={rootRef}
    >
      <img
        alt={tr('손에 든 차이사 모바일 홈 화면과 차이사 소셜 프로필 카드')}
        className="block h-auto w-full"
        data-ui-social-media
        loading="lazy"
        ref={mediaRef}
        src="/work/chaisa/ui/ui-social-showcase.webp"
      />
    </section>
  )
}
