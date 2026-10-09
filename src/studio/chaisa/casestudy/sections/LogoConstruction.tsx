import type { ReactNode } from 'react'
import Reveal from '../../primitives/Reveal'
import Container from '../primitives/Container'
import Section from '../primitives/Section'
import { tr } from '../../locale'

/**
 * LOGO CONSTRUCTION — MoodBoard 다음. 라벨 + 타이틀·설명 + 로고 컨스트럭션 이미지(1440 채움)
 * + 치타 궤적 → 스피드 라인 모션 비주얼(구 SignatureMotif 에서 이관).
 * 다크 톤(#080A14, MoodBoard와 통일).
 */

const BRAND_BLUE = '#007AFF'

const TITLE = '속도를 새긴 로고타입'

const BODY =
  '치타의 민첩함에서 온 스피드 라인을 글자에 심어, 멈춰 있어도 질주하는 로고타입을 만들었습니다. 기하학 그리드 위에서 비례와 기울기를 다듬어 역동성과 정제된 완성도를 함께 잡았습니다.'

function SpecLabel({ children }: { children: ReactNode }) {
  return (
    <span className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-white/45">
      {children}
    </span>
  )
}

export default function LogoConstruction() {
  return (
    <Section className="overflow-hidden !bg-[#080A14]" id="logo-construction" theme="dark">
      <Container className="[text-wrap:pretty] [word-break:keep-all]">
        {/* 헤더 — MoodBoard와 동일 레이아웃(라벨 + 타이틀 upper-left + 설명 lower-right) */}
        <Reveal>
          <p
            className="text-[18px] font-semibold leading-[1.4] tracking-[0.14em] text-white/40"
            style={{ fontFamily: 'Archivo, sans-serif' }}
          >
            LOGO CONSTRUCTION
          </p>
        </Reveal>

        <div className="mt-[50px]">
          <Reveal>
            <p className="text-[40px] font-medium leading-[1.4] tracking-[-0.02em] text-white">{tr(TITLE)}</p>
          </Reveal>
          <div className="mt-[clamp(2.5rem,5vw,4.5rem)] text-[16px] leading-[1.8] text-white/55 lg:ml-auto lg:w-[46%]">
            <Reveal delay={80}>
              <p>{tr(BODY)}</p>
            </Reveal>
          </div>
        </div>

        {/*
         * 콜라주 — lg 이상에서만. 네 조각을 %로 절대배치해 서로 겹치게 하고, 컨테이너는
         * mx 의 calc 로 뷰포트 전체 폭이 된다(50% = 컨테이너 콘텐츠 폭의 절반).
         * 로고는 왼쪽 엣지, 크롬은 오른쪽 밖으로 흘려보내고(Section 의 overflow-hidden 이 자름),
         * 치타 모션이 로고 아래를 물고, 명함이 그 위에 올라앉는다.
         * z 는 로고 0 < 크롬 10 < 모션 20 < 명함 30.
         * lg 미만에서는 전부 static 이라 그냥 세로로 쌓인다.
         */}
        <div
          aria-label={tr('차이사 로고 컨스트럭션과 브랜드 애플리케이션')}
          className="mt-[clamp(4rem,8vw,7rem)] flex flex-col gap-6 lg:relative lg:mx-[calc(50%_-_50vw)] lg:block lg:aspect-[1518/832]"
        >
          {/* 1) 로고 — 왼쪽 엣지에 붙는 바닥 레이어 */}
          <Reveal className="block lg:absolute lg:left-0 lg:top-[5%] lg:z-0 lg:w-[53.5%]">
            <figure className="relative aspect-[12/7] overflow-hidden">
              <img
                alt={tr('차이사 로고 컨스트럭션 — 스피드 라인과 그리드 가이드')}
                className="h-full w-full object-cover object-center"
                loading="lazy"
                src="/work/chaisa/brand/logo-construction.webp"
              />
            </figure>
          </Reveal>

          {/* 2) 크롬 창 — 오른쪽 화면 밖으로 흘러나간다. 파란 배경을 벗겨낸 chrome-window.png.
              폭 62% 는 탭 제목("차이사 — 내 차에 딱 맞는 업체")이 잘리기 직전까지 보이는 값 */}
          <Reveal className="block lg:absolute lg:left-[62%] lg:top-[14%] lg:z-10 lg:w-[62%]" delay={100}>
            <figure className="relative">
              <img
                alt={tr('차이사 크롬 브라우저 탭·주소창 목업')}
                className="block w-full"
                loading="lazy"
                src="/work/chaisa/brand/applications/chrome-window.webp"
              />
            </figure>
          </Reveal>

          {/* 3) 명함 — 크롬과 모션 위에 올라앉는 최상단 레이어 */}
          <Reveal
            className="block lg:absolute lg:left-[54%] lg:top-[36%] lg:z-30 lg:w-[27%]"
            delay={160}
          >
            <figure className="relative">
              {/*
               * 명함 바탕(#111110)과 섹션 배경(#080A14)의 명도 대비가 1.13:1 이라
               * 헤일로가 없으면 카드가 배경에 묻힌다.
               */}
              <div aria-hidden className="absolute inset-[6%] -z-10 bg-white/[0.07] blur-[64px]" />
              <img
                alt={tr('차이사 블랙 명함 목업 — 이름·직함·연락처 면')}
                className="block w-full"
                loading="lazy"
                src="/work/chaisa/brand/applications/business-card-mockup-back.webp"
              />
            </figure>
          </Reveal>

          {/* 4) 치타 궤적 → 스피드 라인 모션 — 로고 아래를 물고 오른쪽 엣지까지 */}
          <Reveal
            className="block lg:absolute lg:bottom-0 lg:left-[36%] lg:right-0 lg:top-[53%] lg:z-20"
            delay={200}
          >
            <figure className="relative min-h-[520px] overflow-hidden border border-white/10 bg-[#02050e] sm:min-h-[600px] lg:h-full lg:min-h-0 lg:border-r-0">
            <img
              alt={tr('007AFF 블루 빛의 궤적을 따라 달리는 자동차')}
              className="absolute inset-0 h-full w-full object-cover object-center opacity-80"
              loading="lazy"
              src="/work/chaisa/brand/moodboard/chaisa-blue-motion-car.webp"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-[#02050e] via-[#02050e]/55 to-[#007AFF]/10" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#02050e] via-transparent to-[#02050e]/20" />

            <div className="absolute bottom-0 left-0 top-0 w-[58%] max-w-[680px] overflow-hidden">
              <img
                alt=""
                className="absolute -bottom-[2%] -left-[30%] h-[82%] w-[135%] max-w-none object-cover object-right grayscale contrast-125 opacity-40 mix-blend-screen sm:-left-[18%] sm:h-[92%] lg:-left-[8%]"
                loading="lazy"
                src="/work/chaisa/brand/moodboard/character-cheetah.webp"
              />
              <div aria-hidden className="absolute inset-0 bg-[#007AFF] opacity-55 mix-blend-color" />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-[#02050e]/25 via-transparent to-[#02050e]" />
            </div>

            <svg
              aria-hidden
              className="absolute inset-0 h-full w-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 1200 620"
            >
              <path
                d="M132 442C310 290 424 270 560 346C705 427 790 314 1090 162"
                opacity=".28"
                stroke="white"
                strokeDasharray="2 15"
                strokeLinecap="round"
                strokeWidth="3"
              />
              <path
                d="M132 442C310 290 424 270 560 346C705 427 790 314 1090 162"
                stroke={BRAND_BLUE}
                strokeLinecap="round"
                strokeWidth="2"
              />
              <circle cx="132" cy="442" fill={BRAND_BLUE} r="8" />
              <circle cx="1090" cy="162" fill="white" r="6" />
            </svg>

            <div className="absolute inset-x-5 top-5 flex items-center sm:inset-x-8 sm:top-8">
              <SpecLabel>CHEETAH TRAJECTORY</SpecLabel>
            </div>

            <figcaption className="absolute bottom-6 left-5 max-w-[220px] text-[13px] leading-[1.7] text-white/55 sm:bottom-8 sm:left-8 sm:max-w-[300px]">
              {tr('치타의 질주 궤적이 스피드 라인이 되고,')}
              <br className="hidden sm:block" />{' '}{tr('다음 장면의 캐릭터로 이어집니다.')}
            </figcaption>
            </figure>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}
