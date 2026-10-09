'use client'

import gsap from 'gsap'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import ChatWindow from './ChatWindow'
import { scriptedMessages, seedMessages, typingBeats, type ChatMessage } from './data'
import { chatThemes, type ChatTheme } from './theme'

const DRAFT_TEXT = '확인했습니다. 승인 처리할게요 👍'

type ChatMotionProps = {
  theme: ChatTheme
  /**
   * 재생 배속. 녹화기는 1보다 작게 넘긴다 — page.screenshot() 이 가상 시계를
   * ~37ms 씩 밀어 버려서, 원속도로는 프레임 간격이 그보다 촘촘해질 수 없다.
   * 애니메이션을 늦춰 두면 그만큼 촘촘히 찍을 수 있고, 원래 fps 로 인코딩하면
   * 정상 속도의 부드러운 영상이 된다.
   */
  speed?: number
}

export default function ChatMotion({ theme, speed = 1 }: ChatMotionProps) {
  const t = chatThemes[theme]
  const wait = (seconds: number) =>
    new Promise<void>((resolve) => {
      setTimeout(resolve, (seconds / speed) * 1000)
    })
  const [messages, setMessages] = useState<ChatMessage[]>(seedMessages)
  const [typingAuthor, setTypingAuthor] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const listRef = useRef<HTMLDivElement>(null)
  const enteringId = useRef<string | null>(null)
  const commitResolve = useRef<(() => void) | null>(null)
  const started = useRef(false)

  // 새 메시지는 페인트 전(useLayoutEffect)에 from 상태를 찍어야 한 프레임 깜빡임이 없다.
  useLayoutEffect(() => {
    const id = enteringId.current
    if (id) {
      const el = listRef.current?.querySelector(`[data-msg="${id}"]`)
      if (el) {
        gsap.fromTo(
          el,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.42, ease: 'power2.out' },
        )
      }
      enteringId.current = null
    }
    commitResolve.current?.()
    commitResolve.current = null
  }, [messages, typingAuthor])

  // 타이핑 인디케이터 점 — 표시되는 동안만 무한 반복
  useEffect(() => {
    if (!typingAuthor) return
    const dots = listRef.current?.querySelectorAll('[data-typing-dot]')
    if (!dots?.length) return
    const tween = gsap.to(dots, {
      y: -5,
      duration: 0.32,
      ease: 'sine.inOut',
      stagger: 0.11,
      repeat: -1,
      yoyo: true,
    })
    return () => {
      tween.kill()
    }
  }, [typingAuthor])

  useEffect(() => {
    if (started.current) return
    started.current = true
    // GSAP 트윈도 같은 배속으로 늦춰야 시퀀스와 어긋나지 않는다
    gsap.globalTimeline.timeScale(speed)

    const commit = (mutate: () => void) =>
      new Promise<void>((resolve) => {
        commitResolve.current = resolve
        mutate()
      })

    const scrollToBottom = (duration: number) => {
      const list = listRef.current
      if (!list) return
      gsap.to(list, {
        scrollTop: list.scrollHeight,
        duration,
        ease: 'power2.out',
        overwrite: true,
      })
    }

    const appendMessage = async (message: ChatMessage) => {
      enteringId.current = message.id
      await commit(() => {
        setMessages((prev) => [...prev, message])
      })
      scrollToBottom(0.55)
    }

    const showTyping = async (authorId: string, seconds: number) => {
      if (seconds <= 0) return
      await commit(() => {
        setTypingAuthor(authorId)
      })
      scrollToBottom(0.4)
      await wait(seconds)
      await commit(() => {
        setTypingAuthor(null)
      })
    }

    const typeDraft = async (text: string) => {
      for (let index = 1; index <= text.length; index += 1) {
        setDraft(text.slice(0, index))
        await wait(0.055)
      }
    }

    const run = async () => {
      // 시작 상태: 기존 대화가 이미 바닥까지 차 있는 화면
      const list = listRef.current
      if (list) list.scrollTop = list.scrollHeight
      window.__CHAT_READY = true

      await wait(1.5)

      for (const message of scriptedMessages) {
        if (message.id === 'a5') {
          // 마지막 한 마디는 컴포저에서 직접 타이핑 → 전송되는 흐름으로 보여준다
          await typeDraft(DRAFT_TEXT)
          await wait(0.5)
          setDraft('')
          await appendMessage(message)
          await wait(1.2)
          break
        }

        await showTyping(message.author, typingBeats[message.id] ?? 0)
        await appendMessage(message)
        await wait(message.task ? 2.2 : 1.7)
      }

      // 승인 리액션 → 업무 카드 상태 전환
      await commit(() => {
        setMessages((prev) =>
          prev.map((message) =>
            message.id === 'a4' ? { ...message, reactions: [{ emoji: '👍', count: 1 }] } : message,
          ),
        )
      })
      const reaction = listRef.current?.querySelector('[data-reactions="a4"] > *')
      if (reaction) {
        gsap.fromTo(
          reaction,
          { scale: 0.4, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(2.4)' },
        )
      }
      // 리액션이 붙으면 내용이 늘어난다 — 마지막 메시지가 컴포저에 가리지 않게 다시 내린다
      scrollToBottom(0.5)
      await wait(0.9)

      await commit(() => {
        setMessages((prev) =>
          prev.map((message) =>
            message.id === 'a4' && message.task
              ? { ...message, task: { ...message.task, state: '승인 완료' } }
              : message,
          ),
        )
      })
      const stateChip = listRef.current?.querySelector('[data-task-state]')
      if (stateChip) {
        gsap.fromTo(
          stateChip,
          { scale: 0.72 },
          { scale: 1, duration: 0.5, ease: 'back.out(3)' },
        )
      }
      scrollToBottom(0.5)

      // 승인이 끝나면 등록한 사람이 스티커로 답한다. 위 루프는 a5 에서 끊기므로
      // (컴포저 타이핑 연출 때문) 이 한 통은 여기서 따로 올린다.
      const stickerMessage = scriptedMessages.find((message) => message.id === 'a6')
      if (stickerMessage) {
        await wait(0.9)
        await showTyping(stickerMessage.author, typingBeats[stickerMessage.id] ?? 0)
        await appendMessage(stickerMessage)
        scrollToBottom(0.5)
      }

      await wait(2.4)
      window.__CHAT_DONE = true
    }

    void run()
  }, [])

  return (
    <ChatWindow
      draft={draft}
      listRef={listRef}
      messages={messages}
      t={t}
      typingAuthor={typingAuthor}
    />
  )
}

declare global {
  interface Window {
    __CHAT_READY?: boolean
    __CHAT_DONE?: boolean
  }
}
