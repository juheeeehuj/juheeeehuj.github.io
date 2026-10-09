type SquareMatrixProps = {
  children: React.ReactNode[]
  className?: string
}

export default function SquareMatrix({ children, className = '' }: SquareMatrixProps) {
  return (
    <div className={`grid grid-cols-1 gap-[clamp(0.75rem,1vw,1.25rem)] sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {children.map((child, index) => <div className="aspect-square min-h-0 overflow-hidden" key={index}>{child}</div>)}
    </div>
  )
}
