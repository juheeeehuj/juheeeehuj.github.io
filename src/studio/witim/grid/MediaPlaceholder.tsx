type MediaPlaceholderProps = {
  children?: React.ReactNode
  className?: string
  index?: string | number
  label?: string
}

export default function MediaPlaceholder({ children, className = '', index, label = 'MEDIA AREA' }: MediaPlaceholderProps) {
  return (
    <div className={`relative flex h-full min-h-0 w-full items-center justify-center overflow-hidden border border-dashed border-current/25 bg-current/[0.035] ${className}`}>
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_bottom_right,transparent_calc(50%-0.5px),currentColor_50%,transparent_calc(50%+0.5px))] opacity-[0.06]" />
      <div className="relative z-10 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] opacity-45">
        {index && <span>{index}</span>}
        <span>{label}</span>
      </div>
      {children}
    </div>
  )
}
