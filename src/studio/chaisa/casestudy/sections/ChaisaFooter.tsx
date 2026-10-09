import Reveal from '../../primitives/Reveal'
import Container from '../primitives/Container'
import Section from '../primitives/Section'
import { tr } from '../../locale'

/**
 * CHAISA FOOTER — 케이스 스터디 피날레. 위팀·리파인 푸터를 참고하되 CHAISA 전용으로 간결화한 다크 마무리.
 * 배경 #0C1120(브랜드 Dark Navy) — 바로 위 BrandPromise(#07142f) 다크와 매끄럽게 이어진다.
 *
 * 구성: (1) 크레딧 그리드(위팀식 라벨/값 4열)
 *      (2) 최하단 바 — 좌: 작은 차이사 로고 + 슬로건("The Right Choice for Your Car") / 우: 저작권.
 *
 * ※ 크레딧 값(프로젝트명·시기·디자이너)은 임시 하드코딩 — 확정 후 조정.
 */

const ARCHIVO = { fontFamily: 'Archivo, sans-serif' } as const

const CREDITS = [
  { label: 'PROJECT', value: 'Chisa Brand Experience' },
  { label: 'PERIOD', value: '2026.6' },
  { label: 'STUDIO', value: 'WITIM AX STUDIO' },
  { label: 'DESIGNER', value: 'Aeji Jung · Juyeon Park · Juhee Oh' },
]

export default function ChaisaFooter() {
  return (
    <Section className="overflow-hidden !bg-[#0C1120]" id="footer" theme="dark">
      <Container className="[text-wrap:pretty] [word-break:keep-all]">
        {/* 1) 크레딧 — 라벨/값 묶음을 justify-between 으로 자동 간격 분배.
             첫 묶음은 좌측 끝(하단 로고와 정렬), 마지막 묶음은 우측 끝(저작권과 정렬).
             각 묶음 내부는 왼쪽 정렬이라 라벨이 값 시작점 위에 온다. */}
        <dl className="flex flex-col gap-y-10 lg:flex-row lg:justify-between lg:gap-y-0">
          {CREDITS.map((c, i) => (
            <Reveal delay={i * 70} key={c.label}>
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                {c.label}
              </dt>
              <dd className="mt-2.5 text-[14px] leading-[1.6] text-white/70">{c.value}</dd>
            </Reveal>
          ))}
        </dl>

        {/* 2) 최하단 바 — 좌: 작은 로고 + 슬로건 / 우: 저작권 */}
        <div className="mt-[clamp(3.5rem,7vw,6rem)] flex flex-col gap-4 border-t border-white/10 pt-6 text-[11px] text-white/30 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <img
              alt={tr('차이사 로고')}
              className="h-auto w-[5.5rem]"
              src="/work/chaisa/brand/logo/logo-white.webp"
            />
            <span className="text-[12px] tracking-[0.01em] text-white/50" style={ARCHIVO}>
              The Right Choice for Your Car
            </span>
          </div>
          <span>© 2026 WITIM AX STUDIO. All rights reserved.</span>
        </div>
      </Container>
    </Section>
  )
}
