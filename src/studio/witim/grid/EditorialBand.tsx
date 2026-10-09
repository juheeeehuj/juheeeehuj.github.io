type EditorialBandProps = {
  children?: React.ReactNode
  dark?: boolean
  title: string
}

export default function EditorialBand({ children, dark = false, title }: EditorialBandProps) {
  return (
    <div className={`grid w-full gap-[clamp(2rem,4vw,5rem)] px-[5.2vw] py-[clamp(5rem,10.4vw,12.5rem)] md:grid-cols-2 ${dark ? 'text-white' : 'text-[#111]'}`}>
      <h2 className="text-[clamp(1.15rem,1.6vw,1.6rem)] font-bold leading-[1.2] tracking-[-0.02em]">{title}</h2>
      <div className={dark ? 'text-white/65' : 'text-black/55'}>{children}</div>
    </div>
  )
}
