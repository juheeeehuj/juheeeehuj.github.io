type AsymmetricBoardProps = {
  featured: React.ReactNode
  stacked: React.ReactNode[]
  className?: string
  stackClassName?: string
  flip?: boolean
}

// flip: featured(넓은 칸)를 오른쪽에 두고 stacked를 왼쪽으로 보낸다.
export default function AsymmetricBoard({ featured, stacked, className = '', stackClassName = '', flip = false }: AsymmetricBoardProps) {
  return (
    <div className={`grid gap-[clamp(0.75rem,1vw,1.25rem)] ${flip ? 'lg:grid-cols-[1fr_1.75fr]' : 'lg:grid-cols-[1.75fr_1fr]'} ${className}`}>
      <div className={`min-h-[32rem] overflow-hidden lg:min-h-[52rem] ${flip ? 'lg:order-2' : ''}`}>{featured}</div>
      <div className={`grid auto-rows-fr gap-[clamp(0.75rem,1vw,1.25rem)] ${flip ? 'lg:order-1' : ''} ${stackClassName}`}>
        {stacked.map((item, index) => <div className="min-h-64 overflow-hidden" key={index}>{item}</div>)}
      </div>
    </div>
  )
}
