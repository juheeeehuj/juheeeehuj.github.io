// 화면 캡처를 노트북 목업 안에 넣는다. 이미지 에셋 없이 순수 마크업 —
// 베젤·카메라·힌지 색은 채팅 UI 크롬(#1C1D26)과 같은 값을 쓴다.

export default function LaptopMockup({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full">
      <div
        className="relative rounded-[clamp(0.7rem,1.1vw,1.15rem)] p-[clamp(0.45rem,0.8vw,0.85rem)] pt-[clamp(0.7rem,1.25vw,1.3rem)]"
        style={{ background: '#1C1D26', boxShadow: '0 18px 40px -24px rgba(15,15,19,0.55)' }}
      >
        <span
          className="absolute left-1/2 top-[clamp(0.28rem,0.5vw,0.55rem)] h-[clamp(0.13rem,0.2vw,0.2rem)] w-[clamp(0.13rem,0.2vw,0.2rem)] -translate-x-1/2 rounded-full"
          style={{ background: '#4A4C5E' }}
        />
        <div className="overflow-hidden rounded-[clamp(0.2rem,0.35vw,0.35rem)]">{children}</div>
      </div>

      {/* 하판 — 상판보다 살짝 넓게 빼야 노트북으로 읽힌다 */}
      <div
        className="relative mx-[-2.5%] h-[clamp(0.45rem,0.75vw,0.8rem)] rounded-b-[clamp(0.3rem,0.5vw,0.5rem)]"
        style={{ background: 'linear-gradient(180deg,#D7D9E2 0%,#ABAEBD 55%,#8B8E9D 100%)' }}
      >
        <span
          className="absolute left-1/2 top-0 h-[clamp(0.2rem,0.28vw,0.3rem)] w-[clamp(2.5rem,4.5vw,4.5rem)] -translate-x-1/2 rounded-b-full"
          style={{ background: '#8E91A0' }}
        />
      </div>
    </div>
  )
}
