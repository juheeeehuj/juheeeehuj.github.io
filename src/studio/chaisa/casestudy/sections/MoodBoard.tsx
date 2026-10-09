'use client'

import { useEffect, useRef } from 'react'
import Reveal from '../../primitives/Reveal'
import Container from '../primitives/Container'
import Section from '../primitives/Section'
import { tr } from '../../locale'

/**
 * MOODBOARD — Overview 레이아웃(라벨 + 타이틀 upper-left + 본문 lower-right)
 * + 아래 이미지 그리드(이미지/placeholder + 캡션, 좌우 어긋난 에디토리얼 배치).
 * 다크 톤(#080A14, 위 UX STRATEGY와 통일). 프레임 radius 없음.
 *
 * 그리드는 "부분 블리드" — 헤더 텍스트는 1440 컨테이너에 갇히지만
 * 2행(Premium/Clarity)은 bleed 로 컨테이너 좌우 엣지 밖까지 밀어 리듬을 깬다.
 * 삐져나간 만큼은 Section 의 overflow-x-clip 이 잘라낸다(가로 스크롤 방지).
 * 비율은 전부 원본 이미지 비율에 맞춰 크롭이 생기지 않게 한다.
 */

const INTRO_TITLE = '간편함과 신뢰, 그리고 친근함 사이'

const INTRO_BODY = [
  '차량 서비스는 전문성과 신뢰가 필요하지만, 차주에게는 어렵고 부담스럽게 느껴지기 쉽습니다. 전문성은 지키되 간편하고 친근한 인상으로 그 거리감을 좁히는 무드를 찾았습니다.',
  '짙은 블루의 신뢰감, 군더더기 없는 명료함, 광택 있는 프리미엄 질감, 그리고 차를 연상시키는 민첩한 동물 치타 — 그 민첩함은 로고의 스피드 라인이 되어, 빠르고 간편한 견적 경험을 드러냅니다.',
]

const BALANCED_IMAGE_FILTER = 'brightness(0.78) saturate(0.72) contrast(1.08)'
const BALANCED_BLUE_OVERLAY = 'linear-gradient(180deg, rgba(0, 122, 255, 0.22), rgba(0, 35, 94, 0.34))'

/**
 * 좌/우 두 개의 독립 컬럼. 행(row)으로 묶지 않기 때문에 양쪽 세로 리듬이 서로에게
 * 종속되지 않고, 브레이크포인트가 바뀌어도 타일끼리 겹칠 수 없다.
 *
 * ratio = 원본 이미지 비율(크롭 없음)
 * inset = 컬럼 안쪽으로 좁히는 %(폭 차이를 만들어 규칙성을 깬다)
 * bleed = 컨테이너 거터 밖으로 밀어내는 음수 마진(부분 블리드)
 */
const LEFT_TILES = [
  {
    name: 'Trust',
    desc: '짙은 블루의 신뢰감',
    tone: 'plain',
    ratio: 'aspect-[11/8]', // 원본 1470×1070
    inset: 'md:mr-[12%]', // 좌상단이 무거워지지 않게 오른쪽을 당겨 줄인다
    bleed: '',
    src: '/work/chaisa/brand/moodboard/blue-trust.webp',
    alt: '깊은 블루 빛이 겹쳐진 추상 이미지',
  },
  {
    name: 'Premium',
    desc: '광택 있는 프리미엄 질감',
    tone: 'balanced',
    ratio: 'aspect-[16/10]', // 원본 1586×992
    inset: '', // Trust 는 줄이고 Premium 은 컬럼을 꽉 채워, 두 오른쪽 끝이 안 맞아떨어지게
    bleed: 'md:-ml-14 lg:-ml-24 xl:-ml-[10rem]', // Trust 보다 왼쪽 — 컨테이너 밖으로
    src: '/work/chaisa/brand/moodboard/polished.webp',
    alt: '밝은 스튜디오에 전시된 광택 있는 검은색 자동차',
  },
]

const RIGHT_TILES = [
  {
    name: 'Character',
    desc: '차를 연상시키는 민첩한 동물, 치타',
    tone: 'balanced',
    ratio: 'aspect-[4/5]', // 원본 908×1137
    inset: '',
    bleed: '',
    src: '/work/chaisa/brand/moodboard/character-cheetah.webp',
    alt: '초원을 질주하는 치타',
  },
  {
    name: 'Clarity',
    desc: '군더더기 없는 명료함',
    tone: 'plain',
    ratio: 'aspect-[9/16]', // 원본 941×1672 — 세로 기둥
    inset: 'md:ml-[40%]', // 왼쪽을 당겨 Character 보다 오른쪽에서 시작
    bleed: 'md:-mr-14 lg:-mr-24 xl:-mr-[10rem]', // Character 보다 오른쪽 — 컨테이너 밖으로
    src: '/work/chaisa/brand/moodboard/clarity.webp',
    alt: '푸른 빛의 대각선 라인이 교차하는 추상 이미지',
  },
]

type Tile = (typeof LEFT_TILES)[number]

