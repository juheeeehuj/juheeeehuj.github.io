import {
  AtSign,
  Bold,
  Code,
  IndentIncrease,
  Italic,
  Link,
  List,
  ListOrdered,
  Paperclip,
  Plus,
  Send,
  Smile,
  Sticker,
  Strikethrough,
} from 'lucide-react'
import type { ChatTokens } from './theme'

const FORMAT = [Bold, Italic, Strikethrough, Code, Link]
const BLOCK = [List, ListOrdered, IndentIncrease]
const ACTIONS = [Plus, Smile, Sticker, Paperclip, AtSign]

export default function Composer({ draft, t }: { draft: string; t: ChatTokens }) {
  const hasDraft = draft.length > 0

  return (
    <div className="shrink-0 px-9 pb-6">
      <div
        className="rounded-[8px] border"
        style={{ background: t.composerBg, borderColor: t.composerBorder }}
      >
        <div
          className="flex h-[54px] items-center gap-1 border-b px-3"
          style={{ borderColor: t.composerBorder }}
        >
          {FORMAT.map((Icon, index) => (
            <ToolButton key={`f-${index}`} t={t}>
              <Icon size={19} strokeWidth={2} />
            </ToolButton>
          ))}
          <span className="mx-2 h-5 w-px" style={{ background: t.composerBorder }} />
          {BLOCK.map((Icon, index) => (
            <ToolButton key={`b-${index}`} t={t}>
              <Icon size={19} strokeWidth={2} />
            </ToolButton>
          ))}
        </div>

        <div className="px-4 py-5 text-[15.5px]" style={{ color: hasDraft ? t.bodyText : t.metaText }}>
          {hasDraft ? (
            <span data-draft>
              {draft}
              <span className="ml-0.5 inline-block h-[18px] w-px align-middle" data-caret style={{ background: t.bodyText }} />
            </span>
          ) : (
            '# 디자인에 메시지 보내기… ( @ 로 멤버 호출 )'
          )}
        </div>

        <div className="flex h-[60px] items-center gap-1 px-3">
          {ACTIONS.map((Icon, index) => (
            <ToolButton key={`a-${index}`} t={t}>
              <Icon size={20} strokeWidth={2} />
            </ToolButton>
          ))}
          <span className="ml-auto flex items-center gap-3">
            <span className="text-[13px]" style={{ color: t.metaText }}>
              Enter 전송 · Shift+Enter 줄바꿈
            </span>
            <span
              className="flex h-10 items-center gap-2 rounded-[6px] px-4 text-[14.5px] font-bold transition-colors duration-200"
              data-send
              style={{ background: hasDraft ? t.brand : t.sendIdleBg, color: t.onBrand }}
            >
              보내기
              <Send size={16} strokeWidth={2.2} />
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}

function ToolButton({ children, t }: { children: React.ReactNode; t: ChatTokens }) {
  return (
    <span
      className="flex h-9 w-9 items-center justify-center rounded-[6px]"
      style={{ color: t.metaText }}
    >
      {children}
    </span>
  )
}
