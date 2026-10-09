import Reveal from '@studio/witim/Reveal'
import GridShell from '@studio/witim/grid/GridShell'
import { image, list, text } from '@studio/lib/field'
import type { Locale, Slot } from '@studio/lib/ia'

// 4열. 설계도가 왼쪽 절반(2열)을 쓰고, 오른쪽에 부분 도면 두 장이 한 칸씩 붙는다.
// 도면만 늘어놓으면 "그래서 무슨 규칙인가"가 안 남는다 — 각 판에 주석을 달아
// 치수를 읽게 한다. 형태가 왜 이 브랜드인지는 섹션 리드에서 이미 말한다.
// col-start 는 리터럴이어야 Tailwind 가 빌드 때 클래스를 만든다 — 문자열 조합 금지
// 오른쪽 두 판의 격자 위치 — 연출이라 코드에 남긴다. 소재는 JSON plates[1..2].
const SIDE_CELL = ['md:col-start-3 md:row-start-1', 'md:col-start-4 md:row-start-1']

// 칸은 정사각. 설계도는 2열을 차지하니 그 자체로 큰 판이 된다.
const PLATE_CELL = 'aspect-square'


function ConstructionNote({ className = '', locale, note }: { className?: string; locale: Locale; note: Slot }) {

  return (
    <div className={className}>
      <h4 className="text-[clamp(1.1rem,1.45vw,1.45rem)] font-bold tracking-[-0.01em]">
        {text(note, 'mark', locale)}. {text(note, 'title', locale)}
      </h4>
      <ul className="mt-[clamp(0.5rem,0.75vw,0.8rem)] space-y-1.5 text-[clamp(0.95rem,1.1vw,1.1rem)] leading-relaxed text-white/50">
        {list(note, 'rules').map((rule, index) => (
          <li key={index}>{text(rule, 'line', locale)}</li>
        ))}
      </ul>
    </div>
  )
}

// 값은 content/witim.json 에서 오고 여기엔 구조만 남는다(IA §1).
type SystemSequenceProps = {
  locale: Locale
  sec: Slot
}

