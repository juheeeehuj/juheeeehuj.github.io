import type { Locale, Slot } from '@studio/lib/ia'
import { image, list, text } from '@studio/lib/field'
import Reveal from '../Reveal'
import SectionHeader from '../SectionHeader'

// SOLUTION CONTENTS — 상품 나열이 아닌, 일상과 연결된 편집형 콘텐츠 전략.
// 글(라벨·본문)·이미지 6컷은 CMS(refine_solution_1)에서 읽고, 편집형 그리드 배치는 코드로 유지.

// 6컷의 편집형 그리드 슬롯(디자인 고정) — wrap: 셀 래퍼 클래스, ratio: 이미지 비율, deco: 장식(빈 alt)
const SLOTS = [
  { wrap: 'col-span-12', ratio: 'aspect-[16/9] md:aspect-[16/7]', delay: 0, deco: false },
  { wrap: 'col-span-6', ratio: 'aspect-[4/5]', delay: 60, deco: false },
  { wrap: 'col-span-6', ratio: 'aspect-[4/5]', delay: 90, deco: false },
  { wrap: 'col-span-6 md:col-span-4', ratio: 'aspect-square', delay: 120, deco: true },
  { wrap: 'col-span-6 md:col-span-4', ratio: 'aspect-square', delay: 150, deco: true },
  { wrap: 'col-span-12 md:col-span-4', ratio: 'aspect-square', delay: 180, deco: true },
]

export default function RefineSolution({ data, locale, className = '' }: { data: Slot; locale: Locale; className?: string }) {
  const imgs = list(data, 'images')

  return (
    <section className={`${className} bg-[#fcfbf9] px-6 py-24 md:px-16 md:py-40`}>
      <div className="mx-auto max-w-[1760px]">
        <SectionHeader label={text(data, 'label', locale)}>
          {text(data, 'body', locale)}
        </SectionHeader>

        {/* 편집형 이미지 그리드 — 브랜드 공간·디테일 */}
        <div className="mt-16 grid grid-cols-12 gap-3 md:mt-24 md:gap-5">
          {SLOTS.map((slot, i) => {
            const img = image(imgs[i] ?? {}, 'image', locale)
            return (
              <Reveal className={`group ${slot.wrap} overflow-hidden rounded-[6px]`} delay={slot.delay} key={i}>
                <img
                  alt={slot.deco ? '' : img.alt}
                  aria-hidden={slot.deco || undefined}
                  className={`${slot.ratio} h-full w-full object-cover object-center transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.045]`}
                  loading="lazy"
                  src={img.src}
                />
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
