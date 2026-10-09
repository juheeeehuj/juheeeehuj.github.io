import type { Content, Slot } from './ia'

// AX Studio 의 lib/content·lib/cms 에서 화면을 그리는 데 필요한 것만 옮겼다.
// 원본은 어드민(CMS)이 고치는 JSON 을 서버에서 읽지만, 여기서는 빌드할 때 JSON 을 그대로 불러온다.

export function block(content: Content, address: string): Slot {
  const direct = content[address] as Slot | undefined
  if (direct && address !== '_meta') return direct
  return {} as Slot
}

export function sectionType(content: Content, address: string): string | undefined {
  return content._meta?.types?.[address]
}

/** 화면에 그릴 섹션 주소: `_meta.order` 순, 숨김(`_meta.hidden`) 제외. */
export function renderableAddresses(content: Content): string[] {
  const keys = Object.keys(content).filter((k) => k !== '_meta')
  const hidden = new Set(content._meta?.hidden ?? [])
  const order = content._meta?.order
  const known = new Set(keys)
  const seen = new Set<string>()
  const out: string[] = []
  for (const a of order ?? []) {
    if (known.has(a) && !seen.has(a)) {
      out.push(a)
      seen.add(a)
    }
  }
  for (const a of keys) if (!seen.has(a)) out.push(a)
  return out.filter((a) => !hidden.has(a))
}

/** 배경색이 어두운지 — 어두우면 글자를 밝게 뒤집는다(대비). #rrggbb 기준 상대휘도. */
export function isDarkColor(hex: string): boolean {
  const m = hex.trim().match(/^#?([0-9a-fA-F]{6})$/)
  if (!m) return false
  const n = parseInt(m[1], 16)
  const r = (n >> 16) & 255,
    g = (n >> 8) & 255,
    b = n & 255
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 140
}
