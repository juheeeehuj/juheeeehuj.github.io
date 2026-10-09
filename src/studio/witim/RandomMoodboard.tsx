'use client'

import { useEffect, useState } from 'react'

// 랜덤 교체 무드보드 — 고정 그리드의 칸이 주기적으로 다른 이미지로 바뀐다(페이드).
// 서버에서 못 하는 타이머·랜덤이 필요해 클라이언트 컴포넌트로 둔다.
type Img = { src: string; alt: string }

const VISIBLE = 12 // 화면에 동시에 보이는 칸 수
const SWAP_MS = 1600 // 교체 주기

export default function RandomMoodboard({ images }: { images: Img[] }) {
  const count = Math.min(VISIBLE, images.length)
  const [cells, setCells] = useState<number[]>(() => Array.from({ length: count }, (_, i) => i % Math.max(1, images.length)))

  useEffect(() => {
    if (images.length <= count) return // 바꿔 넣을 여분이 없으면 정지
    const id = setInterval(() => {
      setCells((prev) => {
        const shown = new Set(prev)
        const spare = images.map((_, i) => i).filter((i) => !shown.has(i))
        if (!spare.length) return prev
        const cell = Math.floor(Math.random() * prev.length)
        const pick = spare[Math.floor(Math.random() * spare.length)]
        const next = [...prev]
        next[cell] = pick
        return next
      })
    }, SWAP_MS)
    return () => clearInterval(id)
  }, [images, count])

  return (
    <figure aria-label="WITIM 브랜드 무드보드" className="grid grid-cols-2 gap-4 bg-[#f4f6fb] p-4 sm:grid-cols-3 md:gap-5 md:p-5 lg:grid-cols-6">
      <style dangerouslySetInnerHTML={{ __html: '@keyframes moodboard-fade{from{opacity:0}to{opacity:1}}' }} />
      {cells.map((imgIdx, cell) => {
        const image = images[imgIdx]
        return (
          <div className="aspect-[4/5] overflow-hidden bg-[#e9ebf4]" key={cell}>
            {image && (
              <img
                // key = 이미지 인덱스 → 바뀌면 새 img 로 리마운트되며 페이드인
                key={imgIdx}
                alt={image.alt}
                className="h-full w-full object-cover"
                loading="lazy"
                src={image.src}
                style={{ animation: 'moodboard-fade 0.6s ease' }}
              />
            )}
          </div>
        )
      })}
    </figure>
  )
}
