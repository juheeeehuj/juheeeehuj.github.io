import type { Locale, Slot } from '@studio/lib/ia'
import { image, text } from '@studio/lib/field'
import Reveal from '../Reveal'
import SectionHeader from '../SectionHeader'
import OrbitField from '../OrbitField'

// Sub Pages — 실제 서비스되는 하위 페이지 순회 영상. 배경엔 브랜드 시그니처 궤도 라인(OrbitField)이 영상 뒤로 겹친다.
// 글·주소·영상·포스터는 CMS(refine_subpages_1)에서 읽고, 궤도 라인·브라우저 목업은 코드로 유지.

export default function RefineSubPagesShow({ data, locale, className = '' }: { data: Slot; locale: Locale; className?: string }) {
  const poster = image(data, 'poster', locale)
  const video = text(data, 'video', locale)

  return (
    <section
      className={`${className} relative overflow-hidden px-6 py-28 md:px-16 md:py-44`}
      style={{ background: 'linear-gradient(180deg, rgb(90,81,73) 0%, rgb(79,71,64) 100%)' }}
    >
      {/* 배경 궤도 라인 (시그니처) — 영상 뒤로 겹침 */}
      <OrbitField />

      <div className="relative mx-auto max-w-[1760px]">
        <SectionHeader label={text(data, 'label', locale)} tone="dark">
          {text(data, 'body', locale)}
        </SectionHeader>

        <Reveal className="mt-14 md:mt-20" delay={60}>
          <div className="mx-auto max-w-[1120px] overflow-hidden rounded-[14px] border border-white/10 bg-[#100c09] shadow-[0_60px_150px_-45px_rgba(0,0,0,0.7)]">
            <div className="flex items-center gap-1.5 border-b border-white/8 px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <span className="ml-3 text-[11px] text-white/40" style={{ fontFamily: 'Montserrat, sans-serif' }}>{text(data, 'url', locale)}</span>
            </div>
            <div className="relative aspect-[16/10] overflow-hidden bg-[#100c09]">
              <video
                aria-label="Refine Clinic 하위 페이지 순회"
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
        </Reveal>
      </div>
    </section>
  )
}
