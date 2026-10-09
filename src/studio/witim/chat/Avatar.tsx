import type { MemberStatus } from './data'
import type { ChatTheme } from './theme'

// 얼굴은 지급된 소재(public/witim/chat/avatars/{light,dark}/*.png)를 그대로 쓴다.
// 손으로 그린 SVG 로 근사하면 귀·눈 곡률이 원본과 어긋난다.
//
// 배지만 얹는 이유: 머리색 6종 × 상태 3종 = 18 조합인데 소재는 머리색 6장과
// 상태 4종(라벤더 머리에만)뿐이라, 조합을 다 구운 소재가 없다.
// 배지 색은 라이트·다크가 같아서 한 벌만 둔다(소재에서 샘플링한 실제 값).
const SPRITE_HAIR: Array<[string, string]> = [
  ['#D6D9E4', 'gray'],
  ['#CAD0FF', 'lavender'],
  ['#C0E8CD', 'green'],
  ['#FFDDB2', 'orange'],
  ['#FFCACA', 'pink'],
  ['#C0E4F5', 'sky'],
]

const BADGE_FILL: Record<MemberStatus, string> = {
  away: '#51536A',
  offline: '#9192A4',
  online: '#455FFF',
}

// 소재 타일(140) 기준 배지 지름 40, 중심 (118,121)
const BADGE_SIZE = 40 / 140
const BADGE_CENTER = 118 / 140

function channels(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number]
}

// data.ts 의 머리색은 소재와 미세하게 다르다(#D5D8E3 vs #D6D9E4). 이름으로 못 맞추니
// 가장 가까운 소재를 고른다 — 값이 조금 흔들려도 같은 소재로 붙는다.
function spriteFor(hair: string): string {
  const target = channels(hair)
  let best = SPRITE_HAIR[0]
  let bestDistance = Infinity

  for (const entry of SPRITE_HAIR) {
    const source = channels(entry[0])
    const distance = source.reduce((sum, value, i) => sum + (value - target[i]) ** 2, 0)
    if (distance < bestDistance) {
      bestDistance = distance
      best = entry
    }
  }

  return best[1]
}

type AvatarProps = {
  size: number
  hair: string
  status?: MemberStatus
  /** 상태 배지 테두리에 쓸 배경색 — 아바타가 얹힌 면의 색을 넘긴다 */
  ringColor: string
  /** 라이트·다크는 소재가 다르다 — 고양이 둘레의 링 색이 갈린다 */
  theme: ChatTheme
}

export default function Avatar({ size, hair, status, ringColor, theme }: AvatarProps) {
  const badge = size * BADGE_SIZE
  const offset = size * BADGE_CENTER - badge / 2

  return (
    <span className="relative shrink-0 leading-none" style={{ height: size, width: size }}>
      <img
        alt=""
        className="block h-full w-full"
        src={`/work/witim-identity/chat/avatars/${theme}/${spriteFor(hair)}.webp`}
        style={{ filter: status === 'offline' ? 'saturate(0)' : undefined }}
      />
      {status ? (
        <span
          className="absolute grid place-items-center rounded-full font-bold text-white"
          style={{
            background: BADGE_FILL[status],
            boxShadow: `0 0 0 ${Math.max(1.5, size * 0.045)}px ${ringColor}`,
            fontSize: badge * 0.62,
            height: badge,
            left: offset,
            top: offset,
            width: badge,
          }}
        >
          {status === 'away' ? 'z' : null}
        </span>
      ) : null}
    </span>
  )
}
