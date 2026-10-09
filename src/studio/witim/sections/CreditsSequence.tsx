import Reveal from '@studio/witim/Reveal'
import { image, list, text } from '@studio/lib/field'
import type { Locale, Slot } from '@studio/lib/ia'

// 엔드 크레딧 — 왼쪽에 프로젝트·시기, 오른쪽에 스튜디오·참여자.
// 그 아래 워드마크를 화면 폭 끝까지 눕혀 마지막 장면을 닫는다.
//
// 값은 content/witim.json 에서 오고 여기엔 구조만 남는다(IA §1) —
// 운영자가 어드민에서 고친 게 그대로 화면에 뜬다.
type CreditsSequenceProps = {
  locale: Locale
  sec: Slot
}

export default function CreditsSequence({ locale, sec }: CreditsSequenceProps) {
  const wordmark = image(sec, 'wordmark', locale)

  return (
    <section className="bg-[#0E0F1A] px-[5.2vw] pb-[clamp(2rem,4vw,4.5rem)] pt-[clamp(4rem,8vw,9rem)] text-white">
      <Reveal className="grid gap-y-[clamp(2.5rem,5vw,5rem)] md:grid-cols-[1fr_1.4fr] md:gap-x-[6vw]">
        <div>
          <h2 className="text-[clamp(1.35rem,2vw,2rem)] font-bold leading-[1.2] tracking-[-0.02em]">
            {list(sec, 'project').map((item, index) => (
              <span className="block" key={text(item, 'line', locale) || index}>{text(item, 'line', locale)}</span>
            ))}
          </h2>
          <p className="mt-[clamp(1.75rem,3vw,3rem)] text-[clamp(1.1rem,1.5vw,1.5rem)] tracking-[-0.01em] text-white/85">
            {text(sec, 'date', locale)}
          </p>
        </div>

        <div>
          <h3 className="text-[clamp(1.35rem,2vw,2rem)] font-bold tracking-[-0.02em]">{text(sec, 'studio', locale)}</h3>
          <p className="mt-[clamp(1.75rem,3vw,3rem)] text-[clamp(1.1rem,1.5vw,1.5rem)] font-bold tracking-[-0.01em]">
            {text(sec, 'role', locale)}
          </p>
          <ul className="mt-[clamp(0.85rem,1.5vw,1.5rem)] flex flex-wrap gap-x-[clamp(1.5rem,2.6vw,2.75rem)] gap-y-2 text-[clamp(1.1rem,1.5vw,1.5rem)] tracking-[-0.01em] text-white/85">
            {list(sec, 'designers').map((item, index) => (
              <li key={text(item, 'name', locale) || index}>{text(item, 'name', locale)}</li>
            ))}
          </ul>
        </div>
      </Reveal>

      {wordmark.src ? (
        <Reveal className="mt-[clamp(3.5rem,9vw,10rem)]" delay={140}>
          <img alt={wordmark.alt} className="block h-auto w-full" loading="lazy" src={wordmark.src} />
        </Reveal>
      ) : null}
    </section>
  )
}
