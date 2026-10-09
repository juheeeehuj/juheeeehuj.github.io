import Reveal from '../../primitives/Reveal'
import Container from '../primitives/Container'
import Section from '../primitives/Section'
import { tr } from '../../locale'

/**
 * Project Overview — 히어로 다음에 이어지는 한국어 텍스트 전용 2열 섹션.
 * 카피는 인라인(현재 빌드 방식). 본문 2단락으로 이 케이스가 "브랜드 → 제품 end-to-end"
 * 임을 프레이밍해, 독자가 브랜드 아이덴티티와 제품 경험을 모두 기대하고 읽게 한다.
 */

const INTRO = '차량 케어 서비스 플랫폼, 차이사'

const BODY = [
  '여러 채널에 흩어진 차량 전문 서비스 탐색과 견적 비교를 한 번의 요청으로 연결했습니다. CHAISA는 차주가 모바일 웹에서 필요한 서비스와 조건을 입력하면 관련 전문 업체를 연결하고 견적을 비교할 수 있게 돕는 플랫폼입니다.',
  '이 케이스는 브랜드 아이덴티티부터 제품 경험까지를 하나의 흐름으로 담았습니다. 로고·캐릭터·비주얼 시스템으로 신뢰와 친근함을 세우고, 그 언어를 UX/UI 설계와 구현으로 이어 하나의 제품으로 완성했습니다.',
]

export default function Overview() {
  return (
    <Section className="overflow-hidden !bg-[#010101]" flush id="project-overview" theme="dark">
      <Container className="py-[clamp(6rem,12vw,9rem)] [text-wrap:pretty] [word-break:keep-all] lg:flex lg:h-[1030px] lg:flex-col lg:justify-center lg:py-0">
        <Reveal>
          <p className="text-[18px] font-semibold leading-[1.4] tracking-[0.14em] text-white/45" style={{ fontFamily: 'Archivo, sans-serif' }}>
            OVERVIEW
          </p>
        </Reveal>

        <div className="mt-[50px]">
          <Reveal>
            <p className="text-[40px] font-medium leading-[1.4] tracking-[-0.02em] text-white">
              {tr(INTRO)}
            </p>
          </Reveal>

          {/* 본문 — 타이틀이 끝나는 지점 '아래·우측'으로 배치(대각선 구성) */}
          <div className="mt-[clamp(2.5rem,5vw,4.5rem)] space-y-6 text-[16px] leading-[1.8] text-white/65 lg:ml-auto lg:w-[46%]">
            {BODY.map((paragraph, index) => (
              <Reveal delay={80 + index * 70} key={paragraph}>
                <p>{tr(paragraph)}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
