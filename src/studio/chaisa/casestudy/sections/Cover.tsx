'use client'

import { useEffect, useRef } from 'react'
import { chaisaMedia } from '../../media'
import { tr } from '../../locale'

/**
 * Cover — 풀블리드 before/after 와이프 히어로.
 * 위팀·리파인처럼 텍스트 없이 영상형 모션만으로 첫 인상을 잡는다.
 * wrap → tint → ppf 순서로 시공 전/후가 자동으로 쓸려 넘어가며 무한 루프.
 * (사용자 확정 규칙: 히어로 = 풀블리드 / 텍스트·커서·UI 전부 제거)
 *
 * 구현: 각 pair 는 [before(하단) + after(상단, clip-path 로 가림) + edge(와이프 선)] 3층.
 * GSAP 타임라인이 clip 진행값을 0→100 으로 tween 하고 onUpdate 에서 직접 문자열을 써서
 * clip-path 를 갱신한다(퍼센트 보간을 GSAP 에 맡기지 않아 브라우저 편차 없이 안정적).
 */

const PAIRS = [
  { before: chaisaMedia.beforeAfter.wrap[0], after: chaisaMedia.beforeAfter.wrap[1], label: '래핑 시공 후' },
  { before: chaisaMedia.beforeAfter.tint[0], after: chaisaMedia.beforeAfter.tint[1], label: '틴팅 시공 후' },
  { before: chaisaMedia.beforeAfter.ppf[0], after: chaisaMedia.beforeAfter.ppf[1], label: 'PPF 시공 후' },
]

export default function Cover() {
  const sectionRef = useRef<HTMLElement>(null)
  const timelineRef = useRef<{ pause: () => void; resume: () => void } | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const pairEls = Array.from(section.querySelectorAll<HTMLElement>('.ba-pair'))
    const afterOf = (el: HTMLElement) => el.querySelector<HTMLElement>('.ba-after')
    const edgeOf = (el: HTMLElement) => el.querySelector<HTMLElement>('.ba-edge')

    const setClip = (el: HTMLElement, p: number) => {
      const after = afterOf(el)
      const edge = edgeOf(el)
      if (after) after.style.clipPath = `inset(0 ${100 - p}% 0 0)`
      if (edge) {
        edge.style.left = `${p}%`
        edge.style.opacity = String(Math.sin((p / 100) * Math.PI)) // 와이프 중에만 선이 보임
      }
    }

    // 접근성 감소 모드 — 애니메이션 없이 첫 pair 의 "시공 후"(그린 래핑)를 정적으로 노출
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      pairEls.forEach((el, i) => {
        el.style.opacity = i === 0 ? '1' : '0'
        if (i === 0) setClip(el, 100)
      })
      return
    }

    let active = true
    let context: { revert: () => void } | undefined
    let isIntersecting = false

    const syncPlayback = () => {
      const timeline = timelineRef.current
      if (!timeline) return

      if (isIntersecting && !document.hidden) {
        timeline.resume()
      } else {
        timeline.pause()
      }
    }

    const observer = new IntersectionObserver(([entry]) => {
      isIntersecting = entry.isIntersecting
      syncPlayback()
    }, { threshold: 0.08 })

    const handleVisibilityChange = () => syncPlayback()

    observer.observe(section)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    void import('gsap').then((mod) => {
      if (!active || !sectionRef.current) return
      const gsap = mod.gsap

      context = gsap.context(() => {
        // 초기 상태: pair0 만 노출(맨 위), 나머지 숨김. 모든 after 는 가려진 상태(시공 전 보임).
        gsap.set(pairEls, { opacity: 0, zIndex: 0 })
        gsap.set(pairEls[0], { opacity: 1, zIndex: 2 })
        pairEls.forEach((el) => setClip(el, 0))

        const tl = gsap.timeline({ repeat: -1, paused: true, defaults: { ease: 'power2.inOut' } })
        timelineRef.current = tl

        pairEls.forEach((el, i) => {
          const next = pairEls[(i + 1) % pairEls.length]
          const proxy = { p: 0 }

          tl.to({}, { duration: 0.7 }) // 시공 전 홀드
            .to(proxy, {
              p: 100,
              duration: 1.3,
              onStart: () => { proxy.p = 0 },
              onUpdate: () => setClip(el, proxy.p),
            }) // 와이프 → 시공 후
            .to({}, { duration: 1.5 }) // 시공 후 홀드
            // 다음 pair 로 크로스페이드 (z-index 로 순서 강제 → DOM 순서 무관, 루프 wrap 안전)
            .add(() => setClip(next, 0)) // 다음 pair 를 시공 전으로 리셋
            .set(next, { opacity: 0, zIndex: 2 })
            .set(el, { zIndex: 1 })
            .to(next, { opacity: 1, duration: 0.6 })
            .to(el, { opacity: 0, duration: 0.6 }, '<')
            .set(el, { zIndex: 0, opacity: 1 }) // 아래로 내려두기(다음 pair 가 덮으므로 안 보임)
        })

        syncPlayback()
      }, sectionRef)
    })

    return () => {
      active = false
      observer.disconnect()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      timelineRef.current = null
      context?.revert()
    }
  }, [])

  return (
    <section
      className="relative min-h-dvh w-full overflow-hidden bg-chaisa-ink"
      ref={sectionRef}
    >
      {PAIRS.map((pair, i) => (
        <div
          aria-hidden={i === 0 ? undefined : true}
          className="ba-pair absolute inset-0"
          key={pair.before}
          style={{ opacity: i === 0 ? 1 : 0 }}
        >
          {/* 시공 전 (하단) */}
          <img
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
            fetchPriority={i === 0 ? 'high' : undefined}
            loading="eager"
            src={pair.before}
          />
          {/* 시공 후 (상단, clip-path 로 가려진 채 시작) */}
          <img
            alt={i === 0 ? `${tr('차이사')} ${tr(pair.label)}` : ''}
            className="ba-after absolute inset-0 h-full w-full object-cover object-center"
            loading="eager"
            src={pair.after}
            style={{ clipPath: 'inset(0 100% 0 0)' }}
          />
          {/* 와이프 경계선 — UI 아닌 전환 표식(핸들 없음). 와이프 중에만 페이드 인. */}
          <div
            aria-hidden
            className="ba-edge pointer-events-none absolute inset-y-0 w-px bg-white/70 shadow-[0_0_16px_2px_rgba(0,0,0,0.45)]"
            style={{ left: '0%', opacity: 0 }}
          />
        </div>
      ))}

    </section>
  )
}
