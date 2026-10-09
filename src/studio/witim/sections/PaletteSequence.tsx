import EdgeReveal from '@studio/witim/EdgeReveal'
import EditorialBand from '@studio/witim/grid/EditorialBand'
import GridShell from '@studio/witim/grid/GridShell'
import TypefaceSpecimen from '@studio/witim/sections/TypefaceSpecimen'
import { image, list, text, toggle } from '@studio/lib/field'
import type { Locale, Slot } from '@studio/lib/ia'

// 목업 화면 · 컬러 체계 · 타이포 스케일. 값은 content/witim.json 에서 온다(IA §1).
// 영상이 얹히는 좌표와 샘플 이미지의 비율·배치는 연출이라 코드에 남긴다.
const CHAT_FRAME = { left: '37.3%', top: '20.1%', width: '53.8%', height: '41.8%' } as const

type PaletteSequenceProps = {
  locale: Locale
  sec: Slot
}

export default function PaletteSequence({ locale, sec }: PaletteSequenceProps) {
  const desk = image(sec, 'deskMockup', locale)
  const chat = image(sec, 'chatVideo', locale)
  const palette = list(sec, 'palette')
  const scale = list(sec, 'scale')
  const samples = list(sec, 'samples').map((item) => image(item, 'image', locale))
  const sampleText = (index: number) => text(scale[index] ?? {}, 'sample', locale)

  return (
    <>
      <section>
        <div className="relative">
          {desk.src ? <img alt={desk.alt} className="block h-auto w-full" loading="lazy" src={desk.src} /> : null}
          {/* 목업 디스플레이 안에서 재생되는 채팅 동영상 */}
          {chat.src ? (
            <video
              aria-label={chat.alt}
              autoPlay
              className="absolute"
              loop
              muted
              playsInline
              src={chat.src}
              style={{ ...CHAT_FRAME, objectFit: 'cover' }}
            />
          ) : null}
        </div>
      </section>

      <section className="bg-white text-[#111]">
        <EditorialBand title={text(sec, 'sectionTitle', locale)}>
          {list(sec, 'intro').map((item, index) => (
            <p className="mt-7 text-[clamp(1rem,1.3vw,1.3rem)] leading-[1.85] first:mt-0" key={index}>
              {text(item, 'paragraph', locale)}
            </p>
          ))}
        </EditorialBand>
      </section>

      <section aria-label="WITIM 색상 체계">
        <div className="grid md:grid-cols-2">
          {palette.filter((color) => toggle(color, 'hero')).map((color, index) => (
            <div
              className="flex min-h-[clamp(20rem,34vw,44rem)] flex-col p-[clamp(2rem,3.5vw,4rem)] font-mono text-white"
              key={text(color, 'hex', locale) || index}
              style={{ background: text(color, 'swatch', locale) }}
            >
              <div className="grid gap-x-6 gap-y-1 text-[clamp(0.8rem,1vw,1.05rem)] sm:grid-cols-3">
                <span>{text(color, 'name', locale)}</span>
                <span>{text(color, 'rgb', locale)}</span>
                <span>{text(color, 'hex', locale)}</span>
              </div>
            </div>
          ))}
        </div>
        {palette.filter((color) => !toggle(color, 'hero')).map((color, index) => (
          <div
            className={`grid min-h-[clamp(4.5rem,7vw,8.5rem)] grid-cols-[1.2fr_repeat(3,minmax(0,1fr))] items-center gap-4 px-[5.2vw] font-mono text-[clamp(0.75rem,0.95vw,0.95rem)] ${toggle(color, 'darkText') ? 'text-white' : 'text-[#111]'}`}
            key={text(color, 'hex', locale) || index}
            style={{ background: text(color, 'swatch', locale) }}
          >
            <span />
            <span>{text(color, 'name', locale)}</span>
            <span>{text(color, 'rgb', locale)}</span>
            <span>{text(color, 'hex', locale)}</span>
          </div>
        ))}
      </section>

      <TypefaceSpecimen locale={locale} sec={sec} />

      <GridShell className="bg-white !px-0 !py-0">
        <div className="space-y-5">
          <div className="grid gap-6 md:grid-cols-12">
            <p className="px-[5.2vw] text-[clamp(4rem,10vw,12rem)] font-bold leading-[.88] tracking-[-0.065em] md:col-span-12">{sampleText(0)}</p>
          </div>

          <div className="grid gap-5 md:grid-cols-12 md:items-end">
            <EdgeReveal className="md:col-span-4" from="left">
              <figure className="overflow-hidden bg-[#f4f5fa]"><img alt={samples[0]?.alt ?? ''} className="aspect-[4/3] h-full w-full object-cover" loading="lazy" src={samples[0]?.src ?? ''} /></figure>
            </EdgeReveal>
            <div className="px-[5.2vw] md:col-span-7 md:col-start-6"><p className="text-[clamp(2.8rem,6vw,7rem)] font-bold leading-[.94] tracking-[-0.055em]">{sampleText(1)}</p></div>
          </div>

          <div className="grid gap-5 md:grid-cols-12 md:items-center">
            <div className="px-[5.2vw] md:col-span-7"><p className="max-w-4xl text-[clamp(1.7rem,3.2vw,3.8rem)] font-bold leading-[1.08] tracking-[-0.045em]">{sampleText(2)}</p></div>
            <EdgeReveal className="md:col-span-5" from="right">
              <figure className="overflow-hidden bg-[#0f0f13]"><img alt={samples[1]?.alt ?? ''} className="aspect-[5/4] h-full w-full object-cover" loading="lazy" src={samples[1]?.src ?? ''} /></figure>
            </EdgeReveal>
          </div>

          <div className="grid gap-5 md:grid-cols-12 md:items-end">
            <EdgeReveal className="md:col-span-7" from="left">
              <figure className="overflow-hidden bg-witim-light"><img alt={samples[2]?.alt ?? ''} className="aspect-[16/9] h-full w-full object-cover" loading="lazy" src={samples[2]?.src ?? ''} /></figure>
            </EdgeReveal>
            <div className="px-[5.2vw] md:col-span-4 md:col-start-9"><p className="text-[clamp(2rem,4vw,4.8rem)] font-bold leading-none tracking-[-0.055em]">{sampleText(3)}</p></div>
          </div>
        </div>
      </GridShell>
    </>
  )
}
