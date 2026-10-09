// 브랜드 시그니처 '흐르는 라인' — 실제 refine-clinic.com All-Depth Lifting 카드의
// CSS 인터랙션 효과를 소스 그대로 재현. 카드마다 개별 오버레이(mix-blend: overlay)로
// 스킨 위에서 발광하고, 스캔 라인이 stroke-dashoffset으로 그려지며 흐른다.
// index(0~3): 4개 카드가 하나의 긴 경로(x 0~1180)를 viewBox x-오프셋(0/295/590/885)으로
// 잘라 보여줘 라인이 카드 사이로 '이어지게' 한다. (실제 사이트 방식)
type FlowLinesProps = { className?: string; index?: number }

// 실제 사이트 SVG 경로 (viewBox 0 0 295 292, preserveAspectRatio="none")
const BASE = [
  'M0 210C180 92 296 74 430 128C574 186 672 138 792 88C936 28 1040 62 1180 122',
  'M0 252C142 162 268 140 420 176C584 215 692 178 830 138C976 96 1066 112 1180 164',
  'M0 174C156 116 276 120 414 150C582 188 716 154 862 102C996 54 1088 54 1180 82',
  'M0 126C168 80 296 88 438 116C608 148 742 122 884 76C1002 38 1102 30 1180 48',
]
const SCAN1 = 'M2 212C184 92 298 72 430 128C574 188 674 138 792 88C934 28 1040 62 1180 122'
const SCAN2 = 'M0 252C142 162 268 140 420 176C584 215 692 178 830 138C976 96 1066 112 1180 164'

export default function FlowLines({ className = '', index = 0 }: FlowLinesProps) {
  return (
    <>
      <svg
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
        preserveAspectRatio="none"
        style={{ mixBlendMode: 'overlay' }}
        viewBox={`${index * 295} 0 295 292`}
      >
        <g fill="none" opacity="0.48" stroke="rgba(255,255,255,0.62)" strokeLinecap="round" strokeWidth="1.35" vectorEffect="non-scaling-stroke">
          {BASE.map((d) => <path d={d} key={d} />)}
        </g>
        <path className="alldepth-scan-line" d={SCAN1} fill="none" stroke="#FFF4DD" strokeLinecap="round" strokeWidth="2.25" vectorEffect="non-scaling-stroke" />
        <path className="alldepth-scan-line alldepth-scan-line--delay" d={SCAN2} fill="none" stroke="#FFF4DD" strokeLinecap="round" strokeWidth="2.25" vectorEffect="non-scaling-stroke" />
      </svg>
      <style>{`
        .alldepth-scan-line { stroke-dasharray: 1300; stroke-dashoffset: 1300px; filter: drop-shadow(0 0 10px rgba(255,244,221,0.85)); animation: alldepth-scan 4.8s cubic-bezier(0.65,0,0.18,1) infinite; }
        .alldepth-scan-line--delay { opacity: 0.75; animation-delay: 0.46s; }
        @keyframes alldepth-scan {
          0% { stroke-dashoffset: 1300px; opacity: 0; }
          10% { opacity: 1; }
          70% { stroke-dashoffset: 0; opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .alldepth-scan-line, .alldepth-scan-line--delay { stroke-dashoffset: 0; opacity: 0.6; animation: none; }
        }
      `}</style>
    </>
  )
}
