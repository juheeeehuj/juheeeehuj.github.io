import Reveal from '@studio/witim/Reveal'
import AnimatedMoodboard from '@studio/witim/AnimatedMoodboard'
import HeroSequence from '@studio/witim/HeroSequence'
import TypefaceSpecimen from '@studio/witim/sections/TypefaceSpecimen'
import { isDarkColor } from '@studio/lib/content'
import { list, text, toggle } from '@studio/lib/field'
import { tx } from '@studio/lib/ia'
import type { Locale, Slot } from '@studio/lib/ia'

// 레이아웃 블록 — 운영자가 어드민에서 블록을 추가하고 프리셋(전체/2단/3단/좌우분할)을
// 골라 이미지·글을 채우면, 이 컴포넌트가 그 프리셋대로 배치한다. 블록을 반복해서 쌓아
// 한 섹션을 구성한다(하드코딩 없음, 순수 데이터 구동).
type LayoutBlocksProps = {
  locale: Locale
  sec: Slot
}

type BlockImage = { src: string; alt: string }

const isVideo = (src: string) => /\.(mp4|webm|mov)$/i.test(src)

// 이미지 또는 영상 한 칸. 인터랙션: 호버 시 살짝 확대.
function Media({ image, className }: { image: BlockImage; className?: string }) {
  if (!image.src) return <div className={`bg-[#e9ebf4] ${className ?? ''}`} />
  const common = `h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] ${className ?? ''}`
  if (isVideo(image.src)) {
    return <video className={common} src={image.src} autoPlay loop muted playsInline aria-label={image.alt || undefined} />
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={common} src={image.src} alt={image.alt} loading="lazy" />
}

// 프리셋별 그리드 열 수 — 반응형 3종(모바일 1열 → 태블릿/데스크탑 확장).
const GRID: Record<string, string> = {
  cols2: 'grid-cols-1 md:grid-cols-2',
  cols3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
}
const CELLS: Record<string, number> = { cols2: 2, cols3: 3 }

// 글이 중심인 프리셋들 — 저마다 넉넉한 상하 여백을 갖는다. 이 중 둘이 연달아 오면
// 여백이 두 번 쌓여 사이가 지나치게 벌어지므로 이음매를 좁힌다(아래 padY).
// 한 덩어리로 읽히던 "큰 문장 → 설명" 흐름을 그대로 유지하기 위해서다.
const TEXT_RHYTHM = new Set(['statement', 'editorial', 'editorial-flush', 'values', 'traits'])

// 이음매 여백. 글 프리셋이 이어지면 앞 블록의 아래 여백을 지우고 뒤 블록의 위 여백만
// 좁게 남겨, 두 덩어리가 원래처럼 한 흐름으로 붙어 읽히게 한다. 클래스는 전부 리터럴이어야
// Tailwind 가 빌드 때 만들어 준다 — 문자열 조합 금지.
const SEAM_TOP = 'pt-[clamp(2.5rem,5vw,5.5rem)]'
const padY = ({ tightTop, tightBottom }: Seam, top: string, bottom: string) =>
  `${tightTop ? SEAM_TOP : top} ${tightBottom ? 'pb-0' : bottom}`

type Seam = { tightTop?: boolean; tightBottom?: boolean }

function Block({ block, locale, tightTop = false, tightBottom = false }: { block: Slot; locale: Locale } & Seam) {
  const seam: Seam = { tightTop, tightBottom }
  const layout = text(block, 'layout', locale) || 'full'
  const images: BlockImage[] = list(block, 'images')
    .map((item) => {
      const f = item.image
      return f && f.type === 'image' ? { src: f.src, alt: tx(f.alt, locale) } : { src: '', alt: '' }
    })
    .filter((img) => img.src)
  const heading = text(block, 'heading', locale)
  // 헤더가 3단인 프리셋(밸류·특성)에서 오른쪽 위에 오는 제목. 2단 프리셋은 쓰지 않는다.
  const subheading = text(block, 'subheading', locale)
  const body = text(block, 'body', locale)
  const flip = block.flip?.type === 'toggle' ? block.flip.value : false

  // 히어로 — 화면 전체를 덮는 첫 인상. 풀블리드(full)와 달리 높이가 뷰포트(min-h-dvh)에
  // 고정되고 미디어가 object-cover 로 잘려 채운다 — 어떤 비율의 소재를 넣어도 첫 화면이
  // 꽉 찬다. 자동재생이 막히는 브라우저 대비가 필요해 클라이언트 컴포넌트로 뺐다.
  if (layout === 'hero') {
    const img = images[0]
    if (!img) return null
    return <HeroSequence alt={img.alt} src={img.src} />
  }

  // 전체 — 풀블리드 1장(이미지/영상)
  if (layout === 'full') {
    const img = images[0]
    if (!img) return null
    return (
      <div className="group w-full overflow-hidden">
        <Media image={img} className="!h-auto" />
      </div>
    )
  }

  // 액자 — 검은 테두리 + 라운드 + 그림자로 감싼 미디어. 풀블리드(여백 없이 꽉 참)와 달리
  // 제품 화면 목업처럼 지면에서 살짝 띄운다. 디자인시스템의 ChatScreen 과 같은 테.
  // 여러 장이면 세로로 여백을 두고 쌓는다. 검은 테는 box-shadow(0 0 0 10px #000)로 —
  // border 로 주면 그만큼 안으로 밀려 미디어가 작아진다.
  if (layout === 'framed') {
    if (!images.length) return null
    return (
      <div className="mx-auto w-full max-w-[74.5vw] space-y-[clamp(2rem,5vw,5rem)] py-[clamp(3rem,6vw,7rem)]">
        {images.map((img, i) => (
          <Reveal delay={i * 70} key={`${i}-${img.src}`}>
            <div className="group overflow-hidden rounded-[10px] shadow-[0_0_0_10px_#000,0_22px_48px_#00000033]">
              <Media image={img} className="!h-auto" />
            </div>
          </Reveal>
        ))}
      </div>
    )
  }

  // 좌우 분할 — 한쪽 글, 한쪽 이미지 (flip 으로 좌우 반전)
  if (layout === 'split') {
    const img = images[0]
    return (
      <div className="mx-auto grid w-full max-w-[74.5vw] grid-cols-1 items-center gap-[clamp(2rem,4vw,4.5rem)] py-[clamp(3rem,6vw,7rem)] md:grid-cols-2">
        <Reveal className={flip ? 'md:order-2' : undefined}>
          {heading && <h3 className="text-[clamp(1.5rem,2.4vw,2.6rem)] font-bold leading-[1.25] tracking-[-0.02em]">{heading}</h3>}
          {body && <p className="mt-5 text-[clamp(1rem,1.3vw,1.25rem)] leading-[1.8] text-black/55">{body}</p>}
        </Reveal>
        {img && (
          <div className={`group aspect-[4/3] overflow-hidden ${flip ? 'md:order-1' : ''}`}>
            <Media image={img} />
          </div>
        )}
      </div>
    )
  }

  // 갤러리 — 이미지 여러 장을 2행 스크롤 무드보드로. Opening 무드보드와 같은 레이아웃.
  // AnimatedMoodboard 를 그대로 재사용한다(위 행 왼쪽, 아래 행 오른쪽으로 멈춰가며 흐름).
  if (layout === 'gallery') {
    if (!images.length) return null
    const motion = text(block, 'motion', locale)
    return <AnimatedMoodboard images={images} motion={motion === 'single' || motion === 'static' || motion === 'random' ? motion : 'dual'} />
  }

  // 밸류 — 라인으로 구분된 세로 리스트. 코어밸류와 같은 구조: 상단 굵은 라인 + 헤더,
  // 그 아래 각 항목이 얇은 라인으로 구분돼 [큰 번호 | 제목·설명] 2단으로 쌓인다.
  // 특성(traits)과 달리 3단 그리드가 아니라 라인 구분 리스트다 — 라인이 이 레이아웃의 핵심.
  // 헤더는 3필드다: 왼쪽에 라벨(heading), 오른쪽에 제목(subheading)과 설명(body).
  if (layout === 'values') {
    const values = list(block, 'values')
    if (!values.length) return null
    return (
      <div className={`w-full px-[5.2vw] text-[#111] ${padY(seam, 'pt-[clamp(6rem,10vw,12rem)]', 'pb-[clamp(6rem,10vw,12rem)]')}`}>
        {(heading || subheading || body) && (
          <Reveal className="grid gap-x-[6vw] gap-y-6 border-t border-black/80 pt-[clamp(1.5rem,2vw,2.5rem)] pb-[clamp(2rem,3vw,3.5rem)] md:grid-cols-2">
            <h2 className="text-[clamp(1.15rem,1.6vw,1.6rem)] font-bold tracking-[-0.02em]">{heading}</h2>
            <div>
              <h2 className="text-[clamp(1.15rem,1.6vw,1.6rem)] font-bold tracking-[-0.02em]">{subheading}</h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-black/50 md:text-lg">{body}</p>
            </div>
          </Reveal>
        )}
        {values.map((value, index) => (
          <Reveal
            className="grid gap-x-[6vw] gap-y-3 border-t border-black/15 py-[clamp(1.75rem,3vw,3.25rem)] md:grid-cols-2"
            delay={index * 70}
            key={text(value, 'number', locale) || index}
          >
            <span className="text-[clamp(1.8rem,3vw,3rem)] font-bold">{text(value, 'number', locale)}</span>
            <div>
              <h3 className="text-[clamp(1.5rem,2.4vw,2.4rem)] font-bold leading-[1.15] tracking-[-0.02em]">{text(value, 'title', locale)}</h3>
              <p className="mt-3 max-w-lg text-base leading-relaxed text-black/50 md:text-lg">{text(value, 'body', locale)}</p>
            </div>
          </Reveal>
        ))}
      </div>
    )
  }

  // 특성(traits) — 번호 + 제목 + 설명을 3단으로. 티미 에이전트의 특성 목록과 같은 구조.
  // 항목 수에 맞춰 그리드가 접히고(모바일 1열), dark 토글로 어두운 배경에 얹을 수 있다.
  // (설계 도면처럼 mark 매칭·고정배치인 부분은 witim 전용이라 프리셋에 넣지 않는다.)
  if (layout === 'traits') {
    const traits = list(block, 'traits')
    if (!traits.length) return null
    const dark = flip // flip 토글을 다크 배경 스위치로 재사용
    const lineColor = dark ? 'border-white/25' : 'border-black/80'
    return (
      <div className={`w-full px-[5.2vw] ${padY(seam, 'pt-[clamp(3rem,6vw,7rem)]', 'pb-[clamp(3rem,6vw,7rem)]')} ${dark ? 'bg-[#0f0f13] text-white' : 'text-[#111]'}`}>
        {/* 헤더 — 상단 라인 + 제목(왼쪽)·설명(오른쪽) 2단. 티미 소개와 같은 구조. */}
        {(heading || body) && (
          <div className={`mb-[clamp(2rem,3vw,3.5rem)] grid gap-x-[6vw] gap-y-6 border-t ${lineColor} pt-[clamp(1.5rem,2vw,2.5rem)] md:grid-cols-2`}>
            {heading && <h3 className="text-[clamp(1.15rem,1.6vw,1.6rem)] font-bold tracking-[-0.02em]">{heading}</h3>}
            {body && <p className={`max-w-xl text-base leading-relaxed md:text-lg md:col-start-2 ${dark ? 'text-white/50' : 'text-black/55'}`}>{body}</p>}
          </div>
        )}
        <div className="grid gap-x-[clamp(1.5rem,3vw,3.5rem)] gap-y-[clamp(2rem,3vw,3rem)] md:grid-cols-3">
          {traits.map((trait, order) => (
            <Reveal delay={order * 70} key={text(trait, 'number', locale) || order}>
              <p className={`font-mono text-[clamp(0.75rem,0.9vw,0.9rem)] ${dark ? 'text-white/35' : 'text-black/35'}`}>{text(trait, 'number', locale)}</p>
              <h4 className="mt-[clamp(0.75rem,1.2vw,1.25rem)] text-[clamp(1.15rem,1.6vw,1.6rem)] font-bold tracking-[-0.02em]">{text(trait, 'title', locale)}</h4>
              <p className={`mt-[clamp(0.5rem,0.8vw,0.85rem)] text-base leading-relaxed ${dark ? 'text-white/50' : 'text-black/55'}`}>{text(trait, 'body', locale)}</p>
            </Reveal>
          ))}
        </div>
      </div>
    )
  }

  // 컬러 — 색상 팔레트. 값(swatch·이름·RGB·HEX)을 입력하면 CSS 색면 그리드가 자동 생성된다
  // (이미지 아님 — HEX 가 실제 색과 항상 일치, 다크/반응형 자동). 프라이머리(hero) 색은
  // 개수에 맞춰 위쪽 큰 그리드가 유연하게 늘어난다 — 라이트/다크로 2개일 수도, 1개나 3개일
  // 수도 있다(그리드 열 = hero 개수). hero 가 아닌 색은 아래 리스트로. darkText 는 밝은
  // 배경에서 글자를 어둡게.
  if (layout === 'color') {
    const colors = list(block, 'colors')
    if (!colors.length) return null
    const heroes = colors.filter((c) => toggle(c, 'hero'))
    const rest = colors.filter((c) => !toggle(c, 'hero'))
    // 큰 색면 열 수 = hero 개수(1~4). 없으면 전부 리스트로만 보여준다.
    const heroCols = ['', 'md:grid-cols-1', 'md:grid-cols-2', 'md:grid-cols-3', 'md:grid-cols-4'][Math.min(heroes.length, 4)] || 'md:grid-cols-2'
    return (
      <section aria-label="색상 팔레트" className="w-full">
        {heroes.length > 0 && (
          <div className={`grid grid-cols-1 ${heroCols}`}>
            {heroes.map((color, i) => (
              <div
                className={`flex min-h-[clamp(20rem,34vw,44rem)] flex-col p-[clamp(2rem,3.5vw,4rem)] font-mono ${toggle(color, 'darkText') ? 'text-[#111]' : 'text-white'}`}
                key={text(color, 'hex', locale) || i}
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
        )}
        {rest.map((color, i) => (
          <div
            className={`grid min-h-[clamp(4.5rem,7vw,8.5rem)] grid-cols-[1.2fr_repeat(3,minmax(0,1fr))] items-center gap-4 px-[5.2vw] font-mono text-[clamp(0.75rem,0.95vw,0.95rem)] ${toggle(color, 'darkText') ? 'text-[#111]' : 'text-white'}`}
            key={text(color, 'hex', locale) || i}
            style={{ background: text(color, 'swatch', locale) }}
          >
            <span />
            <span>{text(color, 'name', locale)}</span>
            <span>{text(color, 'rgb', locale)}</span>
            <span>{text(color, 'hex', locale)}</span>
          </div>
        ))}
      </section>
    )
  }

  // 타이포그래피 1 — 서체 견본. 거대 글리프 + 웨이트 슬라이더가 굵기 구간을 오간다.
  // 운영자는 specimens 항목마다 텍스트(glyph·sample·lang)와 두께값(weightMin·weightMax)을
  // 입력한다. 번호를 붙여 둔 건 나중에 typo-2 등 다른 서체 레이아웃을 더하기 위해서다.
  // TypefaceSpecimen 이 sec 에서 typeLabel/typeName/specimens 를 읽으므로 블록을 그대로 넘긴다.
  if (layout === 'typo-1') {
    if (!list(block, 'specimens').length) return null
    return <TypefaceSpecimen locale={locale} sec={block} />
  }

  // 스테이트먼트 — 큰 굵은 문장(줄 단위). Project Overview 맨 위 문장과 같은 레이아웃
  // (3.4rem, 좌측 px-[5.2vw], 줄마다 페이드인). heading 을 줄바꿈으로 나눠 한 줄씩 크게 쌓는다.
  // 딸린 요소(갤러리·에디토리얼)는 별도 블록으로 두고 조립한다 — 여기는 문장만.
  if (layout === 'statement') {
    if (!heading) return null
    return (
      <div className={`w-full px-[5.2vw] text-[#111] ${padY(seam, 'pt-[clamp(5rem,10.4vw,12.5rem)]', 'pb-[clamp(5rem,10.4vw,12.5rem)]')}`}>
        <h2 className="text-[clamp(1.8rem,2.9vw,3.4rem)] font-bold leading-[1.2] tracking-[-0.03em]">
          {heading.split('\n').filter(Boolean).map((line, i) => (
            <Reveal as="span" className="block" delay={i * 70} key={i}>{line}</Reveal>
          ))}
        </h2>
      </div>
    )
  }

  // 에디토리얼 — 제목(왼쪽) + 본문(오른쪽) 2단 텍스트. 텍스트만 두는 게 기본이고,
  // 이미지를 넣으면 그 아래에 붙는다. 두 버전으로 나뉜다:
  //  - editorial     : [1fr_1.5fr] (현재 버전, Project Overview 와 같은 비율)
  //  - editorial-flush: md:grid-cols-2 (제목을 왼쪽 절반에 — 디자인시스템 eyebrow 와 정렬 일치)
  if (layout === 'editorial' || layout === 'editorial-flush') {
    const cols = layout === 'editorial-flush' ? 'md:grid-cols-2' : 'md:grid-cols-[1fr_1.5fr]'
    return (
      <div className={`w-full px-[5.2vw] text-[#111] ${padY(seam, 'pt-[clamp(5rem,10.4vw,12.5rem)]', 'pb-[clamp(5rem,10.4vw,12.5rem)]')}`}>
        <div className={`grid gap-[clamp(2rem,4vw,5rem)] ${cols}`}>
          {heading && <Reveal><h3 className="text-[clamp(1.15rem,1.6vw,1.6rem)] font-bold leading-[1.2] tracking-[-0.02em]">{heading}</h3></Reveal>}
          {body && (
            <Reveal className="space-y-6 text-[clamp(1rem,1.3vw,1.3rem)] leading-[1.8] text-black/55" delay={70}>
              {body.split('\n').filter(Boolean).map((para, i) => <p key={i}>{para}</p>)}
            </Reveal>
          )}
        </div>
        {images.length > 0 && (
          <div className="mt-[clamp(2.5rem,5vw,5.5rem)] grid gap-4 md:gap-5">
            {images.map((img, i) => (
              <div key={`${i}-${img.src}`} className="group w-full overflow-hidden"><Media image={img} className="!h-auto" /></div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // 와이드형 — WITIM 시그니처 비대칭 2단(넓은 쪽 + 좁은 쪽). 균등 2단과 달리 한쪽을
  // 크게 열어 리듬을 준다. witim 섹션이 실제로 쓰는 [1.4~1.75fr : 1fr] 그리드를 따른다.
  // flip 으로 넓은 쪽을 좌↔우 반전한다.
  if (layout === 'wide') {
    const [a, b] = images
    if (!a) return null
    return (
      <div className={`grid w-full grid-cols-1 gap-4 md:gap-5 ${flip ? 'md:grid-cols-[1fr_1.6fr]' : 'md:grid-cols-[1.6fr_1fr]'}`}>
        <div className="group aspect-[16/10] overflow-hidden md:aspect-auto"><Media image={a} /></div>
        {b && <div className="group aspect-[4/5] overflow-hidden"><Media image={b} /></div>}
      </div>
    )
  }

  // 2단 / 3단 — 이미지 그리드 (풀블리드, 균일 세로 비율)
  const cols = GRID[layout] ?? GRID.cols2
  const count = CELLS[layout] ?? 2
  const cells = images.slice(0, count)
  if (!cells.length) return null
  return (
    <div className={`grid w-full gap-4 md:gap-5 ${cols}`}>
      {cells.map((img, i) => (
        <div key={`${i}-${img.src}`} className="group aspect-[4/5] overflow-hidden">
          <Media image={img} />
        </div>
      ))}
    </div>
  )
}

// 이미지 전용 레이아웃 — 텍스트는 렌더 안 하므로, 운영자가 '필드 추가'로 넣은
// 제목·본문은 여기 캡션으로 붙인다(있을 때만).
const IMAGE_LAYOUTS = new Set(['hero', 'full', 'framed', 'cols2', 'cols3', 'wide', 'gallery'])

function BlockCaption({ eyebrow, heading, subheading, body }: { eyebrow: string; heading: string; subheading: string; body: string }) {
  return (
    <div className="mx-auto w-full max-w-[74.5vw] py-[clamp(1.5rem,3vw,3rem)]">
      {eyebrow && <p className="mb-2 font-mono text-[clamp(0.72rem,0.9vw,0.9rem)] uppercase tracking-[0.12em] text-black/40">{eyebrow}</p>}
      {heading && <h3 className="text-[clamp(1.15rem,1.8vw,1.9rem)] font-bold leading-[1.25] tracking-[-0.02em]">{heading}</h3>}
      {subheading && <p className="mt-1 text-[clamp(1rem,1.3vw,1.3rem)] font-medium text-black/70">{subheading}</p>}
      {body && <p className="mt-3 max-w-3xl text-[clamp(0.95rem,1.2vw,1.15rem)] leading-[1.8] text-black/55">{body}</p>}
    </div>
  )
}

export default function LayoutBlocks({ locale, sec }: LayoutBlocksProps) {
  const blocks = list(sec, 'blocks')
  if (!blocks.length) return null
  return (
    // 여백은 섹션이 아니라 블록이 정한다 — 풀블리드는 인접 섹션과 맞닿아야 하고,
    // 섹션 하나를 통째로 대신하는 프리셋은 자기 여백을 이미 갖고 있다. 블록 사이 간격은
    // 아래에서 이웃 종류를 보고 붙인다(미디어끼리만).
    <section className="w-full bg-white text-[#111]">
      {blocks.map((block, index) => {
        const kind = (b: Slot | undefined) => (b ? text(b, 'layout', locale) || 'full' : '')
        const cur = kind(block)
        const prev = kind(blocks[index - 1])
        const next = kind(blocks[index + 1])
        // 미디어 블록끼리만 얇은 간격을 둔다 — 글 프리셋은 자기 여백을 갖고 있어
        // 여기에 간격을 더하면 이음매를 좁혀 놓은 게 도로 벌어진다.
        const gap = index > 0 && !TEXT_RHYTHM.has(cur) && !TEXT_RHYTHM.has(prev) ? 'mt-4 md:mt-5' : ''
        // 운영자가 고른 배경색(bg). 어두우면 글자를 밝게 뒤집는다(대비).
        const bg = text(block, 'bg', locale)
        const darkBg = bg ? isDarkColor(bg) : false
        // 이미지 레이아웃에 '필드 추가'로 넣은 캡션(있을 때만).
        const cap = IMAGE_LAYOUTS.has(cur)
          ? { eyebrow: text(block, 'eyebrow', locale), heading: text(block, 'heading', locale), subheading: text(block, 'subheading', locale), body: text(block, 'body', locale) }
          : null
        const hasCaption = cap && (cap.eyebrow || cap.heading || cap.subheading || cap.body)
        return (
          <div
            className={`${gap} ${darkBg ? '[&_*]:!text-white' : ''}`}
            style={bg ? { background: bg } : undefined}
            key={index}
          >
            <Block
              block={block}
              locale={locale}
              tightTop={TEXT_RHYTHM.has(cur) && TEXT_RHYTHM.has(prev)}
              tightBottom={TEXT_RHYTHM.has(cur) && TEXT_RHYTHM.has(next)}
            />
            {hasCaption && cap && <BlockCaption {...cap} />}
          </div>
        )
      })}
    </section>
  )
}
