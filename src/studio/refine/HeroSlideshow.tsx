'use client'

import { useEffect, useState } from 'react'

// refine-clinic.com 히어로처럼 배경 이미지를 천천히 크로스페이드(+미세 줌) 전환한다.
type HeroSlideshowProps = {
  images?: string[]
  interval?: number
}

export default function HeroSlideshow({ images = [], interval = 4200 }: HeroSlideshowProps) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return undefined
    const id = setInterval(() => setActive((i) => (i + 1) % images.length), interval)
    return () => clearInterval(id)
  }, [images.length, interval])

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      {images.map((src, index) => (
        <img
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          key={src}
          loading={index === 0 ? 'eager' : 'lazy'}
          src={src}
          style={{
            opacity: index === active ? 1 : 0,
            transform: index === active ? 'scale(1.06)' : 'scale(1)',
            transition: 'opacity 1500ms ease-in-out, transform 6500ms ease-out',
          }}
        />
      ))}
    </div>
  )
}
