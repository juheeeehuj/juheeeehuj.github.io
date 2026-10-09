import AsymmetricBoard from './AsymmetricBoard'

const motionStickers = [
  '/work/witim-identity/character/stickers/motion-2x/motion-01.webp',
  '/work/witim-identity/character/stickers/motion-2x/motion-02.webp',
  '/work/witim-identity/character/stickers/motion-2x/motion-03.webp',
  '/work/witim-identity/character/stickers/motion-2x/motion-04.webp',
  '/work/witim-identity/character/stickers/motion-2x/motion-05.webp',
  '/work/witim-identity/character/stickers/motion-2x/motion-06.webp',
  '/work/witim-identity/character/stickers/motion-2x/motion-07.webp',
  '/work/witim-identity/character/stickers/motion-2x/motion-08.webp',
  '/work/witim-identity/character/stickers/motion-2x/motion-09.webp',
]

const officeStickers = [
  '/work/witim-identity/character/stickers/office/office-01.webp',
  '/work/witim-identity/character/stickers/office/office-02.webp',
  '/work/witim-identity/character/stickers/office/office-03.webp',
  '/work/witim-identity/character/stickers/office/office-04.webp',
  '/work/witim-identity/character/stickers/office/office-05.webp',
  '/work/witim-identity/character/stickers/office/office-06.webp',
  '/work/witim-identity/character/stickers/office/office-07.webp',
  '/work/witim-identity/character/stickers/office/office-08.webp',
  '/work/witim-identity/character/stickers/office/office-09.webp',
]

const studentStickers = [
  '/work/witim-identity/character/stickers/student/student-01.webp',
  '/work/witim-identity/character/stickers/student/student-02.webp',
  '/work/witim-identity/character/stickers/student/student-03.webp',
  '/work/witim-identity/character/stickers/student/student-04.webp',
  '/work/witim-identity/character/stickers/student/student-05.webp',
  '/work/witim-identity/character/stickers/student/student-06.webp',
  '/work/witim-identity/character/stickers/student/student-07.webp',
  '/work/witim-identity/character/stickers/student/student-08.webp',
  '/work/witim-identity/character/stickers/student/student-09.webp',
]

const motionPattern = [
  ...motionStickers,
  motionStickers[2],
  motionStickers[4],
  motionStickers[0],
  motionStickers[6],
  motionStickers[3],
  motionStickers[1],
  motionStickers[8],
]

type TileLabelProps = {
  children?: React.ReactNode
  dark?: boolean
}

function TileLabel({ children, dark = false }: TileLabelProps) {
  return (
    <figcaption className={`absolute left-4 top-4 z-10 font-mono text-[10px] font-bold uppercase tracking-[0.18em] ${dark ? 'text-witim-light' : 'text-white/85'}`}>
      {children}
    </figcaption>
  )
}

function MotionPatternTile() {
  return (
    <figure className="relative h-full min-h-0 overflow-hidden bg-white" data-sticker-group="motion">
      <TileLabel dark>Motion Stickers</TileLabel>
      <div aria-hidden="true" className="absolute -inset-[18%]">
        <div className="timi-sticker-drift grid h-[118%] w-[112%] grid-cols-4 gap-x-[22px] gap-y-[18px]">
          {motionPattern.map((src, index) => (
            <img
              alt=""
              className={`h-full min-h-0 w-full object-contain drop-shadow-[0_10px_12px_rgba(17,24,39,0.08)] ${index % 3 === 1 ? 'translate-y-[26%]' : ''}`}
              key={`${src}-${index}`}
              src={src}
            />
          ))}
        </div>
      </div>
    </figure>
  )
}

type StickerCarouselTileProps = {
  background: string
  label: string
  stickers: string[]
  group: string
}

function StickerCarouselTile({ background, label, stickers, group }: StickerCarouselTileProps) {
  return (
    <figure className={`relative h-full min-h-0 overflow-hidden ${background}`} data-sticker-group={group}>
      <TileLabel>{label}</TileLabel>
      <div aria-hidden="true" className="relative h-full" data-sticker-rotator>
        {stickers.map((src, index) => (
          <img
            alt=""
            className="timi-sticker-cycle absolute inset-0 m-auto h-auto max-h-[60%] w-[60%] object-contain drop-shadow-[0_12px_18px_rgba(21,31,91,0.12)]"
            key={src}
            src={src}
            style={{ '--sticker-delay': `${index * 3}s` } as React.CSSProperties}
          />
        ))}
      </div>
    </figure>
  )
}

export default function TimiStickerBoard() {
  return (
    <AsymmetricBoard
      className="w-full !gap-[10px]"
      featured={<MotionPatternTile />}
      stackClassName="!gap-[10px]"
      stacked={[
        <StickerCarouselTile background="bg-witim-dark" group="office" key="office" label="Office Stickers" stickers={officeStickers} />,
        <StickerCarouselTile background="bg-witim-light" group="student" key="student" label="Campus Stickers" stickers={studentStickers} />,
      ]}
    />
  )
}
