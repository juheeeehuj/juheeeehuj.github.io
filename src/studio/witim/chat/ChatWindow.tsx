import { Folder, Hash, Megaphone, MessageSquare, Pin, Search, Settings, Users, X } from 'lucide-react'
import Composer from './Composer'
import MessageItem from './MessageItem'
import Rail from './Rail'
import Sidebar from './Sidebar'
import TypingIndicator from './TypingIndicator'
import { channelHeader, type ChatMessage } from './data'
import { CHAT_FRAME, CHAT_METRICS, type ChatTokens } from './theme'

const HEADER_ICONS = [Search, MessageSquare, Pin, Folder, Settings]

type ChatWindowProps = {
  draft: string
  listRef?: React.Ref<HTMLDivElement>
  messages: ChatMessage[]
  t: ChatTokens
  typingAuthor: string | null
}

export default function ChatWindow({ draft, listRef, messages, t, typingAuthor }: ChatWindowProps) {
  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{ width: CHAT_FRAME.width, height: CHAT_FRAME.height, background: t.mainBg }}
    >
      <div
        className="relative flex shrink-0 items-center px-5"
        style={{ height: CHAT_METRICS.chromeHeight, background: t.chromeBg }}
      >
        <span className="flex gap-2">
          <Dot color="#FF5F57" />
          <Dot color="#FEBC2E" />
          <Dot color="#28C840" />
        </span>
        <span
          className="absolute left-1/2 -translate-x-1/2 text-[14px] font-medium"
          style={{ color: t.chromeText }}
        >
          데스크탑 — 고급 모드
        </span>
      </div>

      <div className="flex min-h-0 flex-1">
        <Rail t={t} />
        <Sidebar t={t} />

        <main className="flex min-w-0 flex-1 flex-col" style={{ background: t.mainBg }}>
          <header
            className="flex shrink-0 items-center gap-3 border-b px-9"
            style={{ height: CHAT_METRICS.headerHeight, borderColor: t.headerBorder }}
          >
            <Hash color={t.titleText} size={22} strokeWidth={2.4} />
            <span className="text-[21px] font-bold tracking-[-0.01em]" style={{ color: t.titleText }}>
              {channelHeader.name}
            </span>
            <span
              className="flex h-8 items-center gap-1.5 rounded-[6px] px-2.5 text-[14px] font-semibold"
              style={{ background: t.reactionBg, color: t.bodyText }}
            >
              <Users size={16} strokeWidth={2} />
              {channelHeader.memberCount}
            </span>
            <span className="ml-2 truncate text-[14.5px]" style={{ color: t.topicText }}>
              {channelHeader.topic}
            </span>
            <span className="ml-auto flex shrink-0 items-center gap-7">
              {HEADER_ICONS.map((Icon, index) => (
                <Icon color={t.metaText} key={index} size={21} strokeWidth={1.9} />
              ))}
            </span>
          </header>

          <div className="shrink-0 px-9 pt-4">
            <div
              className="flex h-[52px] items-center gap-3 rounded-[8px] border px-4"
              style={{ background: t.noticeBg, borderColor: t.noticeBorder }}
            >
              <Megaphone color={t.brand} size={20} strokeWidth={2} />
              <span className="text-[14.5px] font-bold" style={{ color: t.titleText }}>
                공지
              </span>
              <span className="text-[14.5px]" style={{ color: t.bodyText }}>
                {channelHeader.notice}
              </span>
              <X className="ml-auto" color={t.metaText} size={19} strokeWidth={2} />
            </div>
          </div>

          {/* scrollBehavior auto — globals.css 의 smooth 가 GSAP scrollTop 트윈과 싸운다 */}
          <div
            className="min-h-0 flex-1 overflow-hidden pt-3"
            ref={listRef}
            style={{ scrollBehavior: 'auto' }}
          >
            {/* 대화가 아직 화면을 못 채워도 컴포저에 붙어 있게 아래로 정렬한다 */}
            <div className="flex min-h-full flex-col justify-end">
              <div className="flex items-center gap-4 px-9 py-3">
                <span className="h-px flex-1" style={{ background: t.divider }} />
                <span className="text-[13.5px] font-medium" style={{ color: t.metaText }}>
                  {channelHeader.date}
                </span>
                <span className="h-px flex-1" style={{ background: t.divider }} />
              </div>

              {messages.map((message) => (
                <MessageItem key={message.id} message={message} t={t} />
              ))}

              {typingAuthor ? <TypingIndicator authorId={typingAuthor} t={t} /> : null}
              <div className="h-6" />
            </div>
          </div>

          <Composer draft={draft} t={t} />
        </main>
      </div>
    </div>
  )
}

function Dot({ color }: { color: string }) {
  return <span className="block h-3 w-3 rounded-full" style={{ background: color }} />
}
