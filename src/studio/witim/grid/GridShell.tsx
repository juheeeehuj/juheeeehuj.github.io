type GridShellProps = {
  children?: React.ReactNode
  className?: string
  dark?: boolean
}

export default function GridShell({ children, className = '', dark = false }: GridShellProps) {
  return (
    <section
      className={`${dark ? 'bg-[#0f0f13] text-white' : 'bg-[#f7f7f6] text-[#111]'} px-[clamp(1.5rem,5.2vw,6.25rem)] py-[clamp(5rem,10.4vw,12.5rem)] ${className}`}
    >
      {children}
    </section>
  )
}
