import type { ElementType, ReactNode } from 'react'

type ContainerProps = {
  as?: ElementType
  className?: string
  children: ReactNode
}

/**
 * 텍스트/구성 콘텐츠 컨테이너 — 사용자 확정 폭 max-w-[1440px] 중앙 정렬 + 좌우 거터.
 * 이 폭 규칙의 단일 출처. (리파인처럼 섹션마다 컨테이너 문자열을 복붙하지 않는다.)
 * 이미지 풀블리드 섹션은 이 컴포넌트를 쓰지 않고 <Section> 바로 아래에 미디어를 둔다.
 */
export default function Container({ as: Element = 'div', className = '', children }: ContainerProps) {
  return (
    <Element className={`mx-auto w-full max-w-[1440px] px-6 md:px-10 lg:px-16 ${className}`}>{children}</Element>
  )
}
