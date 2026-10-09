import type { Locale, Slot } from '@studio/lib/ia'
import { list, text } from '@studio/lib/field'
import Reveal from '../Reveal'
import SectionHeader from '../SectionHeader'
import ColorSpectrum from './ColorSpectrum'

// UI ELEMENTS — 브랜드 톤 시스템을 그라디언트 트랙 + 스와치 스펙트럼으로 제시.
// 트랙 라벨·팔레트 색은 CMS(refine_ui_1)에서 읽어 '각각 추가 가능'. 위치·애니메이션만 코드.

export default function RefineUIElements({ data, locale, className = '' }: { data: Slot; locale: Locale; className?: string }) {
  const track = list(data, 'track')
  const palette = list(data, 'palette')
  const n = track.length
  // 트랙 포인트 위치 — 개수에 따라 0%~100% 균등 분배(항목 추가 시 자동). 마지막 점은 채움.
  const pos = (i: number) => (n <= 1 ? '0%' : `${(i / (n - 1)) * 100}%`)

  return (
    <section className={`${className} bg-white px-6 py-24 md:px-16 md:py-40`}>
      <div className="mx-auto max-w-[1760px]">
        <SectionHeader label={text(data, 'label', locale)}>
          {text(data, 'body', locale)}
        </SectionHeader>

        {/* 톤 트랙 — 라벨 추가 가능(refine_ui_1.track) */}
        <Reveal className="relative mt-24 md:mt-32" delay={40}>
          <div className="relative h-px w-full bg-[#201814]">
            {track.map((_, i) => (
              <span
                className={`absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 ${i === n - 1 ? 'bg-[#201814]' : 'border border-[#201814] bg-white'}`}
                key={i}
                style={{ left: pos(i) }}
              />
            ))}
          </div>
          <div className="relative mt-5 h-4">
            {track.map((t, i) => (
              <span
                className="absolute text-[10px] font-medium uppercase tracking-[0.16em] text-[#3a332e] md:text-[11px]"
                key={i}
                style={{ left: pos(i), transform: i === n - 1 ? 'translateX(-100%)' : i === 0 ? 'none' : 'translateX(-50%)' }}
              >
                {text(t, 'label', locale)}
              </span>
            ))}
          </div>
        </Reveal>

        {/* 스와치 스펙트럼 — 색 추가 가능(refine_ui_1.palette), 왼쪽부터 순차 등장 */}
        <ColorSpectrum locale={locale} palette={palette} />
      </div>
    </section>
  )
}
