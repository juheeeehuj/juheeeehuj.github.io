import Reveal from '@studio/witim/Reveal'
import SoundTile from '@studio/witim/SoundTile'
import GridShell from '@studio/witim/grid/GridShell'
import { image, list } from '@studio/lib/field'
import type { Locale, Slot } from '@studio/lib/ia'

// bg는 className이 아니라 prop으로 받는다 — Tailwind가 임의 색상 유틸리티를 hex 순으로 정렬해
// 출력하므로, 같은 figure에 bg 클래스를 두 개 넘기면 클래스 순서와 무관하게 큰 hex가 이긴다.
// bottom은 아래가 잘린 소재용 — 타일 바닥에 붙여 세워야 잘린 단면이 여백에 뜨지 않는다.
type MontageImageProps = {
  alt: string
  bg?: string
  bottom?: boolean
  className?: string
  contain?: boolean
  src: string
}

function MontageImage({ alt, bg = 'bg-[#f4f5fa]', bottom = false, className = '', contain = false, src }: MontageImageProps) {
  const containFit = bottom ? 'object-contain object-bottom px-[8%] pt-[8%]' : 'object-contain p-[8%]'

  return (
    <figure className={`overflow-hidden ${bg} ${className}`}>
      <img alt={alt} className={`h-full w-full ${contain ? containFit : 'object-cover'}`} loading="lazy" src={src} />
    </figure>
  )
}

// 타일마다 다루는 방식이 다르다 — 세 번째는 눌러 소리가 나는 타일, 네 번째는 아래가
// 잘린 소재라 바닥 정렬. 이런 연출은 코드에 남기고, 소재와 대체텍스트만 JSON 에서 읽는다.
const TILE_HEIGHT = 'h-[clamp(24rem,36vw,44rem)]'
const SOUND = '/work/witim-identity/sound/paw.wav'

type MontageSequenceProps = {
  locale: Locale
  sec: Slot
}

export default function MontageSequence({ locale, sec }: MontageSequenceProps) {
  const tiles = list(sec, 'tiles').map((item) => image(item, 'image', locale))
  const video = image(sec, 'video', locale)

  return (
    <GridShell className="!p-[clamp(0.5rem,1vw,1rem)] bg-white">
      <div className="space-y-[clamp(0.5rem,1vw,1rem)]">
        <div className="grid gap-[clamp(0.5rem,1vw,1rem)] md:grid-cols-2">
          {/* 0 은 배경이 박힌 사진 → 여백 없이 칸을 꽉 채운다(cover). 1 은 배경 없는
              앱 아이콘이라 contain 으로 여백을 둬야 가장자리에 붙지 않는다. */}
          {tiles[0] ? <Reveal><MontageImage alt={tiles[0].alt} className={TILE_HEIGHT} src={tiles[0].src} /></Reveal> : null}
          {tiles[1] ? <Reveal delay={70}><MontageImage alt={tiles[1].alt} className={TILE_HEIGHT} contain src={tiles[1].src} /></Reveal> : null}
        </div>

        <div className="grid gap-[clamp(0.5rem,1vw,1rem)] md:grid-cols-2">
          {tiles[2] ? <Reveal><SoundTile alt={tiles[2].alt} className={`${TILE_HEIGHT} w-full`} sound={SOUND} src={tiles[2].src} /></Reveal> : null}
          {tiles[3] ? <Reveal delay={70}><MontageImage alt={tiles[3].alt} bg="bg-[#e4e6ef]" bottom className={TILE_HEIGHT} contain src={tiles[3].src} /></Reveal> : null}
        </div>

        {/* 소재가 칸을 그대로 채운다 — 여백 없이 원본 비율(3:2)로 눕힌다 */}
        {video.src ? (
          <Reveal>
            <video aria-label={video.alt} autoPlay className="block h-auto w-full" loop muted playsInline preload="metadata" src={video.src} />
          </Reveal>
        ) : null}
      </div>
    </GridShell>
  )
}
