import BillboardHero from './sections/BillboardHero'
import Cover from './sections/Cover'
import Overview from './sections/Overview'
import BrandPromise from './sections/BrandPromise'
import Strategy from './sections/Strategy'
import MoodBoard from './sections/MoodBoard'
import LogoConstruction from './sections/LogoConstruction'
import CharacterSection from './sections/CharacterSection'
import ColorTypography from './sections/ColorTypography'
import UiDesign from './sections/UiDesign'
import UiSocialShowcase from './sections/UiSocialShowcase'
import BrandApplicationsShowcase from './sections/BrandApplicationsShowcase'
import Mockup from './sections/Mockup'
import ClosingVisual from './sections/ClosingVisual'
import ChaisaFooter from './sections/ChaisaFooter'
import { setLocale } from '../locale'
import type { Locale } from '@studio/lib/ia'

/**
 * CHAISA 오리지널 케이스 스터디 (위팀·리파인 패밀리).
 * 레이아웃 규칙: 히어로·이미지 = 풀블리드 / 텍스트 = <Container> max-w-[1440px].
 * content.ts 의 16섹션 서사를 순서대로 이관 중 — 현재 Cover·Overview·Challenge 슬라이스.
 */
export default function ChaisaCaseStudy({ locale = 'ko' }: { locale?: Locale }) {
  setLocale(locale)
  return (
    <main
      className="chaisa-case-study w-full overflow-x-hidden bg-white text-chaisa-ink"
      data-case-study="chaisa"
      data-desktop-qa-viewport="1920"
    >
      <BillboardHero />
      <Overview />
      <Cover />
      <Strategy />
      <MoodBoard />
      <LogoConstruction />
      <CharacterSection />
      <ColorTypography />
      <UiDesign />
      <UiSocialShowcase />
      <BrandApplicationsShowcase />
      <Mockup />
      <BrandPromise />
      <ClosingVisual />
      <ChaisaFooter />
    </main>
  )
}
