import RefineHero from './sections/RefineHero'
import RefineShowcase from './sections/RefineShowcase'
import OrbitExplain from './sections/OrbitExplain'
import RefineGradient from './sections/RefineGradient'
import RefineMobile from './sections/RefineMobile'
import RefineMoodboard from './sections/RefineMoodboard'
import RefineUIElements from './sections/RefineUIElements'
import RefineType from './sections/RefineType'
import RefineSolution from './sections/RefineSolution'
import RefineCredits from './sections/RefineCredits'
import RefineCMS from './sections/RefineCMS'
import RefineSubPagesShow from './sections/RefineSubPagesShow'
import RefineI18n from './sections/RefineI18n'
import OrbitField from './OrbitField'
import FlowLines from './FlowLines'
import Reveal from './Reveal'
import SectionHeader from './SectionHeader'
import { image, list, text } from '@studio/lib/field'
import { block } from '@studio/lib/content'
import type { Content, Locale } from '@studio/lib/ia'
import data from '@studio/content/refine-clinic.json'

const displayFont = { fontFamily: 'Montserrat, sans-serif' }
const koreanFont = { fontFamily: 'Pretendard, sans-serif' }

const content = data as unknown as Content

// 글·이미지는 모두 content/refine-clinic.json 에서 읽는다 (섹션 18개, ko/en).
export default function RefineCaseStudy({ locale = 'ko' }: { locale?: Locale }) {
  // 섹션 데이터 — content/refine-clinic.json 에서 읽는다(어드민 편집 대상).
  const hero = block(content, 'refine_hero_1')
  const overview = block(content, 'refine_overview_1')
  const process = block(content, 'refine_process_1')
  const identity = block(content, 'refine_identity_1')
  const moodboard = block(content, 'refine_moodboard_1')
  const gradient = block(content, 'refine_gradient_1')
  const ui = block(content, 'refine_ui_1')
  const typo = block(content, 'refine_type_1')
  const solution = block(content, 'refine_solution_1')
  const showcase = block(content, 'refine_showcase_1')
  const i18n = block(content, 'refine_i18n_1')
  const mobile = block(content, 'refine_mobile_1')
  const subpages = block(content, 'refine_subpages_1')
  const cms = block(content, 'refine_cms_1')
  const signature = block(content, 'refine_signature_1')
  const sigItems = list(signature, 'items')
  const closing = block(content, 'refine_closing_1')
  const credits = block(content, 'refine_credits_1')

  return (
    <main className="w-full overflow-hidden bg-[#fbf6f1] text-[#504945] [word-break:keep-all] [text-wrap:pretty]" style={koreanFont}>
      {/* 히어로 — 배경 이미지만 편집(패럴랙스·리빌은 코드 유지). className = IA 주소 */}
      <RefineHero imageSrc={image(hero, 'image', locale).src} imageAlt={image(hero, 'image', locale).alt || 'Refine Clinic — Brand & Website'} className="refine_hero_1" />

      {/* ── Overview ── className = IA 주소(미리보기 격리용) */}
      <section className="refine_overview_1 border-b border-[#e8e4de] px-6 py-28 md:px-16 md:py-40">
        <div className="mx-auto max-w-[1760px]">
          <SectionHeader label={text(overview, 'label', locale)} title={text(overview, 'title', locale)}>
            <div className="space-y-6">
              {list(overview, 'body').map((p, i) => <p key={i}>{text(p, 'paragraph', locale)}</p>)}
            </div>
            <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-[#e8e4de] pt-8">
              {list(overview, 'facts').map((f, i) => (
                <div key={i}>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#b8a99a]" style={displayFont}>{text(f, 'k', locale)}</p>
                  <p className="mt-1.5 text-sm text-[#504945] md:text-[15px]">{text(f, 'v', locale)}</p>
                </div>
              ))}
            </div>
          </SectionHeader>
        </div>
      </section>

      {/* ── Design Approach 01–04 ── */}
      <section className="refine_process_1 bg-[#fcfbf9] px-6 py-28 md:px-16 md:py-44">
        <div className="mx-auto max-w-[1760px]">
          <SectionHeader label={text(process, 'label', locale)} title={text(process, 'title', locale)} />
          <div className="mt-16 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {list(process, 'steps').map((s, i) => (
              <Reveal className="border-t border-[#b8a99a]/40 pt-6" delay={i * 70} key={i}>
                <span className="text-sm text-[#b8a99a]" style={displayFont}>{text(s, 'no', locale)}</span>
                <h3 className="mt-4 text-2xl font-light tracking-[-0.02em] md:text-[1.75rem]" style={displayFont}>{text(s, 'en', locale)}</h3>
                <ul className="mt-6 space-y-3 text-sm leading-[1.7] text-[#6e6560]">
                  {list(s, 'points').map((pt, j) => <li key={j}>{text(pt, 'point', locale)}</li>)}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Moodboard (비주얼 디렉션) ── className = IA 주소 */}
      <RefineMoodboard className="refine_moodboard_1" data={moodboard} locale={locale} />

      {/* ── 브랜드 아이덴티티 — 스토리 + 코어밸류 통합, className = IA 주소 ── */}
      <section className="refine_identity_1 px-6 py-28 md:px-16 md:py-44">
        <div className="mx-auto max-w-[1760px]">
          {/* 브랜드 스토리 (좌우 분할) */}
          <SectionHeader label={text(identity, 'label', locale)} />
          <div className="mt-8 grid gap-16 lg:grid-cols-2 lg:gap-24">
            <Reveal className="group overflow-hidden"><img alt={image(identity, 'image', locale).alt || 'Refine 브랜드 컨셉'} className="h-full min-h-[440px] w-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]" loading="lazy" src={image(identity, 'image', locale).src} /></Reveal>
            <div className="flex flex-col justify-center">
              <Reveal><h2 className="max-w-2xl text-[clamp(2rem,3.6vw,4rem)] font-light leading-[1.2] tracking-[-0.05em]">{text(identity, 'title', locale)}</h2></Reveal>
              <div className="mt-10 max-w-xl space-y-6 text-[15px] leading-[1.95] text-[#6e6560] md:text-base">
                {list(identity, 'body').map((p, i) => <Reveal delay={100 + i * 60} key={i}><p>{text(p, 'paragraph', locale)}</p></Reveal>)}
              </div>
            </div>
          </div>

          {/* 코어 밸류 (밸류 리스트) */}
          <div className="mt-24 border-t border-[#e8e4de]">
            {text(identity, 'valuesLabel', locale) ? <p className="mt-10 text-[11px] uppercase tracking-[0.24em] text-[#b8a99a]" style={displayFont}>{text(identity, 'valuesLabel', locale)}</p> : null}
            {list(identity, 'values').map((item, i) => (
              <Reveal className="grid gap-6 border-b border-[#e8e4de] py-10 md:grid-cols-[90px_1fr_1.2fr] md:gap-10 md:py-12" delay={i * 60} key={i}>
                <span className="text-sm text-[#b8a99a]" style={displayFont}>{text(item, 'no', locale)}</span>
                <div><h3 className="text-4xl font-light tracking-[-0.03em] md:text-5xl" style={displayFont}>{text(item, 'en', locale)}</h3><p className="mt-3 text-lg md:text-xl">{text(item, 'kr', locale)}</p></div>
                <p className="max-w-lg text-sm leading-[1.9] text-[#6e6560] md:text-base">{text(item, 'desc', locale)}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Brand Gradient (스캐터 톤 보드) ── className = IA 주소 */}
      <RefineGradient className="refine_gradient_1" data={gradient} locale={locale} />

      {/* ── UI Elements (톤 시스템) ── className = IA 주소 */}
      <RefineUIElements className="refine_ui_1" data={ui} locale={locale} />

      {/* ── Typography (서체 스펙) ── className = IA 주소 */}
      <RefineType className="refine_type_1" data={typo} locale={locale} />

      {/* ── Signature Interaction (live) ── className = IA 주소 */}
      <section className="refine_signature_1 py-24 md:py-40">
        <div className="mx-auto max-w-[1760px] px-6 md:px-16">
          <SectionHeader label={text(signature, 'label', locale)} title={text(signature, 'title', locale)} />

          <div className="mt-28 md:mt-52"><OrbitExplain data={signature} locale={locale} /></div>
        </div>

        {/* 01 궤도 라인 — 풀블리드 (실제 사이트 소스 그대로 재현) */}
        <Reveal className="mt-10 md:mt-16">
          <div className="relative flex min-h-[64vh] items-end overflow-hidden" style={{ background: 'linear-gradient(180deg, rgb(90,81,73) 0%, rgb(83,74,67) 100%)' }}>
            <OrbitField />
            <div className="relative mx-auto w-full max-w-[1760px] px-6 pb-14 text-[#f3ece3] md:px-16 md:pb-20">
              <span className="text-xs tracking-[0.3em] text-[#c7b6a4]" style={displayFont}>{text(sigItems[0] ?? {}, 'no', locale)}</span>
              <h3 className="mt-3 text-4xl font-light tracking-[-0.03em] md:text-6xl" style={displayFont}>{text(sigItems[0] ?? {}, 'en', locale)}</h3>
              <p className="mt-2 text-lg text-white/70">{text(sigItems[0] ?? {}, 'kr', locale)}</p>
              <p className="mt-6 max-w-lg text-sm leading-[1.9] text-white/60 md:text-base">{text(sigItems[0] ?? {}, 'desc', locale)}</p>
            </div>
          </div>
        </Reveal>

        <div className="mx-auto max-w-[1760px] px-6 md:px-16">
          <Reveal className="mt-40 md:mt-64" delay={60}>
            <div>
              {/* 흐름상 좌측 정렬 — 헤딩 아래로 설명이 자연스럽게 이어짐 */}
              <div className="flex flex-col gap-5">
                <div>
                  <span className="text-xs tracking-[0.3em] text-[#b8a99a]" style={displayFont}>{text(sigItems[1] ?? {}, 'no', locale)}</span>
                  <h3 className="mt-2 text-3xl font-light tracking-[-0.03em] md:text-5xl" style={displayFont}>{text(sigItems[1] ?? {}, 'en', locale)}</h3>
                  <p className="mt-1 text-base text-[#6e6560]">{text(sigItems[1] ?? {}, 'kr', locale)}</p>
                </div>
                <p className="max-w-xl text-sm leading-[1.85] text-[#6e6560] md:text-base">{text(sigItems[1] ?? {}, 'desc', locale)}</p>
              </div>
              <div className="mt-10 grid grid-cols-2 gap-2 md:grid-cols-4">
                {list(signature, 'layers').map((layer, i) => {
                  const img = image(layer, 'image', locale)
                  return (
                    <div className="group relative aspect-[4/5] overflow-hidden rounded-[6px] bg-[#f2e7da] transition-transform duration-500 ease-out hover:-translate-y-1.5" key={i}>
                      <img alt={img.alt || text(layer, 'en', locale)} className="h-full w-full object-cover" loading="lazy" src={img.src} />
                      {/* 실제 사이트 소스 그대로: 4카드가 이어지는 흐르는 라인 (viewBox x-오프셋) */}
                      <FlowLines index={i} />
                      <span className="absolute bottom-3 left-3 z-[1] rounded-[4px] bg-black/30 px-2.5 py-1 text-[11px] font-medium text-white/95 backdrop-blur-sm">{text(layer, 'kr', locale)}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Solution Contents (편집형 콘텐츠 전략) ── className = IA 주소 */}
      <RefineSolution className="refine_solution_1" data={solution} locale={locale} />

      {/* ── Website Showcase ── className = IA 주소 */}
      <RefineShowcase className="refine_showcase_1" data={showcase} locale={locale} />

      {/* ── i18n (다국어 GNB) ── className = IA 주소 */}
      <RefineI18n className="refine_i18n_1" data={i18n} locale={locale} />

      {/* ── Mobile Responsive Showcase ── className = IA 주소 */}
      <RefineMobile className="refine_mobile_1" data={mobile} locale={locale} />

      {/* ── Sub Pages (하위 페이지 순회 영상, 배경 라인 겹침) ── className = IA 주소 */}
      <RefineSubPagesShow className="refine_subpages_1" data={subpages} locale={locale} />

      {/* ── Custom CMS (관리자 페이지) ── className = IA 주소 */}
      <RefineCMS className="refine_cms_1" data={cms} locale={locale} />

      {/* ── Closing ── className = IA 주소 */}
      <section className="refine_closing_1 flex min-h-[80dvh] items-center justify-center bg-[#f2e7da] px-6 py-28 text-center">
        <Reveal className="flex flex-col items-center">
          <img alt={image(closing, 'logo', locale).alt || 'Refine Clinic'} className="w-32 md:w-44" loading="lazy" src={image(closing, 'logo', locale).src} />
          <h2 className="mt-12 text-[clamp(2.2rem,4.5vw,5rem)] font-light tracking-[-0.05em]">{text(closing, 'line', locale)}</h2>
          <p className="mt-12 text-[10px] uppercase tracking-[0.25em] text-[#6e6560]" style={displayFont}>{text(closing, 'caption', locale)}</p>
        </Reveal>
      </section>

      {/* ── Credits (피날레) ── className = IA 주소 */}
      <RefineCredits className="refine_credits_1" data={credits} locale={locale} />
    </main>
  )
}
