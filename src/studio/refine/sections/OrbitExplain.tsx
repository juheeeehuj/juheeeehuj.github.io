import type { Locale, Slot } from '@studio/lib/ia'
import { list, text } from '@studio/lib/field'
import Reveal from '../Reveal'
import SectionHeader from '../SectionHeader'

// 궤도 라인(브랜드 시그니처)의 구성 원리를 그리드 위 스키매틱 다이어그램으로 설명.
// 글(방향성 라벨·본문·3카드 캡션/설명)은 CMS(refine_signature_1)에서 읽고, 도식 SVG는 코드로 유지.
const displayFont = { fontFamily: 'Montserrat, sans-serif' }

const gridBg: React.CSSProperties = {
  backgroundColor: '#fcfbf9',
  backgroundImage:
    'linear-gradient(rgba(184,169,154,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(184,169,154,0.18) 1px, transparent 1px)',
  backgroundSize: '24px 24px',
}

const STROKE = '#3a332e'
const ACCENT = '#b8a99a'

function SymbolDiagram() {
  return (
    <svg viewBox="0 0 200 200" fill="none" className="h-full w-full">
      <g stroke={STROKE} strokeWidth="1.1">
        <circle cx="100" cy="100" r="52" />
        <line x1="100" y1="100" x2="152" y2="100" />
      </g>
      <circle cx="100" cy="100" r="2.6" fill={STROKE} />
      <circle cx="152" cy="100" r="3.4" fill={ACCENT} />
    </svg>
  )
}

function OrbitDiagram() {
  return (
    <svg viewBox="0 0 200 200" fill="none" className="h-full w-full">
      <g stroke={STROKE} strokeWidth="1.1">
        <ellipse cx="100" cy="100" rx="72" ry="34" transform="rotate(-18 100 100)" />
        <ellipse cx="100" cy="100" rx="64" ry="46" transform="rotate(26 100 100)" />
        <ellipse cx="100" cy="100" rx="44" ry="60" transform="rotate(-44 100 100)" />
      </g>
    </svg>
  )
}

function MotionDiagram() {
  return (
    <svg viewBox="0 0 200 200" fill="none" className="h-full w-full">
      <g transform="rotate(-14 100 100)">
        <ellipse cx="100" cy="100" rx="72" ry="40" stroke={STROKE} strokeWidth="1.1" />
        <circle cx="172" cy="100" r="4" fill={STROKE} />
        <circle cx="100" cy="60" r="3.2" fill={ACCENT} />
        <path d="M150 68 a72 40 0 0 1 20 26" stroke={ACCENT} strokeWidth="1.1" strokeDasharray="2 4" />
      </g>
    </svg>
  )
}

// 3개 카드의 도식(디자인 고정) — 글(캡션·설명)은 CMS cards[i] 에서.
const DIAGRAMS = [SymbolDiagram, OrbitDiagram, MotionDiagram]

export default function OrbitExplain({ data, locale }: { data: Slot; locale: Locale }) {
  const cards = list(data, 'cards')

  return (
    <div>
      <SectionHeader bodyMaxW="max-w-none" label={text(data, 'directionLabel', locale)}>
        {text(data, 'direction', locale)}
      </SectionHeader>

      <div className="mt-14 grid gap-5 md:grid-cols-3 md:gap-8">
        {cards.map((card, i) => {
          const Diagram = DIAGRAMS[i] ?? SymbolDiagram
          return (
            <Reveal delay={i * 80} key={i}>
              <div className="aspect-[4/3] overflow-hidden rounded-[8px] border border-[#e8e4de]" style={gridBg}>
                <div className="flex h-full w-full items-center justify-center p-10">
                  <div className="h-full max-h-[180px] w-full max-w-[180px]"><Diagram /></div>
                </div>
              </div>
              <p className="mt-6 text-xl font-light tracking-[-0.01em] md:text-2xl">{text(card, 'caption', locale)}</p>
              <p className="mt-2 max-w-xs text-sm leading-[1.8] text-[#6e6560]">{text(card, 'desc', locale)}</p>
              <p className="mt-4 text-[10px] uppercase tracking-[0.24em] text-[#b8a99a]" style={displayFont}>{text(card, 'tag', locale)}</p>
            </Reveal>
          )
        })}
      </div>
    </div>
  )
}
