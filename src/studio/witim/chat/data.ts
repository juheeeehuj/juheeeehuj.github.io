// 채팅 화면의 내용물 — 멤버·채널·메시지.
// seedMessages 는 영상 시작 시점에 이미 떠 있는 대화,
// scriptedMessages 는 녹화 중 하나씩 올라오는 새 업무 대화다.

export type MemberStatus = 'online' | 'away' | 'offline'

export type Member = {
  id: string
  name: string
  hair: string
  status: MemberStatus
  unread?: number
}

export type Reaction = { emoji: string; count: number }

export type FileAttachment = { name: string; meta: string }

// 스티커는 말풍선 없이 그림만 올린다 — public/witim/chat/stickers/ 아래 파일명

export type TaskCardState = '검토중' | '승인 완료'

export type TaskCard = {
  title: string
  assignee: string
  due: string
  state: TaskCardState
}

export type ChatMessage = {
  id: string
  author: string
  time: string
  body?: string[]
  link?: string
  file?: FileAttachment
  sticker?: string
  task?: TaskCard
  reactions?: Reaction[]
  threadCount?: number
  threadAvatars?: string[]
  edited?: boolean
  truncated?: boolean
}

export const members: Record<string, Member> = {
  minjun: { id: 'minjun', name: '김디자인', hair: '#C9CFFF', status: 'online' },
  seoyeon: { id: 'seoyeon', name: '박검수', hair: '#FFC9C9', status: 'online' },
  doyun: { id: 'doyun', name: '김개발', hair: '#D5D8E3', status: 'away' },
  chaeyoung: { id: 'chaeyoung', name: '전팀원', hair: '#BFE8CC', status: 'online' },
  daniel: { id: 'daniel', name: '강지원', hair: '#F7D9AE', status: 'away' },
  hansol: { id: 'hansol', name: '최기획', hair: '#C6E9D4', status: 'online' },
  christopher: { id: 'christopher', name: '정마케팅', hair: '#E2E3EC', status: 'offline' },
  woosung: { id: 'woosung', name: '유리서치', hair: '#BFE8CC', status: 'online' },
  jennifer: { id: 'jennifer', name: '한운영', hair: '#F7D9AE', status: 'offline' },
  hanjimin: { id: 'hanjimin', name: '오데이터', hair: '#FFC9C9', status: 'offline' },
}

export const favoriteChannels = [
  { name: '공지', locked: false },
  { name: '일반', locked: false },
]

export const channels = [
  { name: '디자인', locked: false, active: true },
  { name: '개발', locked: false, unread: 3 },
  { name: '마케팅', locked: true },
  { name: 'QA', locked: false },
  { name: '글로벌-마케팅-그로스-캠페인-2026-H2-…', locked: false },
]

export const pinnedMembers = ['minjun', 'chaeyoung', 'daniel']

export const directMessages: Array<{ id: string; unread?: number }> = [
  { id: 'seoyeon', unread: 3 },
  { id: 'christopher', unread: 5 },
  { id: 'doyun', unread: 1 },
  { id: 'hansol' },
  { id: 'christopher' },
  { id: 'woosung' },
  { id: 'jennifer' },
  { id: 'hanjimin' },
]

// DM 목록은 원본 목업의 순서를 그대로 따른다. 이름은 전부 역할 기반 가명이다.
export const dmRoster: Array<{ name: string; hair: string; status: MemberStatus; unread?: number }> = [
  { name: '박검수', hair: '#FFC9C9', status: 'online', unread: 3 },
  { name: '나대표', hair: '#C9CFFF', status: 'online', unread: 5 },
  { name: '김개발', hair: '#D5D8E3', status: 'away', unread: 1 },
  { name: '최기획', hair: '#C6E9D4', status: 'online' },
  { name: '정마케팅', hair: '#E2E3EC', status: 'offline' },
  { name: '유리서치', hair: '#BFE8CC', status: 'online' },
  { name: '한운영', hair: '#F7D9AE', status: 'offline' },
  { name: '오데이터', hair: '#FFC9C9', status: 'offline' },
]

