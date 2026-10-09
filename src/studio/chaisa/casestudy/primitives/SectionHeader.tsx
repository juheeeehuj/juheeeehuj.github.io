import type { ReactNode } from 'react'

import Reveal from '../../primitives/Reveal'

type SectionHeaderProps = {
  number?: string
  /** 짧은 영문 라벨 (섹션 분류) */
  eyebrow?: string
  title: string
  intro?: ReactNode
  theme?: 'light' | 'dark'
  className?: string
}

/**
 * 리파인 SectionHeader 의 [라벨 | 본문] 2단 구조를 차이사에 맞춰 각색.
 *   좌(고정 220px): 넘버 + eyebrow
 *   우(유동):       타이틀 + 인트로
 * 모바일에서는 세로로 쌓인다.
 */
export default function SectionHeader({ number, eyebrow, title, intro, theme = 'light', className = '' }: SectionHeaderProps) {
  const muted = theme === 'dark' ? 'text-white/60' : 'text-chaisa-muted'
  const accent = theme === 'dark' ? 'text-white/50' : 'text-chaisa-blue'

  return (
    <Reveal className={`grid gap-y-6 md:grid-cols-[220px_minmax(0,1fr)] md:gap-x-14 ${className}`}>
      <div className="flex items-baseline gap-3">
        {number ? <span className={`font-mono text-sm tabular-nums ${accent}`}>{number}</span> : null}
        {eyebrow ? <span className={`text-[11px] font-medium uppercase tracking-[0.22em] ${muted}`}>{eyebrow}</span> : null}
      </div>
      <div>
        <h2 className="text-balance text-[clamp(1.75rem,3.2vw,3rem)] font-semibold leading-[1.12] tracking-[-0.03em]">
          {title}
        </h2>
        {intro ? <p className={`mt-5 max-w-[54ch] text-base leading-relaxed md:text-lg ${muted}`}>{intro}</p> : null}
      </div>
    </Reveal>
  )
}
