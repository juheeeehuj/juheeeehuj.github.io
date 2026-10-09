import type { Locale, Slot } from '@studio/lib/ia'
import { list, text } from '@studio/lib/field'
import Reveal from '../Reveal'

// 페이지 피날레 — 스택형 타이포(book spine) + 딜리버러블 인덱스 + 크레딧.
// 글(스파인·스튜디오·크레딧)은 CMS(refine_credits_1)에서 읽는다.
const displayFont = { fontFamily: 'Montserrat, sans-serif' }

export default function RefineCredits({ data, locale, className = '' }: { data: Slot; locale: Locale; className?: string }) {
  const spine = list(data, 'spine')
  const credits = list(data, 'credits')

  return (
    <section className={`${className} bg-[#fbf6f1] px-6 py-28 md:px-16 md:py-40`}>
      <div className="mx-auto max-w-[1760px]">
        {/* 스택형 타이포 + 인덱스 */}
        <div className="border-t border-[#d8d0c6]">
          {spine.map((s, i) => (
            <Reveal className="border-b border-[#d8d0c6] py-5 md:py-7" key={i}>
              <div className="flex flex-col gap-3 md:grid md:grid-cols-[minmax(0,1fr)_72px_1.1fr_1fr] md:items-center md:gap-8">
                <h2 className="text-[clamp(2rem,5.5vw,4.6rem)] font-light leading-[1.05] tracking-[-0.03em] text-[#1c1c1c]" style={displayFont}>{text(s, 'word', locale)}</h2>
                <div className="flex items-center gap-6 md:contents">
                  <span className="text-sm text-[#8a7f74] md:border-l md:border-[#d8d0c6] md:pl-6" style={displayFont}>{text(s, 'no', locale)}</span>
                  <span className="flex-1 text-xs leading-snug text-[#6e6560] md:border-l md:border-[#d8d0c6] md:pl-6">{text(s, 'mid', locale)}</span>
                  <span className="text-xs font-medium uppercase tracking-[0.16em] text-[#3a332e] md:border-l md:border-[#d8d0c6] md:pl-6" style={displayFont}>{text(s, 'cat', locale)}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* 크레딧 (디렉터 없이 Product Designer) */}
        <div className="mt-16 flex flex-col gap-10 md:mt-24 md:flex-row md:items-start md:justify-between">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#6e6560]" style={displayFont}>{text(data, 'studio', locale)}</p>
          <div className="md:w-[46%]">
            {credits.map((c, i) => (
              <div className="grid grid-cols-[1fr_1fr] gap-x-8 border-t border-[#1c1c1c]/15 pt-6" key={i}>
                <span className="text-sm font-semibold text-[#1c1c1c]" style={displayFont}>{text(c, 'role', locale)}</span>
                <div className="space-y-3.5">
                  {list(c, 'names').map((n, j) => <p className="text-sm text-[#4a4038]" key={j} style={displayFont}>{text(n, 'name', locale)}</p>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
