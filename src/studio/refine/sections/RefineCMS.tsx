import type { Locale, Slot } from '@studio/lib/ia'
import { image, list, text } from '@studio/lib/field'
import Reveal from '../Reveal'
import SectionHeader from '../SectionHeader'

// Custom CMS — 브랜드 전용 관리자 페이지(직접 편집·발행) 쇼케이스.
// 글·주소·스크린샷·핵심기능은 CMS(refine_cms_1)에서 읽고, 브라우저 목업은 코드로 유지.
const displayFont = { fontFamily: 'Montserrat, sans-serif' }

export default function RefineCMS({ data, locale, className = '' }: { data: Slot; locale: Locale; className?: string }) {
  const shot = image(data, 'image', locale)
  const features = list(data, 'features')

  return (
    <section className={`${className} bg-[#fcfbf9] px-6 py-24 md:px-16 md:py-40`}>
      <div className="mx-auto max-w-[1760px]">
        <SectionHeader label={text(data, 'label', locale)} title={text(data, 'title', locale)}>
          {text(data, 'body', locale)}
        </SectionHeader>

        {/* 브라우저 목업 + 어드민 스크린샷 */}
        <Reveal className="mt-16 md:mt-24" delay={60}>
          <div className="mx-auto max-w-[1440px] overflow-hidden rounded-[14px] border border-[#e4ded5] shadow-[0_50px_120px_-40px_rgba(30,22,16,0.5)]">
            <div className="flex items-center gap-2 border-b border-[#e8e4de] bg-[#f1ece5] px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-[#e0c9b8]" />
              <span className="h-3 w-3 rounded-full bg-[#d8cdbd]" />
              <span className="h-3 w-3 rounded-full bg-[#ccbfae]" />
              <span className="ml-4 rounded-[6px] bg-white px-3 py-1 text-[11px] text-[#8a7f74]" style={displayFont}>{text(data, 'url', locale)}</span>
            </div>
            <img alt={shot.alt || 'Refine Clinic 관리자 CMS'} className="block h-auto w-full" loading="lazy" src={shot.src} />
          </div>
        </Reveal>

        {/* 핵심 기능 3-up */}
        <div className="mt-14 grid gap-8 md:mt-20 md:grid-cols-3 md:gap-12">
          {features.map((f, i) => (
            <Reveal className="border-t border-[#d8d0c6] pt-6" delay={i * 70} key={i}>
              <span className="text-sm text-[#b8a99a]" style={displayFont}>{text(f, 'no', locale)}</span>
              <h3 className="mt-3 text-lg font-medium tracking-[-0.01em] text-[#3a332e] md:text-xl">{text(f, 't', locale)}</h3>
              <p className="mt-3 max-w-xs text-sm leading-[1.8] text-[#6e6560]">{text(f, 'd', locale)}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
