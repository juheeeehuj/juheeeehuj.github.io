type SpanCellProps = {
  children?: React.ReactNode
  className?: string
  featured?: boolean
}

export function SpanCell({ children, className = '', featured = false }: SpanCellProps) {
  return (
    <div className={`${featured ? 'lg:col-span-2' : ''} min-h-0 overflow-hidden ${className}`}>
      {children}
    </div>
  )
}

const COLUMN_CLASSES = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
}

// 첫 칸에 16:9 미디어가 들어갈 때 쓴다. 균등 2열은 칸이 16:9보다 세로로 길어서
// object-cover 가 좌우를 잘라낸다(슬로건 이미지의 문구가 실제로 잘렸다).
// 1.4:1 이면 첫 칸이 정확히 16:9가 된다 — 셸 패딩(5.2vw)과 미디어 높이(29vw)가
// 둘 다 뷰포트 비례라 이 비율은 화면 크기와 무관하게 성립한다.
const WIDE_FIRST_CLASS = 'grid-cols-1 sm:grid-cols-[1.4fr_1fr]'

type SpanGridProps = {
  children?: React.ReactNode
  columns?: keyof typeof COLUMN_CLASSES
  /** 2열에서 첫 칸을 넓게(1.4:1). columns={2} 와 함께 쓴다. */
  wideFirst?: boolean
  className?: string
}

export default function SpanGrid({ children, columns = 3, wideFirst = false, className = '' }: SpanGridProps) {
  const columnClass = wideFirst ? WIDE_FIRST_CLASS : (COLUMN_CLASSES[columns] ?? COLUMN_CLASSES[3])
  return <div className={`grid gap-[clamp(0.75rem,1vw,1.25rem)] ${columnClass} ${className}`}>{children}</div>
}
