import Reveal from '@studio/witim/Reveal'
import GridShell from '@studio/witim/grid/GridShell'
import { image, list, text } from '@studio/lib/field'
import type { Locale, Slot } from '@studio/lib/ia'

// 검은 테는 box-shadow 로 바깥에 두른다 — border 로 주면 그만큼 화면이 안으로 밀려
// 영상이 작아진다. 테 뒤로 옅은 그림자를 한 겹 더 깔아 화면이 지면에서 살짝 뜨게 한다.
function ChatScreen({ alt, src }: { alt: string; src: string }) {
  return (
    <video
      aria-label={alt}
      autoPlay
      className="block h-auto w-full rounded-[10px] shadow-[0_0_0_10px_#000,0_22px_48px_#00000033]"
      loop
      muted
      playsInline
      preload="metadata"
      src={src}
    />
  )
}

// 라벨은 화면을 가리키는 게 아니라 지면에 옅게 깔리는 워터마크다 — 검정으로 두면
// 화면과 무게가 같아 대각선 흐름을 끊는다. 옅은 회색으로 빼서 배경 활자로 물러나게 한다.
function ThemeLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[clamp(3rem,9vw,11rem)] font-bold leading-none tracking-[-0.04em] text-black/15">{children}</p>
}

// 값은 content/witim.json 에서 오고 여기엔 구조만 남는다(IA §1).
type DesignSystemSectionProps = {
  locale: Locale
  sec: Slot
}

export default function DesignSystemSection({ locale, sec }: DesignSystemSectionProps) {
  const motion = image(sec, 'motion', locale)
  const mobile = image(sec, 'mobile', locale)
  const clips = list(sec, 'clips')
  const light = { theme: text(clips[0] ?? {}, 'theme', locale), ...image(clips[0] ?? {}, 'video', locale) }
  const dark = { theme: text(clips[1] ?? {}, 'theme', locale), ...image(clips[1] ?? {}, 'video', locale) }

  return (
    <GridShell>
      <div className="grid gap-x-[6vw] gap-y-6 border-t border-black/80 pt-[clamp(1.5rem,2vw,2.5rem)] pb-[clamp(2rem,3vw,3.5rem)] md:grid-cols-2">
        <h2 className="text-[clamp(1.15rem,1.6vw,1.6rem)] font-bold tracking-[-0.02em]">{text(sec, 'eyebrow', locale)}</h2>
        <div>
          <h3 className="text-[clamp(1.5rem,2.4vw,2.4rem)] font-bold leading-[1.15] tracking-[-0.02em]">
            {text(sec, 'headline', locale)}<span className="text-black/35">{text(sec, 'headlineMuted', locale)}</span>
          </h3>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-black/50 md:text-lg">{text(sec, 'lead', locale)}</p>
        </div>
      </div>

      {/* 카드가 제자리에서 색만 갈아입는 모션 — 헤드라인이 가리키는 대상이다 */}
      <Reveal>
        <video
          aria-label={motion.alt}
          autoPlay
          className="block h-auto w-full"
          loop
          muted
          playsInline
          preload="metadata"
          src={motion.src}
        />
      </Reveal>

      {/* 12열 위에 화면을 엇갈려 얹는다 — 2열로 나누면 화면이 절반까지밖에 못 커진다.
          라이트는 왼쪽에 붙고 라벨이 오른쪽 끝에서 마주 본다. 다크는 라벨을 화면 위에
          얹어 옆자리를 비우지 않으므로, 그만큼 화면을 넓게 편다. */}
      <div className="mt-[clamp(4rem,10vw,12rem)] grid gap-y-[clamp(4rem,9.5vw,11rem)] md:grid-cols-12 md:items-start">
        <Reveal className="md:col-span-8 md:col-start-1 md:row-start-1">
          <ChatScreen alt={light.alt} src={light.src} />
        </Reveal>

        {/* 라이트 라벨은 화면 반대편 끝 — 좌우로 벌어져 대각선이 크게 읽힌다.
            폰은 md 부터 absolute 로 흐름에서 뺀다 — 흐름에 두면 폰 높이만큼 1행이
            길어져 그 아래 다크 행이 통째로 밀린다(빈 공간이 생기던 원인). 흐름에서
            빼면 1행 높이는 라이트 데스크탑만큼이라 다크가 바로 아래로 붙는다.
            위치·크기는 vw 기준 — 데스크탑 영상 높이도 vw 에 비례하므로 rem 으로 잡으면
            화면이 넓어질수록 폰만 제자리에 남아 비율이 깨진다. */}
        <Reveal className="md:relative md:col-span-4 md:col-start-9 md:row-start-1 md:text-right" delay={70}>
          <ThemeLabel>{light.theme}</ThemeLabel>
          <video
            aria-label={mobile.alt}
            autoPlay
            className="z-10 mx-auto mt-[clamp(2rem,8vw,3rem)] block h-auto w-[clamp(13rem,24vw,30rem)] rounded-[16px] shadow-[0_0_0_10px_#000,0_22px_48px_#00000033] md:absolute md:right-0 md:top-[clamp(4rem,19vw,28rem)] md:mx-0 md:mt-0"
            loop
            muted
            playsInline
            preload="metadata"
            src={mobile.src}
          />
        </Reveal>

        {/* 다크는 라벨이 화면 위에 얹혀 한 칸으로 묶이고, 라이트와 같은 왼쪽 세로줄에
            선다. 폭은 9열까지만 — 오른쪽 끝까지 펴면 위로 끌어올렸을 때 오른쪽
            거터의 폰과 겹친다. 폰 왼쪽 앞에서 멈춰 충돌을 피한다. */}
        <Reveal className="md:col-span-8 md:col-start-1 md:row-start-2" delay={70}>
          <ThemeLabel>{dark.theme}</ThemeLabel>
          <div className="mt-[clamp(1.5rem,4vw,3.5rem)]">
            <ChatScreen alt={dark.alt} src={dark.src} />
          </div>
        </Reveal>
      </div>
    </GridShell>
  )
}
