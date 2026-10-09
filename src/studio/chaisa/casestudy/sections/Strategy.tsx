import Reveal from '../../primitives/Reveal'
import Container from '../primitives/Container'
import Section from '../primitives/Section'
import StrategyColumns from './StrategyColumns'
import { tr } from '../../locale'

/**
 * PROBLEM → SOLUTION (Challenge + UX Strategy 통합 섹션).
 * 헤더(라벨·타이틀·설명은 Overview/MoodBoard와 동일 스케일) + 4쌍 컬럼(모션은 StrategyColumns).
 * 다크 톤(#080A14). 기존 Challenge·DesignGoals 대체. 카피 임시(→ content.ts 이동 가능).
 */

const archivoFont = { fontFamily: 'Archivo, sans-serif' }

const TITLE = '문제에서 시작한 설계'
// (설명 문구는 제거함 — 아래 컬럼이 문제→해결을 직접 보여줘 중복. 복원 시:
//  '차주가 겪던 네 가지 불편을 그대로 뒤집어, 네 가지 설계 원칙으로 삼았습니다.')

export default function Strategy() {
  return (
    <Section className="!bg-[#080A14]" id="strategy" theme="dark">
      <Container className="[text-wrap:pretty] [word-break:keep-all]">
        {/* 헤더 — Overview/MoodBoard와 동일 스케일(라벨 18px semibold, 타이틀 40px, 본문 16px) */}
        <Reveal>
          <p
            className="text-[18px] font-semibold leading-[1.4] tracking-[0.14em] text-white/40"
            style={archivoFont}
          >
            PROBLEM → SOLUTION
          </p>
        </Reveal>

        <div className="mt-[50px]">
          <Reveal>
            <p className="text-[40px] font-medium leading-[1.4] tracking-[-0.02em] text-white">{tr(TITLE)}</p>
          </Reveal>
        </div>

        {/* 4쌍 — Challenge → UX STRATEGY (모션 포함) */}
        <div className="mt-[clamp(4rem,8vw,7rem)]">
          <StrategyColumns />
        </div>
      </Container>
    </Section>
  )
}
