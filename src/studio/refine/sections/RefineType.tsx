import type { Locale, Slot } from '@studio/lib/ia'
import { list, text } from '@studio/lib/field'
import Reveal from '../Reveal'
import SectionHeader from '../SectionHeader'

// Typography — WITIM typo 템플릿처럼 서체·웨이트를 CMS(refine_type_1)에서 '각각 추가 가능'하게 읽는다.
// 서체명 큰 견본 + 웨이트별 예시(폰트 열 정렬). 레이아웃만 코드.
const displayFont = { fontFamily: 'Montserrat, sans-serif' }

export default function RefineType({ data, locale, className = '' }: { data: Slot; locale: Locale; className?: string }) {
  const fonts = list(data, 'fonts')
  const weights = list(data, 'weights')
  const nf = Math.max(fonts.length, 1)
  const famOf = (j: number) => text(fonts[j] ?? {}, 'family', locale) || 'Pretendard, sans-serif'
  // 웨이트 행 그리드: [라벨 | 폰트열…]. 서체 개수에 맞춰 열 자동 생성.
  const weightCols = { gridTemplateColumns: `140px repeat(${nf}, minmax(0,1fr))` }

  return (
    <section className={`${className} bg-white px-6 py-24 md:px-16 md:py-40`}>
      <div className="mx-auto max-w-[1760px]">
        <SectionHeader label={text(data, 'label', locale)} />

        {/* 서체 큰 견본 — 추가 가능(refine_type_1.fonts) */}
        <div className="mt-16 grid gap-14 md:mt-24 md:gap-16" style={{ gridTemplateColumns: `repeat(${nf}, minmax(0,1fr))` }}>
          {fonts.map((f, j) => (
            <Reveal delay={j * 70} key={j}>
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#b8a99a]" style={displayFont}>{text(f, 'cap', locale)}</p>
              <p className="mt-6 text-[clamp(3rem,7vw,6.5rem)] font-bold leading-[0.98] tracking-[-0.03em] text-[#201814]" style={{ fontFamily: famOf(j) }}>{text(f, 'name', locale)}</p>
            </Reveal>
          ))}
        </div>

        {/* 웨이트 견본 — 추가 가능(refine_type_1.weights), 폰트별 예시 열 정렬 */}
        <div className="mt-20 border-t border-[#e8e4de] md:mt-28">
          {weights.map((wt, i) => {
            const w = parseInt(text(wt, 'weight', locale), 10) || 400
            const samples = list(wt, 'samples')
            return (
              <Reveal className="border-b border-[#e8e4de] py-10 md:py-12" delay={i * 70} key={i}>
                <div className="grid gap-6 md:gap-10" style={weightCols}>
                  <p className="text-xs uppercase tracking-[0.16em] text-[#6e6560]" style={displayFont}>{text(wt, 'name', locale)}</p>
                  {fonts.map((_, j) => {
                    const s = samples[j] ?? {}
                    return (
                      <div key={j}>
                        <p className="text-[clamp(1.6rem,3vw,2.6rem)] leading-tight tracking-[-0.02em] text-[#201814]" style={{ fontFamily: famOf(j), fontWeight: w }}>{text(s, 'sample', locale)}</p>
                        <p className="mt-3 text-xs text-[#6e6560] md:text-sm" style={{ fontFamily: famOf(j), fontWeight: w }}>{text(s, 'sub', locale)}</p>
                      </div>
                    )
                  })}
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
