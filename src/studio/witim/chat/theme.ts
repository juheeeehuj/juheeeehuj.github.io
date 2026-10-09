// 채팅 UI 테마 토큰 — 값은 원본 목업 PNG(chat-desktop-{light,dark}.png)에서
// 픽셀 단위로 샘플링해 가져왔다. 라이트/다크는 이미지 두 장이 아니라
// 같은 마크업에 토큰 한 벌을 갈아끼우는 방식으로 성립한다.

export type ChatTheme = 'light' | 'dark'

export type ChatTokens = {
  /** 아바타처럼 테마별 소재가 갈리는 곳에서 쓴다 — t 는 이미 어디에나 전달된다 */
  name: ChatTheme
  chromeBg: string
  chromeText: string
  railBg: string
  railActive: string
  railIcon: string
  railIconActive: string
  sidebarBg: string
  sidebarBorder: string
  sidebarActive: string
  sectionLabel: string
  itemText: string
  itemTextActive: string
  mainBg: string
  headerBorder: string
  titleText: string
  topicText: string
  metaText: string
  bodyText: string
  divider: string
  noticeBg: string
  noticeBorder: string
  cardBg: string
  cardBorder: string
  reactionBg: string
  reactionBorder: string
  composerBg: string
  composerBorder: string
  brand: string
  onBrand: string
  sendIdleBg: string
  link: string
  hoverBg: string
  headTop: string
  headBottom: string
}

const light: ChatTokens = {
  name: 'light',
  chromeBg: '#1C1D26',
  chromeText: '#C9CAD4',
  railBg: '#F6F6F9',
  railActive: '#EAEBF0',
  railIcon: '#6B6D80',
  railIconActive: '#181920',
  sidebarBg: '#F6F6F9',
  sidebarBorder: '#EBECF1',
  sidebarActive: '#EAEBF0',
  sectionLabel: '#6B6D80',
  itemText: '#3F4152',
  itemTextActive: '#0F0F13',
  mainBg: '#FFFFFF',
  headerBorder: '#F0F1F4',
  titleText: '#0F0F13',
  topicText: '#6B6D80',
  metaText: '#8A8C9E',
  bodyText: '#181920',
  divider: '#F0F1F4',
  noticeBg: '#FAFAFB',
  noticeBorder: '#EFEFF2',
  cardBg: '#FFFFFF',
  cardBorder: '#E4E6EF',
  reactionBg: '#F8F8FB',
  reactionBorder: '#E4E6EF',
  composerBg: '#FFFFFF',
  composerBorder: '#E4E6EF',
  brand: '#455FFF',
  onBrand: '#FFFFFF',
  sendIdleBg: '#BDC6FF',
  link: '#455FFF',
  hoverBg: '#F9F9FB',
  headTop: '#000000',
  headBottom: '#2B2B2B',
}

const dark: ChatTokens = {
  name: 'dark',
  chromeBg: '#1C1D26',
  chromeText: '#C9CAD4',
  railBg: '#21222C',
  railActive: '#2A2B37',
  railIcon: '#9192A4',
  railIconActive: '#EBECF1',
  sidebarBg: '#21222C',
  sidebarBorder: '#191A22',
  sidebarActive: '#2A2B37',
  sectionLabel: '#8B8DA0',
  itemText: '#C3C5D4',
  itemTextActive: '#FFFFFF',
  mainBg: '#2A2B37',
  headerBorder: '#383B49',
  titleText: '#F2F3F7',
  topicText: '#9192A4',
  metaText: '#8B8DA0',
  bodyText: '#E4E5EC',
  divider: '#383B49',
  noticeBg: '#30313E',
  noticeBorder: '#3A3C4A',
  cardBg: '#373948',
  cardBorder: '#434656',
  reactionBg: '#343643',
  reactionBorder: '#434656',
  composerBg: '#2A2B37',
  composerBorder: '#434656',
  brand: '#455FFF',
  onBrand: '#FFFFFF',
  sendIdleBg: '#495187',
  link: '#8FA0FF',
  hoverBg: '#2F3140',
  headTop: '#050505',
  headBottom: '#2B2B2B',
}

export const chatThemes: Record<ChatTheme, ChatTokens> = { light, dark }

// 목업 원본이 2400x1348 1:1 export 였다 — 그 좌표계를 그대로 쓴다.
// 녹화 시 0.8배로 축소하면 정확히 1920x1080 이 된다.
export const CHAT_FRAME = { width: 2400, height: 1350 } as const

export const CHAT_METRICS = {
  chromeHeight: 44,
  railWidth: 84,
  sidebarWidth: 360,
  headerHeight: 76,
} as const
