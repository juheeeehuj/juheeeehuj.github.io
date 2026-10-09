'use client'

import { useEffect, useRef } from 'react'

export type RefineHeroProps = {
  imageSrc?: string
  logoSrc?: string
  imageAlt?: string
  className?: string
}

export default function RefineHero({
  imageSrc = '/work/refine-clinic/hero-img-3.webp',
  logoSrc = '/work/refine-clinic/refine_logo.webp',
  imageAlt = 'Refine Clinic — Brand & Website',
  className = '',
}: RefineHeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const scrimRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  // 스크롤 패럴랙스(줌인) + 하단 스크림 페이드 — 래퍼/스크림에만 걸어 마우스 패럴랙스(img)와 분리.
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (media.matches || !sectionRef.current) return

    let context: { revert: () => void } | undefined

    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([gsapModule, triggerModule]) => {
      if (!sectionRef.current || media.matches) return

      const gsap = gsapModule.gsap
      const ScrollTrigger = triggerModule.ScrollTrigger
      gsap.registerPlugin(ScrollTrigger)

      context = gsap.context(() => {
        gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.8,
          },
        })
          .to(wrapRef.current, { yPercent: 9, scale: 1.14, ease: 'none' }, 0)
          .to(scrimRef.current, { opacity: 1, ease: 'none' }, 0)
      }, sectionRef)
    })

    return () => context?.revert()
  }, [])

  // 마우스 패럴랙스 — 커서 위치에 따라 이미지가 미세하게 떠다니는 인터랙션.
  useEffect(() => {
    const section = sectionRef.current
    const img = imgRef.current
    if (!section || !img) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0

    const render = () => {
      cx += (tx - cx) * 0.08
      cy += (ty - cy) * 0.08
      img.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`
      if (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) {
        raf = requestAnimationFrame(render)
      } else {
        raf = 0
      }
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(render) }

    const onMove = (e: PointerEvent) => {
      const r = section.getBoundingClientRect()
      const nx = (e.clientX - r.left) / r.width - 0.5
      const ny = (e.clientY - r.top) / r.height - 0.5
      tx = nx * -30
      ty = ny * -20
      kick()
    }
    const onLeave = () => { tx = 0; ty = 0; kick() }

    section.addEventListener('pointermove', onMove)
    section.addEventListener('pointerleave', onLeave)
    return () => {
      section.removeEventListener('pointermove', onMove)
      section.removeEventListener('pointerleave', onLeave)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section
      className={`relative isolate min-h-dvh overflow-hidden bg-[#efe7dd] ${className}`}
      ref={sectionRef}
    >
      {/* 스크롤 패럴랙스 레이어 */}
      <div className="absolute inset-0 will-change-transform" ref={wrapRef}>
        {/* 마운트 시네마틱 리빌 레이어 (클립 커튼 + 줌 세틀) */}
        <div className="hero-reveal h-full w-full will-change-transform">
          <img
            alt={imageAlt}
            className="h-full w-full scale-[1.06] object-cover object-center will-change-transform motion-reduce:transform-none"
            fetchPriority="high"
            ref={imgRef}
            src={imageSrc}
          />
        </div>
      </div>

      {/* 스크롤에 따라 하단이 다음 섹션 톤으로 디졸브되는 스크림 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0"
        ref={scrimRef}
        style={{ background: 'linear-gradient(to bottom, transparent 48%, rgba(239,231,221,0.92) 100%)' }}
      />

      <style>{`
        .hero-reveal {
          animation: refineHeroReveal 1.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes refineHeroReveal {
          0%   { clip-path: inset(9% 7% 13% 7%); transform: scale(1.09); opacity: 0; }
          60%  { opacity: 1; }
          100% { clip-path: inset(0% 0% 0% 0%); transform: scale(1); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-reveal { animation: none; }
        }
      `}</style>
    </section>
  )
}
