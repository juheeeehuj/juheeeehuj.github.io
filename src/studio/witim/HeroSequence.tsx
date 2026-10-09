'use client'

import { useEffect, useRef } from 'react'

// 히어로 미디어는 어드민 편집 대상이다 — opening 섹션의 hero 필드(content/witim.json)에서
// src/alt 를 받는다. 영상(.mp4 등)이면 <video>, 이미지면 <img> 로 자동 판별한다.
// src 가 비면 배경만 남겨(로딩 폴백) 화면이 깨지지 않게 한다.
type HeroSequenceProps = {
  src?: string
  alt?: string
}

function isVideo(src: string): boolean {
  return /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(src)
}

export default function HeroSequence({ src = '', alt = '' }: HeroSequenceProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  // 자동재생이 막히는 브라우저 대비 명시적 재생 시도
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const started = video.play?.()
    if (started && typeof started.catch === 'function') started.catch(() => {})
  }, [src])

  return (
    <section className="relative min-h-dvh overflow-hidden bg-[#0d1321]">
      {src && isVideo(src) ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label={alt || undefined}
          src={src}
        />
      ) : src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="absolute inset-0 h-full w-full object-cover" src={src} alt={alt} />
      ) : null}
    </section>
  )
}
