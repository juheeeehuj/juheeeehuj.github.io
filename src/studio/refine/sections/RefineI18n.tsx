import type { Locale, Slot } from '@studio/lib/ia'
import { image, list, text } from '@studio/lib/field'
import Reveal from '../Reveal'
import SectionHeader from '../SectionHeader'

// i18n — 다양한 국적의 방문객을 고려한 다국어 언어팩. GNB(네비) 목업 + 언어 스위처.
// 글·이미지·언어 목록은 CMS(refine_i18n_1)에서 읽고, 레이아웃은 코드로 유지.
const displayFont = { fontFamily: 'Montserrat, sans-serif' }

export default function RefineI18n({ data, locale, className = '' }: { data: Slot; locale: Locale; className?: string }) {
  const bg = image(data, 'bgImage', locale)
  const nav = image(data, 'navImage', locale)
  const langs = list(data, 'langs')

  return (
    <section className={`${className} relative overflow-hidden bg-[#14100d] px-6 py-24 text-[#f3ece3] md:px-16 md:py-40`}>
      <img aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-[0.35]" loading="lazy" src={bg.src} />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(120deg,rgba(20,16,13,0.94)_0%,rgba(20,16,13,0.72)_60%,rgba(20,16,13,0.5)_100%)]" />

      <div className="relative mx-auto max-w-[1760px]">
        <SectionHeader label={text(data, 'label', locale)} tone="dark">
          {text(data, 'body', locale)}
        </SectionHeader>

        <div className="mt-16 grid items-center gap-12 md:mt-24 md:grid-cols-[minmax(0,300px)_1fr] md:gap-24">
          {/* GNB(네비) 폰 목업 */}
          <Reveal className="mx-auto w-full max-w-[280px]">
            <div className="overflow-hidden rounded-[24px] bg-[#0b0908] p-2.5 shadow-[0_44px_90px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/10">
              <div className="overflow-hidden rounded-[16px] shadow-[inset_0_1px_10px_rgba(0,0,0,0.2)]">
                <img alt={nav.alt || 'Refine Clinic 다국어 네비게이션'} className="block h-auto w-full" loading="lazy" src={nav.src} />
              </div>
            </div>
          </Reveal>

          {/* 언어 스위처 */}
          <Reveal delay={80}>
            <p className="text-[11px] uppercase tracking-[0.24em] text-[#c7b6a4]" style={displayFont}>{text(data, 'langCap', locale)}</p>
            <div className="mt-8 flex flex-col divide-y divide-white/10 border-y border-white/10">
              {langs.map((l, i) => (
                <div className="flex items-center justify-between py-5" key={i}>
                  <span className="text-xl font-light text-[#f3ece3] md:text-2xl">{text(l, 'name', locale)}</span>
                  <span className="text-[11px] uppercase tracking-[0.2em] text-white/40" style={displayFont}>{text(l, 'code', locale)}</span>
                </div>
              ))}
            </div>
            <p className="mt-8 max-w-md text-sm leading-[1.8] text-white/45">{text(data, 'note', locale)}</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