export default function SystemSequence({ locale, sec }: SystemSequenceProps) {
  // 판마다 자기 주석을 붙여야 하니 기호(A·B·C)로 꺼내 쓴다
  const notes = Object.fromEntries(
    list(sec, 'notes').map((note) => [text(note, 'mark', locale), note]),
  ) as Record<string, Slot>
  const plates = list(sec, 'plates')
  const logoGrid = image(sec, 'logoGrid', locale)
  const poster = image(sec, 'outdoorPoster', locale)
  const banner = image(sec, 'outdoorBanner', locale)

  return (
    <>
      <GridShell>
        {/* 다른 섹션과 같은 제목 구조 — 구분선 아래 왼쪽 라벨 + 오른쪽 헤드라인 2단 */}
        <div className="grid gap-x-[6vw] gap-y-6 border-t border-black/80 pt-[clamp(1.5rem,2vw,2.5rem)] pb-[clamp(2rem,3vw,3.5rem)] md:grid-cols-2">
          <Reveal><h2 className="text-[clamp(1.15rem,1.6vw,1.6rem)] font-bold tracking-[-0.02em]">{text(sec, 'logoKicker', locale)}</h2></Reveal>
          <Reveal delay={70}>
            <h3 className="text-[clamp(1.5rem,2.4vw,2.4rem)] font-bold leading-[1.15] tracking-[-0.02em]">{text(sec, 'logoHeadline', locale)}</h3>
            {/* 설명은 헤드라인 아래에 붙인다 — 다른 섹션의 리드 문장과 같은 자리다 */}
            <p className="mt-4 max-w-lg text-base leading-relaxed text-black/50 md:text-lg">{text(sec, 'logoCaption', locale)}</p>
          </Reveal>
        </div>

        {/* 설계 그리드는 어두운 면 위에 올려야 파란 보조선이 산다 */}
        <Reveal>
          {/* 패널 색은 소재 자체의 배경과 같은 값이어야 한다 — 다르면 이미지 테두리가
              안쪽에 사각형으로 비친다. #0E0F1A 는 팔레트의 WITIM Ink 다. */}
          <figure className="overflow-hidden rounded-[clamp(0.75rem,1.4vw,1.5rem)] bg-[#0E0F1A] p-[clamp(1.5rem,5vw,6rem)]">
            <img alt={logoGrid.alt} className="block h-auto w-full" loading="lazy" src={logoGrid.src} />
          </figure>
        </Reveal>
      </GridShell>

      <section>
        <Reveal><img alt={poster.alt} className="block h-auto w-full" loading="lazy" src={poster.src} /></Reveal>
      </section>

      <GridShell dark>
        <div className="space-y-[clamp(0.75rem,1vw,1.25rem)]">
          {/* 티미를 소개하는 자리는 여기 하나다 — 어떤 동료인지 말한 뒤,
              그 성격이 어떤 형태로 설계됐는지 도면으로 이어 붙인다. */}
          <div className="grid gap-x-[6vw] gap-y-6 border-t border-white/25 pt-[clamp(1.5rem,2vw,2.5rem)] pb-[clamp(2rem,3vw,3.5rem)] md:grid-cols-2">
            <Reveal><h2 className="text-[clamp(1.15rem,1.6vw,1.6rem)] font-bold tracking-[-0.02em]">{text(sec, 'eyebrow', locale)}</h2></Reveal>
            <Reveal delay={70}>
              <h3 className="text-[clamp(1.5rem,2.4vw,2.4rem)] font-bold leading-[1.15] tracking-[-0.02em]">{text(sec, 'headline', locale)}</h3>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-white/50 md:text-lg">{text(sec, 'lead', locale)}</p>
            </Reveal>
          </div>

          <div className="grid gap-x-[clamp(1.5rem,3vw,3.5rem)] gap-y-[clamp(2rem,3vw,3rem)] pb-[clamp(1.5rem,2.5vw,3rem)] md:grid-cols-3">
            {list(sec, 'traits').map((trait, order) => (
              <Reveal delay={order * 70} key={text(trait, 'number', locale) || order}>
                <p className="font-mono text-[clamp(0.75rem,0.9vw,0.9rem)] text-white/35">{text(trait, 'number', locale)}</p>
                <h4 className="mt-[clamp(0.75rem,1.2vw,1.25rem)] text-[clamp(1.15rem,1.6vw,1.6rem)] font-bold tracking-[-0.02em]">{text(trait, 'title', locale)}</h4>
                <p className="mt-[clamp(0.5rem,0.8vw,0.85rem)] text-base leading-relaxed text-white/50">{text(trait, 'body', locale)}</p>
              </Reveal>
            ))}
          </div>
          {/* 큰 설계도가 왼쪽 두 열을 두 행에 걸쳐 세로로 채우고, 오른쪽 두 열에
              부분 도면 A·C 가 위에 붙는다. B 주석은 그 아래 빈 자리를 쓴다. */}
          <div className="grid grid-cols-2 gap-[clamp(0.5rem,1vw,1rem)] md:grid-cols-4">
            <Reveal className="col-span-2 md:row-span-2">
              <figure className="flex h-full items-center justify-center overflow-hidden bg-white">
                <img alt={image(plates[0] ?? {}, 'image', locale).alt} className="h-full w-full object-cover" loading="lazy" src={image(plates[0] ?? {}, 'image', locale).src} />
              </figure>
            </Reveal>

            {SIDE_CELL.map((cell, index) => {
              const plate = image(plates[index + 1] ?? {}, 'image', locale)
              const mark = text(plates[index + 1] ?? {}, 'mark', locale)
              return (
                <Reveal className={`self-start ${cell}`} delay={(index + 1) * 70} key={cell}>
                  <figure className={`flex items-center justify-center overflow-hidden bg-white ${PLATE_CELL}`}>
                    <img alt={plate.alt} className="h-full w-full object-cover" loading="lazy" src={plate.src} />
                  </figure>
                  <ConstructionNote className="mt-[clamp(0.85rem,1.4vw,1.4rem)]" locale={locale} note={notes[mark] ?? {}} />
                </Reveal>
              )
            })}

            {/* B 는 판 없이 주석만 — 큰 도면이 이미 그 치수를 보여주고 있다.
                오른쪽 아래 끝에 붙여 큰 판의 밑변과 눈높이를 맞춘다. */}
            <Reveal className="col-span-2 self-end md:col-span-2 md:col-start-3 md:row-start-2" delay={210}>
              <ConstructionNote locale={locale} note={notes.B ?? {}} />
            </Reveal>
          </div>
        </div>
      </GridShell>

      {/* 옥외 목업은 GridShell 밖으로 빼야 좌우 여백 없이 화면 끝까지 닿는다 */}
      <section>
        <Reveal><img alt={banner.alt} className="block h-auto w-full" loading="lazy" src={banner.src} /></Reveal>
      </section>

    </>
  )
}
