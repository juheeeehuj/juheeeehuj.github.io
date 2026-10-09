import Reveal from '@studio/witim/Reveal'
import { text, list } from '@studio/lib/field'
import type { Locale, Slot } from '@studio/lib/ia'

type ClosingSequenceProps = {
  sec: Slot
  locale: Locale
  addr: string
}

// addr 을 className 맨 앞에 둔다 — 어드민의 섹션 인라인 미리보기가 `.${addr}` 로
// 해당 섹션을 찾아 잡는다 (IMPL-RULES §4 / FRONTEND-RULES §④-1).
export default function ClosingSequence({ sec, locale, addr }: ClosingSequenceProps) {
  return (
    <footer className={`${addr} flex min-h-dvh flex-col justify-between gap-[20vh] bg-[#0f0f13] px-[5.2vw] py-[16vh] text-white`}>
      <Reveal>
        <h2 className="text-[clamp(4rem,15vw,15rem)] font-black leading-[.78] tracking-[-0.08em]">{text(sec, 'wordmark', locale)}</h2>
        <p className="mt-12 text-[clamp(1.8rem,4vw,4.5rem)] font-bold leading-[1.08] tracking-[-0.04em]">
          {list(sec, 'state').map((item, index) => (
            <span className="block" key={index}>{text(item, 'line', locale)}</span>
          ))}
        </p>
      </Reveal>
      <dl className="grid gap-8 border-t border-white/20 pt-8 sm:grid-cols-2 lg:grid-cols-4">
        {list(sec, 'credits').map((item, index) => (
          <Reveal delay={index * 70} key={index}>
            <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-witim-dark">{text(item, 'label', locale)}</dt>
            <dd className="mt-2 text-sm text-white/55">{text(item, 'value', locale)}</dd>
          </Reveal>
        ))}
      </dl>
    </footer>
  )
}