export const channelHeader = {
  name: '디자인',
  memberCount: 12,
  topic: '주제: 디자인 시스템 — 토큰 / 컴포넌트 표준 논의',
  notice: '6/25(목) 디자인 시스템 v2 리뷰 — 토큰/컴포넌트 확정',
  date: '2026년 6월 24일 수요일',
}

// 영상 시작 시점에 이미 화면에 있는 대화
export const seedMessages: ChatMessage[] = [
  {
    id: 's1',
    author: 'minjun',
    time: '오전 9:12',
    body: ['디자인 토큰 v2 정리해서 공유드려요. 표면/콘텐츠/보더 역할 기반입니다.'],
    file: { name: 'design-tokens-v2.json', meta: '김디자인 · 24.1KB' },
  },
  {
    id: 's2',
    author: 'seoyeon',
    time: '오전 9:20',
    body: ['확인했습니다. 네이밍 깔끔하네요 👍'],
    reactions: [
      { emoji: '👍', count: 3 },
      { emoji: '🎉', count: 1 },
    ],
  },
  {
    id: 's3',
    author: 'doyun',
    time: '오전 9:34',
    link: 'https://ui.shadcn.com/docs/components',
    body: ['컴포넌트 레퍼런스입니다. 우리 표준이랑 1:1 매핑해볼게요'],
    reactions: [{ emoji: '👀', count: 2 }],
  },
  {
    id: 's4',
    author: 'chaeyoung',
    time: '오전 9:48',
    body: [
      '[전체공지] 주간 업무 보고 체계 도입 및 전체회의 안내',
      '금일부터 PM 및 전 팀원은 아래 기준에 따라 주간 업무를 보고해 주시기 바랍니다.',
      '■ 보고 방법',
      '위팀(WiTiM) 프로젝트에 본인 담당 업무를 등록하고, 대표 검토 후 승인 처리합니다.',
      '■ 보고 내용',
      '- 현재 진행 중인 업무 전체…',
    ],
    truncated: true,
  },
  {
    id: 's5',
    author: 'minjun',
    time: '오전 10:10',
    body: ['오늘 디자인 싱크 오후 3시 맞죠?'],
    edited: true,
    threadCount: 2,
    threadAvatars: ['seoyeon', 'doyun', 'chaeyoung', 'daniel'],
  },
]

// 녹화 중 순차적으로 올라오는 새 업무 대화 — 위팀의 핵심 루프
// (업무 등록 → 검토 → 대표 승인)가 화면에서 한 바퀴 돈다.
export const scriptedMessages: ChatMessage[] = [
  {
    id: 'a1',
    author: 'minjun',
    time: '오전 10:11',
    body: ['네, 3시로 확정할게요. 그 전에 토큰 v2 반영분만 한 번 봐주세요.'],
  },
  {
    id: 'a2',
    author: 'seoyeon',
    time: '오전 10:13',
    body: ['버튼 hover가 아직 v1 값이에요. surface-hover 로 교체 부탁드립니다 🙏'],
  },
  {
    id: 'a3',
    author: 'doyun',
    time: '오전 10:14',
    body: ['컴포넌트 대조표 올려둘게요. 불일치 6건 표시해뒀습니다.'],
    file: { name: 'component-audit-0624.xlsx', meta: '김개발 · 88.4KB' },
  },
  {
    id: 'a4',
    author: 'chaeyoung',
    time: '오전 10:16',
    body: ['위팀에 업무로 등록했습니다. 검토 부탁드려요.'],
    task: {
      title: '디자인 토큰 v2 — hover 상태값 정합',
      assignee: '박검수',
      due: '6/25(목)',
      state: '검토중',
    },
  },
  {
    id: 'a5',
    author: 'minjun',
    time: '오전 10:17',
    body: ['확인했습니다. 승인 처리할게요 👍'],
  },
  {
    id: 'a6',
    author: 'chaeyoung',
    time: '오전 10:18',
    sticker: 'thanks.webp',
  },
]

// 각 메시지 직전에 보여줄 타이핑 인디케이터 지속 시간(초). 0이면 생략.
export const typingBeats: Record<string, number> = {
  a1: 0,
  a2: 1.1,
  a3: 0.9,
  a4: 1.3,
  a5: 0.9,
  a6: 0.7,
}
