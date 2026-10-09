'use client'

import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import { TOKEN_BG, TOKEN_CARDS, TOKEN_FRAME } from './cards'

// 카드는 화면 가운데 한 점에 겹쳐 쌓인 채로 시작해, 관찰자 쪽으로 커지며 바깥으로
// 퍼진다. 물러날 때는 그 반대 — 다시 모이며 작아져 깊이 속으로 사라진다.
// 평면에서 색만 바꾸면 "같은 자리"는 보여도 세트가 갈리는 인상이 안 난다.
const COLLAPSED_SCALE = 0.34
// 완전히 한 점으로 모으지 않는다 — 살짝 흩어진 채 쌓여야 카드 더미로 읽힌다.
const CONVERGE = 0.88

const EXPAND = 0.95
const COLLAPSE = 0.7
const HOLD = 1.9
// 나가는 세트가 절반쯤 접혔을 때 다음 세트가 나오기 시작한다
const OVERLAP = 0.34
const TAIL = 0.7

const LIGHT_CARDS = TOKEN_CARDS.filter((card) => card.phase !== 'dark')
const DARK_CARDS = TOKEN_CARDS.filter((card) => card.phase !== 'light')

type TokenMotionProps = {
  /** 녹화용 배속. 1보다 작으면 느리게 재생된다 */
  speed?: number
}

export default function TokenMotion({ speed = 1 }: TokenMotionProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    let ctx: gsap.Context | null = null
    let cancelled = false

    // 이미지가 다 그려진 뒤에 재야 카드 높이가 잡힌다 — 그 전엔 offsetHeight 가 0 이다.
    const images = Array.from(root.querySelectorAll('img'))
    const loaded = Promise.all(
      images.map((image) => (image.complete ? Promise.resolve() : new Promise((resolve) => {
        image.addEventListener('load', resolve, { once: true })
        image.addEventListener('error', resolve, { once: true })
      }))),
    )

    loaded.then(() => {
      if (cancelled) return

      // 각 카드가 "모였을 때" 있어야 할 위치 = 프레임 중심으로 당긴 거리.
      // 레이아웃 값(offset*)으로 재야 transform 이 걸려도 값이 흔들리지 않는다.
      const convergeOf = (element: HTMLElement) => ({
        x: (TOKEN_FRAME.width / 2 - (element.offsetLeft + element.offsetWidth / 2)) * CONVERGE,
        y: (TOKEN_FRAME.height / 2 - (element.offsetTop + element.offsetHeight / 2)) * CONVERGE,
      })

      ctx = gsap.context(() => {
        gsap.set('[data-drift]', { transformOrigin: 'center center' })

        // 떠다니는 움직임은 안쪽 래퍼에 건다 — 바깥 래퍼는 확장/수축이 x,y 를 쓴다.
        TOKEN_CARDS.forEach((card) => {
          gsap.to(`[data-drift="${card.slug}"]`, {
            duration: card.period,
            ease: 'sine.inOut',
            repeat: -1,
            x: card.driftX,
            y: card.driftY,
            yoyo: true,
          })
        })

        const collapsed = {
          opacity: 0,
          scale: COLLAPSED_SCALE,
          x: (_: number, element: HTMLElement) => convergeOf(element).x,
          y: (_: number, element: HTMLElement) => convergeOf(element).y,
        }

        gsap.set('[data-theme]', collapsed)

        const master = gsap.timeline({
          onComplete: () => {
            window.__TOKENS_DONE = true
          },
        })

        const expand = (theme: string, at: number) => {
          master.to(`[data-theme="${theme}"]`, {
            duration: EXPAND,
            ease: 'power3.out',
            opacity: 1,
            scale: 1,
            stagger: { amount: 0.4, from: 'center' },
            x: 0,
            y: 0,
          }, at)
        }

        const collapse = (theme: string, at: number) => {
          master.to(`[data-theme="${theme}"]`, {
            duration: COLLAPSE,
            ease: 'power2.in',
            ...collapsed,
            stagger: { amount: 0.3, from: 'edges' },
          }, at)
        }

        // 시작과 끝을 둘 다 "다 접힌 빈 화면"으로 맞춘다 — 그래야 루프가 이어붙어도
        // 이음매가 안 보인다. 끝에 라이트를 한 번 더 펴면 이음매는 지워지지만
        // 라이트가 두 번 나오고, 영상이 그 직후 끝나 덜 펴진 채로 잘린다.
        const lightOut = EXPAND + HOLD
        const darkIn = lightOut + OVERLAP
        const darkOut = darkIn + EXPAND + HOLD

        expand('light', 0)
        collapse('light', lightOut)
        master.to(root, { background: TOKEN_BG.dark, duration: COLLAPSE + OVERLAP, ease: 'power1.inOut' }, lightOut)
        expand('dark', darkIn)

        collapse('dark', darkOut)
        master.to(root, { background: TOKEN_BG.light, duration: COLLAPSE + OVERLAP, ease: 'power1.inOut' }, darkOut)
        master.to({}, { duration: TAIL }, darkOut + COLLAPSE)

        gsap.globalTimeline.timeScale(speed)
      }, root)

      window.__TOKENS_READY = true
    })

    return () => {
      cancelled = true
      ctx?.revert()
    }
  }, [speed])

  return (
    <div
      className="relative overflow-hidden"
      ref={rootRef}
      style={{ background: TOKEN_BG.light, height: TOKEN_FRAME.height, width: TOKEN_FRAME.width }}
    >
      {/* 라이트·다크를 각각 독립된 카드로 깐다. 짝이 있는 컴포넌트는 좌표가 같아서
          다크가 라이트가 있던 자리에 그대로 내려앉는다. */}
      {(['light', 'dark'] as const).flatMap((theme) =>
        (theme === 'light' ? LIGHT_CARDS : DARK_CARDS).map((card) => (
          <div
            className="absolute will-change-transform"
            data-theme={theme}
            key={`${theme}-${card.slug}`}
            style={{ left: card.x, top: card.y, width: card.width, zIndex: card.z }}
          >
            <div data-drift={card.slug}>
              <img alt="" className="block w-full" src={`/work/witim-identity/components/${theme}/${card.slug}.webp`} />
            </div>
          </div>
        )),
      )}
    </div>
  )
}

declare global {
  interface Window {
    __TOKENS_READY?: boolean
    __TOKENS_DONE?: boolean
  }
}
