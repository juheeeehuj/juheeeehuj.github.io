import Reveal from './Reveal'

// 섹션 헤더 공통 규칙 — 영문 라벨(좌 280px 고정) + 한글 타이틀 + 한글 본문(우), TOP 정렬.
// 전 섹션이 이 컴포넌트를 써서 라벨 위치·폭·타이포·정렬을 한 규칙으로 통일한다.
const displayFont = { fontFamily: 'Montserrat, sans-serif' }

const TONE = {
  light: { label: 'text-[#b8a99a]', title: 'text-[#504945]', body: 'text-[#6e6560]' },
  dark: { label: 'text-[#c7b6a4]', title: 'text-[#f3ece3]', body: 'text-white/70' },
} as const

type SectionHeaderProps = {
  label: string
  title?: string
  children?: React.ReactNode
  tone?: keyof typeof TONE
  delay?: number
  className?: string
  bodyMaxW?: string
}

export default function SectionHeader({ label, title, children, tone = 'light', delay = 0, className = '', bodyMaxW = 'max-w-[54rem]' }: SectionHeaderProps) {
  const c = TONE[tone]
  return (
    <Reveal className={`grid gap-y-6 md:grid-cols-[280px_minmax(0,1fr)] md:gap-x-16 ${className}`} delay={delay}>
      <p className={`text-[11px] font-medium uppercase tracking-[0.24em] md:text-xs ${c.label}`} style={displayFont}>{label}</p>
      <div>
        {title ? <h2 className={`whitespace-pre-line text-[clamp(2rem,3.6vw,3.8rem)] font-light leading-[1.14] tracking-[-0.045em] ${c.title}`}>{title}</h2> : null}
        {children ? <div className={`${bodyMaxW} text-[15px] leading-[1.95] md:text-base ${c.body} ${title ? 'mt-7' : ''}`}>{children}</div> : null}
      </div>
    </Reveal>
  )
}
