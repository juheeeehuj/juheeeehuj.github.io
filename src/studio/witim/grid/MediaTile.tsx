import MediaPlaceholder from './MediaPlaceholder'

// 높이는 className으로만 받는다 — 여기서 h-full을 함께 내보내면 Tailwind가 .h-full을
// 임의값(h-[clamp(...)])보다 뒤에 출력해 항상 이기고, 호출부가 지정한 높이가 무시된다.
// (안쪽 MediaPlaceholder의 h-full이 이 figure의 높이를 그대로 채운다.)
type MediaTileProps = {
  children?: React.ReactNode
  className?: string
  label?: string
}

export default function MediaTile({ children, className = '', label = 'MEDIA AREA' }: MediaTileProps) {
  return (
    <figure className={`relative min-h-0 overflow-hidden ${className}`}>
      <MediaPlaceholder label={label}>{children}</MediaPlaceholder>
    </figure>
  )
}
