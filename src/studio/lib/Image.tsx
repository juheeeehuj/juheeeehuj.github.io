import type { CSSProperties, ImgHTMLAttributes } from 'react'

// next/image 자리에 쓰는 <img>. 원본이 쓰는 속성(fill·width·height·sizes)만 받는다.
type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & { src: string; fill?: boolean; priority?: boolean }

const fillStyle: CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%', color: 'transparent' }

export default function Image({ fill, priority, style, alt = '', sizes: _sizes, ...rest }: Props) {
  return (
    <img
      alt={alt}
      decoding="async"
      loading={priority ? 'eager' : 'lazy'}
      style={fill ? { ...fillStyle, ...style } : { color: 'transparent', ...style }}
      {...rest}
    />
  )
}
