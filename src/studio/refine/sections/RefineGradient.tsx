import type { Locale, Slot } from '@studio/lib/ia'
import { image, list, text } from '@studio/lib/field'
import Reveal from '../Reveal'
import SectionHeader from '../SectionHeader'

// BRAND GRADIENT — 작은 정사각 이미지가 5열×3행으로 여백 많게 흩뿌려지고, 행마다 컬러 패밀리 라벨.
// 글(라벨·본문·패밀리명)·이미지는 CMS(refine_gradient_1)에서 읽고, 스태거·듀오톤 색은 코드로 유지.
const displayFont = { fontFamily: 'Montserrat, sans-serif' }

const STAGGER = ['0rem', '2.2rem', '-1.2rem', '2.8rem', '0.9rem']

// 라벨이 붙는 열(레이아웃 고정). 색(계열 톤·라벨 스와치)은 CMS(refine_gradient_1.rows[i].swatch)에서.
const LABEL_COL = [1, 2, 3]
const FALLBACK_SWATCH = ['#f2e7da', '#b8a99a', '#201814']

function Tile({ src, tone }: { src: string; tone: string }) {
  return (
    <div className="group relative isolate aspect-square w-[62%] max-w-[128px] overflow-hidden rounded-[4px] transition-transform duration-500 ease-out hover:-translate-y-1.5" style={{ background: tone }}>
      <img
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-[0.62] mix-blend-luminosity transition-all duration-700 ease-out group-hover:scale-[1.06] group-hover:opacity-100 group-hover:mix-blend-normal"
        loading="lazy"
        src={src}
      />
    </div>
  )
}

export default function RefineGradient({ data, locale, className = '' }: { data: Slot; locale: Locale; className?: string }) {
  const rows = list(data, 'rows')

  return (
    <section className={`${className} bg-white px-6 py-24 md:px-16 md:py-40`}>
      <div className="mx-auto max-w-[1760px]">
        <SectionHeader label={text(data, 'label', locale)}>
          {text(data, 'body', locale)}
        </SectionHeader>

        <div className="mt-24 space-y-24 md:mt-32 md:space-y-40">
          {rows.map((row, ri) => {
            const swatch = text(row, 'swatch', locale) || FALLBACK_SWATCH[ri] || '#b8a99a'
            const labelCol = LABEL_COL[ri] ?? 1
            const tiles = list(row, 'images')
            return (
              <Reveal className="grid grid-cols-5 gap-x-4" delay={ri * 60} key={ri}>
                {tiles.map((tile, ci) => (
                  <div className="flex flex-col items-start" key={ci} style={{ marginTop: STAGGER[ci] }}>
                    <Tile src={image(tile, 'image', locale).src} tone={swatch} />
                    {ci === labelCol ? (
                      <div className="mt-4 flex items-center gap-2">
                        <span className="h-3.5 w-3.5 flex-none rounded-[3px] ring-1 ring-black/10" style={{ background: swatch }} />
                        <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#3a332e]" style={displayFont}>{text(row, 'name', locale)}</span>
                      </div>
                    ) : null}
                  </div>
                ))}
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
