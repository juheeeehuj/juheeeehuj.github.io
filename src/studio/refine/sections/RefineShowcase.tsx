import type { Locale, Slot } from '@studio/lib/ia'
import { image, text } from '@studio/lib/field'
import Reveal from '../Reveal'
import SectionHeader from '../SectionHeader'

// WEBSITE SHOWCASE — PC 모니터 목업 + 웹사이트 스크롤 영상, 우측 하단에 모바일 폰 목업.
// 글(라벨·리드)·이미지(포스터·모바일)·영상 경로는 CMS(refine_showcase_1)에서 읽고, 목업 프레임은 코드로 유지.

export default function RefineShowcase({ data, locale, className = '' }: { data: Slot; locale: Locale; className?: string }) {
  const poster = image(data, 'poster', locale)
  const mobile = image(data, 'mobile', locale)
  const video = text(data, 'video', locale)

  return (
    <section className={`${className} relative overflow-hidden bg-[#201814] px-6 py-28 text-[#f3ece3] md:px-16 md:py-44`}>
      <div className="mx-auto max-w-[1400px]">
        <SectionHeader label={text(data, 'label', locale)} tone="dark">
          {text(data, 'lead', locale)}
        </SectionHeader>

        {/* PC 모니터 목업 + 웹사이트 스크롤 영상 */}
        <Reveal className="mt-16 md:mt-24" delay={60}>
          <div className="relative mx-auto w-full max-w-[1280px]">
            <div className="overflow-hidden rounded-[16px] border-[12px] border-[#100c09] bg-[#100c09] shadow-[0_60px_150px_-40px_rgba(0,0,0,0.85)]">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[4px] bg-[#fbf6f1]">
                <video
                  aria-label="Refine Clinic 웹사이트 스크롤"
                  autoPlay
                  className="absolute inset-0 h-full w-full object-cover"
                  loop
                  muted
                  playsInline
                  poster={poster.src}
                  src={video}
                />
              </div>
            </div>
            {/* 스탠드 */}
            <div className="mx-auto h-10 w-[8%] bg-gradient-to-b from-[#1b1510] to-[#0f0b08]" />
            <div className="mx-auto h-3 w-[24%] rounded-b-[10px] rounded-t-[2px] bg-[#100c09] shadow-[0_18px_30px_-10px_rgba(0,0,0,0.7)]" />

            {/* 모바일 폰 목업 (반응형) — 우측 하단 오버랩 */}
            <div className="absolute -bottom-4 right-0 w-[24%] max-w-[188px] sm:right-[-1%] md:-bottom-10">
              <div className="overflow-hidden rounded-[26px] border-[6px] border-[#0b0908] bg-[#0b0908] shadow-[0_36px_80px_-22px_rgba(0,0,0,0.9)]">
                <div className="relative aspect-[9/19] overflow-hidden rounded-[20px] bg-[#fbf6f1]">
                  <img alt={mobile.alt || 'Refine Clinic 모바일 화면'} className="absolute inset-0 h-full w-full object-cover object-top" loading="lazy" src={mobile.src} />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
