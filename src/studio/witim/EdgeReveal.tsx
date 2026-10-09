'use client'

import { useEffect, useRef } from 'react'

// 화면 가장자리에 붙은 미디어를 가까운 쪽에서 슬라이드인시킨다.
// 관찰 대상(바깥 div)은 제자리에 두고 안쪽만 이동시킨다 —
// 관찰 요소를 화면 밖으로 옮기면 뷰포트와 교차하지 않아 콜백이 영영 실행되지 않는다.
const START_OFFSET = {
  left: '-translate-x-full',
  right: 'translate-x-full',
}

type EdgeRevealProps = {
  children?: React.ReactNode
  className?: string
  delay?: number
  from?: keyof typeof START_OFFSET
}

export default function EdgeReveal({ children, className = '', delay = 0, from = 'left' }: EdgeRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return undefined

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      element.classList.add('is-visible')
      observer.unobserve(element)
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 })

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div className={className} ref={elementRef}>
      <div
        className={`${START_OFFSET[from]} opacity-0 transition-[opacity,transform] duration-1000 ease-out [.is-visible_&]:translate-x-0 [.is-visible_&]:opacity-100 motion-reduce:translate-x-0 motion-reduce:opacity-100 motion-reduce:transition-none`}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {children}
      </div>
    </div>
  )
}
