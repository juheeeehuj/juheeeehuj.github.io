'use client'

import { useRef } from 'react'

type SoundTileProps = {
  alt: string
  bg?: string
  className?: string
  sound: string
  src: string
}

export default function SoundTile({ alt, bg = 'bg-[#f4f5fa]', className = '', sound, src }: SoundTileProps) {
  const audioRef = useRef<HTMLAudioElement>(null)

  function play() {
    audioRef.current!.currentTime = 0
    audioRef.current!.play().catch(() => {})
  }

  return (
    <button className={`group block overflow-hidden ${bg} ${className}`} onClick={play} type="button">
      <img alt={alt} className="h-full w-full object-contain p-[8%] transition-transform duration-300 ease-out group-active:scale-[0.98] motion-reduce:transition-none" src={src} />
      <audio preload="auto" ref={audioRef} src={sound} />
    </button>
  )
}