function PlaceholderMark() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 text-white/20">
      <svg aria-hidden className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth={1.4} viewBox="0 0 24 24">
        <rect height="18" rx="2.5" width="18" x="3" y="3" />
        <circle cx="8.5" cy="8.5" r="1.6" />
        <path d="m20 16-5-5L5 21" />
      </svg>
      <span className="font-mono text-[10px] uppercase tracking-[0.2em]">image</span>
    </div>
  )
}

function MoodTile({ tile }: { tile: Tile }) {
  const hasBalancedTone = tile.tone === 'balanced'

  return (
    <figure className="group">
      {/* inset·bleed 는 이미지 프레임에만 — 캡션은 컬럼 안에 남아야 잘리지 않는다 */}
      <div
        className={`relative ${tile.ratio} ${tile.inset} ${tile.bleed} overflow-hidden bg-white/[0.04] transition-colors duration-300 group-hover:bg-white/[0.06]`}
      >
        {tile.src ? (
          <>
            <span className="absolute inset-0 block" style={hasBalancedTone ? { filter: BALANCED_IMAGE_FILTER } : undefined}>
              <img
                alt={tr(tile.alt)}
                className="h-full w-full object-cover object-center will-change-[filter,transform]"
                data-mood-image
                loading="lazy"
                src={tile.src}
              />
            </span>
            {hasBalancedTone && (
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{ background: BALANCED_BLUE_OVERLAY, mixBlendMode: 'color' }}
              />
            )}
          </>
        ) : (
          <PlaceholderMark />
        )}
      </div>
      <figcaption className="mt-4 text-[14px]">
        <span className="font-bold text-white">{tile.name}</span>
        <span className="text-white/45"> — {tr(tile.desc)}</span>
      </figcaption>
    </figure>
  )
}

export default function MoodBoard() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let active = true
    let context: { revert: () => void } | undefined

    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([gsapModule, triggerModule]) => {
      if (!active || !rootRef.current) return
      const gsap = gsapModule.gsap
      const ScrollTrigger = triggerModule.ScrollTrigger
      const images = Array.from(root.querySelectorAll<HTMLElement>('[data-mood-image]'))
      gsap.registerPlugin(ScrollTrigger)

      context = gsap.context(() => {
        images.forEach((image) => {
          gsap.fromTo(
            image,
            { filter: 'brightness(0.86)', scale: 1.025 },
            {
              clearProps: 'filter,transform',
              duration: 0.85,
              ease: 'power2.out',
              filter: 'brightness(1)',
              scale: 1,
              scrollTrigger: {
                once: true,
                start: 'top 86%',
                trigger: image,
              },
            },
          )
        })
      }, root)
    })

    return () => {
      active = false
      context?.revert()
    }
  }, [])

  return (
    <Section className="overflow-x-clip !bg-[#080A14]" id="moodboard" theme="dark">
      <div ref={rootRef}>
        <Container className="[text-wrap:pretty] [word-break:keep-all]">
        {/* 헤더 — Overview 레이아웃(라벨 + 타이틀 upper-left + 본문 lower-right) */}
        <Reveal>
          <p
            className="text-[18px] font-semibold leading-[1.4] tracking-[0.14em] text-white/40"
            style={{ fontFamily: 'Archivo, sans-serif' }}
          >
            MOODBOARD
          </p>
        </Reveal>

        <div className="mt-[50px]">
          <Reveal>
            <p className="text-[40px] font-medium leading-[1.4] tracking-[-0.02em] text-white">{tr(INTRO_TITLE)}</p>
          </Reveal>
          <div className="mt-[clamp(2.5rem,5vw,4.5rem)] space-y-6 text-[16px] leading-[1.8] text-white/55 lg:ml-auto lg:w-[46%]">
            {INTRO_BODY.map((paragraph, index) => (
              <Reveal delay={80 + index * 70} key={index}>
                <p>{tr(paragraph)}</p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* 이미지 — 좌/우 독립 컬럼, 각 컬럼 안에서만 세로로 흐른다 */}
        <div className="mt-[clamp(4rem,8vw,7rem)] grid grid-cols-1 items-start gap-x-6 gap-y-12 md:grid-cols-12">
          {/* 왼쪽은 넉넉히 벌리고(아래 참조) 오른쪽은 바짝 붙여, 두 컬럼 바닥이 비슷하게 끝나게 */}
          <div className="flex flex-col gap-[clamp(3.5rem,12vw,12rem)] md:col-span-7 md:col-start-1">
            {LEFT_TILES.map((tile) => (
              <Reveal key={tile.name}>
                <MoodTile tile={tile} />
              </Reveal>
            ))}
          </div>
          {/* 오른쪽 컬럼은 통째로 아래로 내려 왼쪽과 시작선을 어긋나게 */}
          <div className="flex flex-col gap-[clamp(2rem,3vw,3rem)] md:col-span-4 md:col-start-9 md:mt-20">
            {RIGHT_TILES.map((tile) => (
              <Reveal key={tile.name}>
                <MoodTile tile={tile} />
              </Reveal>
            ))}
          </div>
        </div>
        </Container>
      </div>
    </Section>
  )
}
