'use client'

// 브랜드 시그니처 '궤도 라인' — 실제 refine-clinic.com 필로소피 배경 소스 그대로 재현.
// 타원 2개(회전 -8°/-31°) + 그 위를 천천히 공전하는 점 2개(dark/light) + 펄스 링.
import { useEffect, useRef } from 'react'

const CX = 640
const CY = 340
const ELLIPSES = [
  { rx: 620, ry: 300, rot: -8 },
  { rx: 620, ry: 300, rot: -31 },
]
// 각 점: 어느 타원 위를, 시작 위상(phase, 회전수), 속도(rad/s, 부호=방향)
const DOTS = [
  { cls: 'dark', ellipse: 0, phase: 0.62, speed: 0.09 },
  { cls: 'light', ellipse: 1, phase: 0.18, speed: -0.075 },
]

export default function OrbitField({ className = '' }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    const dots = Array.from(root.querySelectorAll<HTMLSpanElement>('[data-orbit-dot]'))
    let width = root.clientWidth || 1280
    const ro = new ResizeObserver(() => { width = root.clientWidth || 1280 })
    ro.observe(root)

    const place = (dot: HTMLSpanElement, cfgIndex: number, param: number) => {
      const e = ELLIPSES[DOTS[cfgIndex].ellipse]
      const th = (e.rot * Math.PI) / 180
      const lx = e.rx * Math.cos(param)
      const ly = e.ry * Math.sin(param)
      const rx = lx * Math.cos(th) - ly * Math.sin(th)
      const ry = lx * Math.sin(th) + ly * Math.cos(th)
      const scale = width / 1280
      dot.style.transform = `translate(calc(-50% + ${(rx * scale).toFixed(2)}px), calc(-50% + ${(ry * scale).toFixed(2)}px))`
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      dots.forEach((d, i) => place(d, i, DOTS[i].phase * Math.PI * 2))
      return () => ro.disconnect()
    }

    let raf = 0
    let t0 = 0
    const loop = (ts: number) => {
      if (!t0) t0 = ts
      const el = (ts - t0) / 1000
      dots.forEach((d, i) => {
        const cfg = DOTS[i]
        place(d, i, cfg.phase * Math.PI * 2 + el * cfg.speed)
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [])

  return (
    <div ref={rootRef} className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`.trim()} aria-hidden="true">
      <svg
        className="absolute"
        style={{ width: '100%', height: 'auto', aspectRatio: '1280 / 680', overflow: 'visible', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
        viewBox="0 0 1280 680"
      >
        {ELLIPSES.map((e) => (
          <ellipse
            cx={CX}
            cy={CY}
            fill="none"
            key={e.rot}
            rx={e.rx}
            ry={e.ry}
            stroke="rgba(235,229,222,0.34)"
            strokeWidth="1.15"
            transform={`rotate(${e.rot} ${CX} ${CY})`}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      {DOTS.map((d) => <span className={`orbit-dot orbit-dot--${d.cls}`} data-orbit-dot key={d.cls} />)}
      <style>{`
        .orbit-dot { position:absolute; top:50%; left:50%; border-radius:50%; z-index:2; will-change:transform; filter:drop-shadow(0 6px 20px rgba(0,0,0,0.18)); }
        .orbit-dot--dark { width:30px; height:30px; background:rgb(32,24,20); }
        .orbit-dot--light { width:29px; height:29px; background:rgb(133,129,127); }
        .orbit-dot::after { content:''; position:absolute; inset:-9px; border-radius:inherit; border:1px solid rgba(255,255,255,0.22); opacity:0; animation:orbit-dot-pulse 2.6s ease infinite; }
        .orbit-dot--light::after { border-color:rgba(255,255,255,0.18); animation-delay:0.7s; }
        @keyframes orbit-dot-pulse { 0%{opacity:0;transform:scale(0.75)} 35%{opacity:0.85} 100%{opacity:0;transform:scale(1.45)} }
        @media (prefers-reduced-motion: reduce){ .orbit-dot::after{animation:none} }
      `}</style>
    </div>
  )
}
