import Avatar from './Avatar'
import { members } from './data'
import type { ChatTokens } from './theme'

export default function TypingIndicator({ authorId, t }: { authorId: string; t: ChatTokens }) {
  const member = members[authorId]

  return (
    <div className="flex items-center gap-4 px-10 py-3" data-typing>
      <Avatar
        theme={t.name}
        hair={member.hair}
        ringColor={t.mainBg}
        size={48}
      />
      <div
        className="flex h-11 items-center gap-2 rounded-[8px] px-4"
        style={{ background: t.reactionBg }}
      >
        {[0, 1, 2].map((index) => (
          <span
            className="block h-2 w-2 rounded-full"
            data-typing-dot
            key={index}
            style={{ background: t.metaText }}
          />
        ))}
      </div>
      <span className="text-[13.5px]" style={{ color: t.metaText }}>
        {member.name} 님이 입력 중…
      </span>
    </div>
  )
}
