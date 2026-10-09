'use client'

import gsap from 'gsap'
import { useEffect, useRef } from 'react'

// 색면 하나가 "이 색이 품은 폭"을 보여준다 — 큰 정사각 위로 톤 계단이 차례로 차오르고,
// 끝까지 차면 같은 순서로 접혀 원색으로 돌아간다.
const RAMP_STEPS = 7

// 톤은 값에서 만든다 — 손으로 적어 두면 브랜드 색이 바뀔 때 어긋난다.
function mix(hex: string, target: number, amount: number): string {
  const h = hex.replace('#', '')
  const channels = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16))
  const mixed = channels.map((c) => Math.round(c + (target - c) * amount))
  return `#${mixed.map((c) => c.toString(16).padStart(2, '0')).join('')}`
}

// 위는 어둡게 아래는 밝게 — 가운데 계단이 원색이다.
function buildRamp(hex: string): string[] {
  const mid = (RAMP_STEPS - 1) / 2
  return Array.from({ length: RAMP_STEPS }, (_, step) => {
    const distance = (step - mid) / mid
    return distance < 0 ? mix(hex, 0, -distance * 0.82) : mix(hex, 255, distance * 0.72)
  })
}

type BrandColorSwatchProps = {
  hex: string
  index: string
  name: string
  rgb: string
  swatch: string
}

export default function BrandColorSwatch({ hex, index, name, rgb, swatch }: BrandColorSwatchProps) {
  const rootRef = useRef<HTMLElement>(null)

  // 화면에 들어와 있는 동안만 돈다 — 아래쪽 섹션이라 항상 돌리면 헛돈다.
  useEffect(() => {
    const root = rootRef.current
    const bands = root?.querySelectorAll('[data-band]')
    if (!root || !bands?.length) return undefined

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(bands, { scaleY: 1 })
      return undefined
    }

    const timeline = gsap.timeline({ paused: true, repeat: -1 })
    timeline
      .fromTo(bands, { scaleY: 0 }, { scaleY: 1, duration: 0.5, ease: 'power2.out', stagger: 0.09 })
      .to(bands, { scaleY: 0, duration: 0.42, ease: 'power2.in', stagger: 0.07 }, '+=1')
      .to({}, { duration: 0.8 })

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) timeline.play()
      else timeline.pause()
    }, { threshold: 0.25 })

    observer.observe(root)
    return () => {
      observer.disconnect()
      timeline.kill()
    }
  }, [])

  return (
    <figure ref={rootRef}>
      <figcaption className="mb-[clamp(0.75rem,1.1vw,1.15rem)] font-mono text-[clamp(0.75rem,0.95vw,0.95rem)] font-semibold tracking-[0.02em] text-[#111]">
        <span className="tabular-nums">{index}</span> <span className="ml-1.5">Primary</span>
      </figcaption>

      <div className="relative aspect-square w-full overflow-hidden" style={{ background: swatch }}>
        {buildRamp(swatch).map((tone, step) => (
          <span
            aria-hidden
            className="absolute inset-x-0 origin-top will-change-transform"
            data-band
            key={tone}
            style={{
              background: tone,
              height: `${100 / RAMP_STEPS}%`,
              top: `${(step / RAMP_STEPS) * 100}%`,
              transform: 'scaleY(0)',
            }}
          />
        ))}
      </div>

      <p className="mt-[clamp(1.25rem,2vw,2rem)] text-[clamp(1.5rem,2.2vw,2.2rem)] font-bold tracking-[-0.02em] text-[#111]">{name}</p>
      <div className="mt-[clamp(0.75rem,1.1vw,1.15rem)] space-y-1 font-mono text-[clamp(0.8rem,0.95vw,0.95rem)] text-[#111]">
        <p>{rgb}</p>
        <p>{hex}</p>
      </div>
    </figure>
  )
}
