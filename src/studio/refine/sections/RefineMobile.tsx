'use client'

import { useEffect, useRef } from 'react'
import type { Locale, Slot } from '@studio/lib/ia'
import { image, list } from '@studio/lib/field'
import Reveal from '../Reveal'

// 모바일 반응형 쇼케이스 — 긴 페이지(전체 스크롤) 폰들이 무드 배경 위에 펼쳐지는 에디토리얼 스캐터.
// 폰 4컷·배경 이미지는 CMS(refine_mobile_1)에서 읽고, 상단 오프셋·패럴랙스 속도는 코드로 유지.
function Phone({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="overflow-hidden rounded-[14px] shadow-[0_46px_90px_-30px_rgba(30,22,16,0.5)] ring-1 ring-black/[0.04] transition-transform duration-500 ease-out hover:-translate-y-2">
      <img alt={alt || 'Refine Clinic 모바일 화면'} className="block h-auto w-full" loading="lazy" src={src} />
    </div>
  )
}

// 4개 컬럼: 상단 오프셋 + 스크롤 패럴랙스 속도(px)를 다르게 줘 떠다니는 깊이감을 만든다(디자인 고정).
const COLUMNS = [
  { mt: 'md:mt-0', speed: -46 },
  { mt: 'mt-8 md:mt-40', speed: 30 },
  { mt: 'md:mt-20', speed: -64 },
  { mt: 'mt-8 md:mt-[16rem]', speed: 18 },
]

export default function RefineMobile({ data, locale, className = '' }: { data: Slot; locale: Locale; className?: string }) {
  const sectionRef = useRef<HTMLElement>(null)
  const bg = image(data, 'bgImage', locale)
  const imgs = list(data, 'images')

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const section = sectionRef.current
    if (!section) return

    let context: { revert: () => void } | undefined
    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([gsapModule, triggerModule]) => {
      if (!sectionRef.current) return
      const gsap = gsapModule.gsap
      const ScrollTrigger = triggerModule.ScrollTrigger
      gsap.registerPlugin(ScrollTrigger)

      context = gsap.context(() => {
        section.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
          const speed = Number(el.dataset.parallax || 0)
          gsap.to(el, {
            y: speed,
            ease: 'none',
            scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
          })
        })
      }, section)
    })

    return () => context?.revert()
  }, [])

  return (
    <section className={`${className} relative overflow-hidden`} ref={sectionRef}>
      {/* 무드 배경 이미지 (얼굴이 사이/우측에 드러나도록) */}
      <img aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-[62%_20%]" loading="lazy" src={bg.src} />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(115deg,rgba(233,225,214,0.82)_0%,rgba(226,216,203,0.44)_46%,rgba(219,208,195,0.26)_100%)]" />

      <div className="relative mx-auto max-w-[1760px] px-6 py-36 md:px-16 md:py-72">
        {/* 좌측 정렬 — 우측에 무드 배경이 드러나는 여백을 남겨 여백의 미를 보인다 */}
        <div className="md:w-[70%]">
          <div className="grid grid-cols-2 items-start gap-x-5 gap-y-12 md:grid-cols-4 md:gap-x-8">
            {COLUMNS.map((col, ci) => {
              const img = image(imgs[ci] ?? {}, 'image', locale)
              return (
                <Reveal className={col.mt} delay={ci * 70} key={ci}>
                  <div className="will-change-transform" data-parallax={col.speed}>
                    <Phone alt={img.alt} src={img.src} />
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
