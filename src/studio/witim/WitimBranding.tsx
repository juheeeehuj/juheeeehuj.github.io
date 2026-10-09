import ApplicationSequence from './sections/ApplicationSequence'
import CreditsSequence from './sections/CreditsSequence'
import DesignSystemSection from './sections/DesignSystemSection'
import LayoutBlocks from './sections/LayoutBlocks'
import MontageSequence from './sections/MontageSequence'
import PaletteSequence from './sections/PaletteSequence'
import SystemSequence from './sections/SystemSequence'
import { block, renderableAddresses, sectionType } from '@studio/lib/content'
import type { Content, Locale, Slot } from '@studio/lib/ia'
import data from '@studio/content/witim.json'

const content = data as unknown as Content

// BX 브랜딩 페이지. 순서와 종류를 데이터(content/witim.json 의 _meta)가 정한다 —
// 운영자가 어드민에서 섹션을 끌어 옮기면 이 페이지의 순서가 그대로 바뀌고,
// 각 섹션의 글·이미지·영상도 전부 어드민에서 편집한다(전 섹션 JSON 구동).
type SectionProps = { locale: Locale; sec: Slot }

const TYPED: Record<string, (props: SectionProps) => React.ReactNode> = {
  system: SystemSequence,
  palette: PaletteSequence,
  tokens: DesignSystemSection,
  montage: MontageSequence,
  applied: ApplicationSequence,
  credits: CreditsSequence,
  blocks: LayoutBlocks,
}

export default function WitimBranding({ locale = 'ko' }: { locale?: Locale }) {

  return (
    <main className="w-full overflow-hidden bg-[#0f0f13] text-white">
      {renderableAddresses(content).map((address) => {
        const Section = TYPED[sectionType(content, address) ?? '']
        if (!Section) return null
        // className = IA 주소. 어드민 미리보기가 이 클래스로 섹션을 찾아 격리한다
        // (content-sync 규칙: className === IA address). 사이트 스타일엔 영향 없다.
        return (
          <div key={address} className={address}>
            <Section locale={locale} sec={block(content, address)} />
          </div>
        )
      })}
    </main>
  )
}
