import type { Locale, Slot } from '@studio/lib/ia'
import { image, list, text } from '@studio/lib/field'
import Reveal from '../Reveal'
import SectionHeader from '../SectionHeader'

// Moodboard(비주얼 디렉션) — 개별 무드 이미지가 넓은 여백에 흩어지고 키워드 라벨이 붙는 에디토리얼 스캐터.
// 글·이미지는 CMS(refine_moodboard_1)에서 읽고, 스캐터 배치·점 색은 디자인이므로 코드로 유지.
const displayFont = { fontFamily: 'Montserrat, sans-serif' }

// color: 각 키워드 옆 무드 이미지의 톤에서 뽑은 색 — 점이 인접 이미지 무드와 어울리게.
function Tag({ text, color = '#201814', className = '' }: { text: string; color?: string; className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="h-2.5 w-2.5 flex-none" style={{ backgroundColor: color }} />
      <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#3a332e]" style={displayFont}>{text}</span>
    </div>
  )
}

function Figure({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return (
    <figure className={`group overflow-hidden rounded-[4px] ${className}`}>
      <img
        alt={alt || 'Refine 브랜드 무드 이미지'}
        className="block h-auto w-full origin-center scale-100 transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.045]"
        loading="lazy"
        src={src}
      />
    </figure>
  )
}

// 4개 키워드 점 색 — 인접 이미지 무드와 어울리는 톤(디자인 고정)
const TAG_COLORS = ['#a1968a', '#837970', '#6f5e51', '#3a332e']

export default function RefineMoodboard({ data, locale, className = '' }: { data: Slot; locale: Locale; className?: string }) {
  const imgs = list(data, 'images')
  const tags = list(data, 'tags')
  const fig = (i: number) => image(imgs[i] ?? {}, 'image', locale)
  const tag = (i: number) => text(tags[i] ?? {}, 'text', locale)

  return (
    <section className={`${className} bg-white px-6 py-24 md:px-16 md:py-40`}>
      <div className="mx-auto max-w-[1760px]">
        <SectionHeader label={text(data, 'label', locale)} title={text(data, 'title', locale)} />

        {/* 에디토리얼 스캐터: 큰 무드 이미지 + 키워드 라벨, 넓은 여백 */}
        <Reveal className="relative mt-20 grid grid-cols-12 items-start gap-x-6 gap-y-14 md:mt-28 md:gap-y-0" delay={60}>
          {/* A — 브랜드 키비주얼(로고+웨이브) (top-left, 대형) */}
          <Figure alt={fig(0).alt} className="col-span-10 md:col-span-6 md:col-start-1 md:row-start-1" src={fig(0).src} />
          {/* Light 라벨 (top-right) */}
          <Tag className="col-span-6 self-center md:col-span-2 md:col-start-10 md:row-start-1 md:mt-24" color={TAG_COLORS[0]} text={tag(0)} />

          {/* Skin 라벨 (mid-left) */}
          <Tag className="col-span-6 md:col-span-2 md:col-start-2 md:row-start-2 md:mt-12" color={TAG_COLORS[1]} text={tag(1)} />
          {/* B — 물방울/피부 (mid-right) */}
          <Figure alt={fig(1).alt} className="col-span-8 col-start-5 md:col-span-4 md:col-start-8 md:row-start-2 md:mt-4" src={fig(1).src} />

          {/* Nature 라벨 (bottom-left) */}
          <Tag className="col-span-6 md:col-span-2 md:col-start-2 md:row-start-3 md:mt-28" color={TAG_COLORS[2]} text={tag(2)} />
          {/* C — 포트레이트 (bottom-center, 대형) */}
          <Figure alt={fig(2).alt} className="col-span-9 col-start-3 md:col-span-4 md:col-start-5 md:row-start-3 md:mt-12" src={fig(2).src} />
          {/* Material 라벨 (bottom-right) */}
          <Tag className="col-span-6 md:col-span-2 md:col-start-11 md:row-start-3 md:mt-24" color={TAG_COLORS[3]} text={tag(3)} />
        </Reveal>
      </div>
    </section>
  )
}
