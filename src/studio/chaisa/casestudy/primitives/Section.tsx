import type { ReactNode } from 'react'

type SectionTheme = 'light' | 'paper' | 'dark' | 'blue'

// 섹션 배경/글자 테마. 유채색은 블루 하나만(브랜드 규칙), 나머지는 뉴트럴.
const THEME: Record<SectionTheme, string> = {
  light: 'bg-white text-chaisa-ink',
  paper: 'bg-chaisa-paper text-chaisa-ink',
  dark: 'bg-chaisa-ink text-white',
  blue: 'bg-chaisa-blue text-white',
}

type SectionProps = {
  id?: string
  theme?: SectionTheme
  /** 이미지 풀블리드 섹션용 — 세로 패딩을 없애 미디어가 엣지까지 닿게 한다. */
  flush?: boolean
  className?: string
  children: ReactNode
}

/**
 * 차이사 섹션 캔버스. 항상 풀블리드(폭 제약 없음) + 세로 리듬만 통일한다.
 * 폭을 1440px 로 가둬야 하는 텍스트/구성 콘텐츠는 내부에서 <Container>로 감싼다.
 * 이미지 풀블리드 섹션은 flush 로 세로 패딩까지 없앤다.
 * (사용자 확정 규칙: 히어로·이미지 = 풀블리드 / 텍스트 = max-w-[1440px])
 */
export default function Section({ id, theme = 'light', flush = false, className = '', children }: SectionProps) {
  return (
    <section
      id={id}
      className={`relative w-full ${flush ? '' : 'py-[clamp(4.5rem,9vw,10rem)]'} ${THEME[theme]} ${className}`}
    >
      {children}
    </section>
  )
}
