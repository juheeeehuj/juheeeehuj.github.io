'use client'

import { useEffect, useRef, useState } from 'react'
import type { Locale, Slot } from '@studio/lib/ia'
import { text } from '@studio/lib/field'

// 스와치 스펙트럼 — 뷰포트 진입 시 왼쪽부터 순차로 촤라락 wipe-in.
// 팔레트(색·라벨·폭)는 CMS(refine_ui_1.palette)에서 읽어 '추가 가능'하다. 애니메이션만 코드.
const displayFont = { fontFamily: 'Montserrat, sans-serif' }

// 밝은 색(흰 배경에 묻힘)엔 옅은 테두리를 준다.
function isLight(hex: string): boolean {
  const m = hex.replace('#', '')
  if (m.length < 6) return true
  const r = parseInt(m.slice(0, 2), 16)
  const g = parseInt(m.slice(2, 4), 16)
  const b = parseInt(m.slice(4, 6), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.82
}

export default function ColorSpectrum({ palette, locale }: { palette: Slot[]; locale: Locale }) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true)
      return undefined
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // i번째 스와치: 왼쪽 기준 scaleX 0→1, 인덱스별 딜레이로 순차 등장
  const swatchStyle = (i: number): React.CSSProperties => ({
    transform: shown ? 'scaleX(1)' : 'scaleX(0)',
    transformOrigin: 'left',
    transition: 'transform 0.62s cubic-bezier(0.22,1,0.36,1)',
    transitionDelay: `${i * 65}ms`,
    willChange: 'transform',
  })

  const anchors = palette.filter((it) => text(it, 'name', locale).trim())

  return (
    <div>
      {/* 스펙트럼 바 — 팔레트 항목마다 flex 폭으로 배치 */}
      <div className="mt-16 flex h-[220px] items-stretch gap-2 md:mt-24 md:h-[320px]" ref={ref}>
        {palette.map((it, i) => {
          const color = text(it, 'swatch', locale) || '#e8e4de'
          const flex = parseFloat(text(it, 'flex', locale)) || 1
          return (
            <div className="overflow-hidden" key={i} style={{ flexGrow: flex, flexBasis: 0 }}>
              <div
                className={`h-full w-full ${isLight(color) ? 'border border-[#e8e4de]' : ''}`}
                style={{ background: color, ...swatchStyle(i) }}
              />
            </div>
          )
        })}
      </div>

      {/* 앵커 컬러 라벨 — name 이 있는 스와치만 (균등 배치) */}
      {anchors.length > 0 ? (
        <div className="mt-6 flex justify-between">
          {anchors.map((it, i) => (
            <div key={i}>
              <p className="text-sm font-medium capitalize md:text-base" style={displayFont}>{text(it, 'name', locale)}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.06em] text-[#6e6560] md:text-[11px]" style={displayFont}>{(text(it, 'swatch', locale) || '').toUpperCase()}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
