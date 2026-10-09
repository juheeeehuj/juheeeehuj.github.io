// 1920x1080 프레임 안에 카드를 흩어 놓은 좌표계. 겹침을 허용한 콜라주라
// 값은 "정렬"이 아니라 "균형"으로 잡았다 — 화면 밖으로 나가는 카드는 없다.
export const TOKEN_FRAME = { width: 1920, height: 1080 }

// 라이트·다크가 같은 slot 을 쓰는 카드 = 제자리에서 색만 갈아입는다.
// 한쪽에만 있는 카드는 그 국면에서만 떠 있다 — 세트가 통째로 바뀌는 인상을 만든다.
export type TokenCard = {
  /** 이 카드가 떠 있는 국면. both = 라이트·다크 양쪽에 있어 제자리 교차가 일어난다 */
  phase: 'both' | 'light' | 'dark'
  /** public/witim/components/{light,dark}/ 아래 파일명 */
  slug: string
  /** 표시 폭(px). 높이는 원본 비율로 따라간다 */
  width: number
  x: number
  y: number
  /** 겹침 순서 */
  z: number
  /** 떠다니는 진폭(px)과 주기(초) — 카드마다 달라야 시차가 생긴다 */
  driftX: number
  driftY: number
  period: number
}

// 겹침은 허용하되 글자 위를 덮지 않게 둔다 — 카드 모서리끼리만 물리도록 배치했다.
export const TOKEN_CARDS: TokenCard[] = [
  // 제자리에서 라이트↔다크로 갈아입는 네 장 — 이 영상의 본문
  { phase: 'both', slug: 'profile-settings', width: 356, x: 300, y: 190, z: 30, driftX: -12, driftY: 18, period: 9.5 },
  { phase: 'both', slug: 'new-chat', width: 356, x: 740, y: 380, z: 40, driftX: 14, driftY: -13, period: 8.2 },
  { phase: 'both', slug: 'profile-card', width: 362, x: 1150, y: 180, z: 35, driftX: -10, driftY: -16, period: 10.4 },
  { phase: 'both', slug: 'workspace-switch', width: 356, x: 1180, y: 640, z: 32, driftX: 13, driftY: 11, period: 7.6 },

  // 라이트에만 있는 조각들 — 큰 카드 사이 여백을 가볍게 메운다
  { phase: 'light', slug: 'rail', width: 60, x: 170, y: 140, z: 20, driftX: 5, driftY: -14, period: 11.2 },
  { phase: 'light', slug: 'member-row', width: 300, x: 730, y: 250, z: 45, driftX: -16, driftY: 10, period: 6.8 },
  { phase: 'light', slug: 'avatar-colors', width: 400, x: 640, y: 850, z: 45, driftX: 18, driftY: 8, period: 9.1 },
  { phase: 'light', slug: 'avatar-status', width: 270, x: 1550, y: 210, z: 45, driftX: -13, driftY: 15, period: 7.9 },
  { phase: 'light', slug: 'empty-state', width: 344, x: 300, y: 700, z: 28, driftX: 11, driftY: -11, period: 10.8 },

  // 다크에만 있는 카드 — 라이트 조각이 빠진 자리를 큰 면으로 채운다
  // 라이트의 empty-state·avatar 자리로 내려 프로필 설정 카드와 안 물리게 둔다
  { phase: 'dark', slug: 'new-dm', width: 356, x: 250, y: 690, z: 22, driftX: 12, driftY: -15, period: 10.1 },
  { phase: 'dark', slug: 'group-chat', width: 356, x: 620, y: 120, z: 38, driftX: -14, driftY: 12, period: 8.7 },
  { phase: 'dark', slug: 'profile-card-2', width: 312, x: 1520, y: 560, z: 27, driftX: 16, driftY: 10, period: 9.8 },
]

// 배경도 같이 갈아입는다 — BG Base 의 라이트·다크 값이다.
export const TOKEN_BG = { light: '#EBECF1', dark: '#0F0F13' } as const
