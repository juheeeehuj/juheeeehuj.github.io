'use client'

import { useEffect, useId, useRef } from 'react'
import { list, text } from '@studio/lib/field'
import type { Locale, Slot } from '@studio/lib/ia'

// 웨이트 범위는 content(specimen.weightMin/weightMax)에서 온다 — 운영자가 어드민에서
// 입력한다. 값이 없으면 아래 기본(WITIM 표준 Regular 400 ~ Bold 700)을 쓴다.
const DEFAULT_WEIGHT_MIN = 400
const DEFAULT_WEIGHT_MAX = 700
const WEIGHT_STEP = 10
const LOOP_DURATION = 5000 // 굵기 한 바퀴(ms)

// content 값(문자열)을 숫자 웨이트로. 비었거나 이상하면 기본값.
function weightOf(raw: string, fallback: number): number {
  const n = Number(raw)
  return Number.isFinite(n) && n >= 1 && n <= 1000 ? n : fallback
}

const GRID_PAPER = {
  backgroundImage: 'linear-gradient(to right, rgba(0,0,0,.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,.06) 1px, transparent 1px)',
  backgroundSize: '16px 16px',
}

type TypefaceRowProps = {
  locale: Locale
  spec: Slot
}

function TypefaceRow({ locale, spec }: TypefaceRowProps) {
  const glyphRef = useRef<HTMLSpanElement>(null)
  const sampleRef = useRef<HTMLParagraphElement>(null)
  const sliderRef = useRef<HTMLInputElement>(null)
  const readoutRef = useRef<HTMLSpanElement>(null)
  const frameRef = useRef(0)
  const sliderId = useId()

  // 웨이트 범위 — content 값이 있으면 그것, 없으면 기본. min ≥ max 면 기본으로 되돌린다.
  let weightMin = weightOf(text(spec, 'weightMin', locale), DEFAULT_WEIGHT_MIN)
  let weightMax = weightOf(text(spec, 'weightMax', locale), DEFAULT_WEIGHT_MAX)
  if (weightMin >= weightMax) { weightMin = DEFAULT_WEIGHT_MIN; weightMax = DEFAULT_WEIGHT_MAX }

  const weightRef = useRef(weightMax)

  useEffect(() => {
    const applyWeight = (weight: number) => {
      if (weight === weightRef.current) return
      weightRef.current = weight
      if (glyphRef.current) glyphRef.current.style.fontWeight = String(weight)
      if (sampleRef.current) sampleRef.current.style.fontWeight = String(weight)
      if (readoutRef.current) readoutRef.current.textContent = String(weight)
      if (sliderRef.current) {
        sliderRef.current.value = String(weight)
        sliderRef.current.setAttribute('aria-valuetext', String(weight))
      }
    }

    const stopLoop = () => cancelAnimationFrame(frameRef.current)

    const slider = sliderRef.current
    // 사용자가 슬라이더를 잡으면 루프를 멈추고 조작을 넘긴다.
    const handleInput = () => {
      stopLoop()
      applyWeight(Number(slider!.value))
    }
    slider?.addEventListener('pointerdown', stopLoop)
    slider?.addEventListener('input', handleInput)

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!reduceMotion) {
      let startedAt = 0
      const tick = (now: number) => {
        if (!startedAt) startedAt = now
        const phase = ((now - startedAt) % LOOP_DURATION) / LOOP_DURATION
        // 굵은 쪽에서 시작해 얇은 쪽까지 갔다가 되돌아온다
        const eased = (1 + Math.cos(phase * 2 * Math.PI)) / 2
        const raw = weightMin + (weightMax - weightMin) * eased
        applyWeight(Math.round(raw / WEIGHT_STEP) * WEIGHT_STEP)
        frameRef.current = requestAnimationFrame(tick)
      }
      frameRef.current = requestAnimationFrame(tick)
    }

    return () => {
      stopLoop()
      slider?.removeEventListener('pointerdown', stopLoop)
      slider?.removeEventListener('input', handleInput)
    }
  }, [])

  return (
    <div className="grid gap-x-[6vw] gap-y-8 border-b border-black/15 py-[clamp(2.5rem,4vw,5rem)] md:grid-cols-2 md:items-start">
      <div className="grid aspect-square w-[min(100%,26rem)] place-items-center border border-black/15" style={GRID_PAPER}>
        <span className="text-[clamp(10rem,18vw,17rem)] leading-none text-[#111]" ref={glyphRef} style={{ fontWeight: weightMax }}>{text(spec, 'glyph', locale)}</span>
      </div>

      <div>
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-black/50">{text(spec, 'lang', locale)}</p>
        <p className="mt-[clamp(2.5rem,5vw,6rem)] text-[clamp(2.6rem,6vw,6.5rem)] leading-[1.06] tracking-[-0.03em]" ref={sampleRef} style={{ fontWeight: weightMax }}>{text(spec, 'sample', locale)}</p>

        <div className="mt-[clamp(2.5rem,4vw,4rem)] flex items-center gap-[clamp(1rem,1.5vw,1.5rem)]">
          <label className="shrink-0 font-mono text-xs uppercase tracking-[0.16em] text-black/50" htmlFor={sliderId}>Weight</label>
          <input
            aria-valuetext={`${weightMax}`}
            className="h-1 w-full min-w-0 cursor-ew-resize appearance-none rounded-none bg-black/15 accent-witim-light outline-none [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:cursor-ew-resize [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-witim-light [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:cursor-ew-resize [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-witim-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-witim-light"
            defaultValue={weightMax}
            id={sliderId}
            max={weightMax}
            min={weightMin}
            ref={sliderRef}
            step={WEIGHT_STEP}
            type="range"
          />
          <span className="w-[3ch] shrink-0 text-right font-mono text-xs tabular-nums text-black/50" ref={readoutRef}>{weightMax}</span>
        </div>
      </div>
    </div>
  )
}

type TypefaceSpecimenProps = {
  locale: Locale
  sec: Slot
}

export default function TypefaceSpecimen({ locale, sec }: TypefaceSpecimenProps) {
  return (
    <section className="bg-white px-[5.2vw] py-[clamp(5rem,9vw,11rem)] text-[#111]">
      <div className="grid gap-6 border-y border-black py-[clamp(1.25rem,2.5vw,2.75rem)] md:grid-cols-2">
        <h2 className="text-[clamp(1.15rem,1.6vw,1.6rem)] font-bold tracking-[-0.02em]">{text(sec, 'typeLabel', locale)}</h2>
        <h2 className="text-[clamp(1.15rem,1.6vw,1.6rem)] font-bold tracking-[-0.02em]">{text(sec, 'typeName', locale)}</h2>
      </div>
      {list(sec, 'specimens').map((spec, index) => <TypefaceRow key={index} locale={locale} spec={spec} />)}
    </section>
  )
}
