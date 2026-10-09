import Reveal from '@studio/witim/Reveal'
import GridShell from '@studio/witim/grid/GridShell'
import SquareMatrix from '@studio/witim/grid/SquareMatrix'
import { image, list } from '@studio/lib/field'
import type { Locale, Slot } from '@studio/lib/ia'

// 정사각 매트릭스 + 그 아래 세로컷 두 장 + 워드마크 영상.
// 값은 content/witim.json 에서 오고 여기엔 구조만 남는다(IA §1).
type ApplicationSequenceProps = {
  locale: Locale
  sec: Slot
}

export default function ApplicationSequence({ locale, sec }: ApplicationSequenceProps) {
  const video = image(sec, 'video', locale)

  const matrix = list(sec, 'mockups').map((item, index) => {
    const shot = image(item, 'image', locale)
    return (
      <Reveal className="h-full" delay={index * 70} key={shot.src || index}>
        <img alt={shot.alt} className="h-full w-full object-cover" loading="lazy" src={shot.src} />
      </Reveal>
    )
  })

  return (
    <>
      <GridShell className="bg-black" dark>
        <SquareMatrix>{matrix}</SquareMatrix>

        {/* 정사각 칸에 가두기 아까운 세로 컷 두 장 — 원본 비율이 서로 달라(9:16 · 2:3)
            칸에 3:4 를 물리고 object-cover 로 맞춘다. */}
        <div className="mt-[clamp(0.75rem,1vw,1.25rem)] grid grid-cols-1 gap-[clamp(0.75rem,1vw,1.25rem)] sm:grid-cols-2">
          {list(sec, 'pair').map((item, index) => {
            const shot = image(item, 'image', locale)
            return (
              <Reveal className="aspect-[3/4] overflow-hidden" delay={index * 70} key={shot.src || index}>
                <img alt={shot.alt} className="h-full w-full object-cover" loading="lazy" src={shot.src} />
              </Reveal>
            )
          })}
        </div>
      </GridShell>

      {/* 영상 한 편만 남았으니 여백 없이 화면 폭을 꽉 채운다 */}
      {video.src ? (
        <section>
          <Reveal>
            <video aria-label={video.alt} autoPlay className="block h-auto w-full" loop muted playsInline src={video.src} />
          </Reveal>
        </section>
      ) : null}
    </>
  )
}
