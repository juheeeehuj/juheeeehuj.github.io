import { FileText } from 'lucide-react'
import Avatar from './Avatar'
import { members, type ChatMessage, type TaskCardState } from './data'
import type { ChatTokens } from './theme'

export default function MessageItem({ message, t }: { message: ChatMessage; t: ChatTokens }) {
  const member = members[message.author]

  return (
    <article className="flex gap-4 px-10 py-3" data-msg={message.id}>
      <Avatar
        theme={t.name}
        hair={member.hair}
        ringColor={t.mainBg}
        size={48}
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2.5">
          <span className="text-[16px] font-bold tracking-[-0.01em]" style={{ color: t.titleText }}>
            {member.name}
          </span>
          <span className="text-[13px] font-medium" style={{ color: t.metaText }}>
            {message.time}
          </span>
          {message.edited ? (
            <span className="text-[13px]" style={{ color: t.metaText }}>
              (편집됨)
            </span>
          ) : null}
        </div>

        {message.link ? (
          <p className="mt-1 text-[15.5px] underline underline-offset-2" style={{ color: t.link }}>
            {message.link}
          </p>
        ) : null}

        {message.body?.map((line) => (
          <p className="mt-1 text-[15.5px] leading-[1.55]" key={line} style={{ color: t.bodyText }}>
            {line}
          </p>
        ))}

        {message.truncated ? (
          <p className="mt-1.5 text-[15px] font-semibold" style={{ color: t.link }}>
            펼쳐보기
          </p>
        ) : null}

        {message.sticker ? (
          <img
            alt=""
            className="mt-1.5 block h-[132px] w-[132px]"
            src={`/work/witim-identity/chat/stickers/${message.sticker}`}
          />
        ) : null}

        {message.file ? <FileCard file={message.file} t={t} /> : null}
        {message.task ? <TaskCardBlock task={message.task} t={t} /> : null}

        {message.reactions?.length ? (
          <div className="mt-2.5 flex gap-2" data-reactions={message.id}>
            {message.reactions.map((reaction) => (
              <span
                className="flex h-8 items-center gap-1.5 rounded-[6px] border px-2.5 text-[13px] font-semibold"
                key={reaction.emoji}
                style={{ background: t.reactionBg, borderColor: t.reactionBorder, color: t.bodyText }}
              >
                <span className="text-[15px]">{reaction.emoji}</span>
                {reaction.count}
              </span>
            ))}
          </div>
        ) : null}

        {message.threadCount ? (
          <div
            className="mt-2.5 inline-flex h-9 items-center gap-2 rounded-[6px] px-2.5"
            style={{ background: t.reactionBg }}
          >
            {/* 겹쳐 놓되 각 아바타에 배경색 링을 둘러 서로 분리돼 읽히게 한다 */}
            <span className="flex -space-x-1">
              {message.threadAvatars?.map((id) => (
                <span
                  className="flex rounded-full"
                  key={id}
                  style={{ boxShadow: `0 0 0 2px ${t.reactionBg}` }}
                >
                  <Avatar
        theme={t.name}
                    hair={members[id].hair}
                    ringColor={t.reactionBg}
                    size={24}
                  />
                </span>
              ))}
            </span>
            <span className="text-[13.5px] font-bold" style={{ color: t.bodyText }}>
              답글 {message.threadCount}개
            </span>
          </div>
        ) : null}
      </div>
    </article>
  )
}

function FileCard({ file, t }: { file: { name: string; meta: string }; t: ChatTokens }) {
  return (
    <div
      className="mt-2.5 flex w-[520px] items-center gap-3.5 rounded-[8px] border p-4"
      style={{ background: t.cardBg, borderColor: t.cardBorder }}
    >
      <span
        className="flex h-11 w-11 items-center justify-center rounded-[6px]"
        style={{ background: t.reactionBg, color: t.metaText }}
      >
        <FileText size={22} strokeWidth={1.8} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-bold" style={{ color: t.titleText }}>
          {file.name}
        </span>
        <span className="mt-0.5 block text-[13px]" style={{ color: t.metaText }}>
          {file.meta}
        </span>
      </span>
      <span
        className="flex h-9 shrink-0 items-center rounded-[6px] border px-3.5 text-[14px] font-semibold"
        style={{ borderColor: t.cardBorder, color: t.bodyText }}
      >
        다운로드
      </span>
    </div>
  )
}

function stateStyle(state: TaskCardState, t: ChatTokens) {
  if (state === '승인 완료') {
    return { background: `${t.brand}1F`, color: t.link, borderColor: 'transparent' }
  }
  return { background: t.reactionBg, color: t.metaText, borderColor: t.reactionBorder }
}

function TaskCardBlock({ task, t }: { task: { title: string; assignee: string; due: string; state: TaskCardState }; t: ChatTokens }) {
  return (
    <div
      className="mt-2.5 w-[520px] rounded-[8px] border p-5"
      data-task
      style={{ background: t.cardBg, borderColor: t.cardBorder }}
    >
      <div className="flex items-center gap-2">
        <span
          className="rounded-full px-2 py-0.5 text-[12px] font-bold"
          style={{ background: `${t.brand}1F`, color: t.link }}
        >
          WiTiM 업무
        </span>
        <span
          className="ml-auto rounded-full border px-2.5 py-1 text-[12.5px] font-bold"
          data-task-state
          style={stateStyle(task.state, t)}
        >
          {task.state}
        </span>
      </div>
      <p className="mt-3 text-[15.5px] font-bold" style={{ color: t.titleText }}>
        {task.title}
      </p>
      <div className="mt-2.5 flex gap-5 text-[13.5px]" style={{ color: t.metaText }}>
        <span>
          담당 <span style={{ color: t.bodyText }}>{task.assignee}</span>
        </span>
        <span>
          기한 <span style={{ color: t.bodyText }}>{task.due}</span>
        </span>
      </div>
    </div>
  )
}
