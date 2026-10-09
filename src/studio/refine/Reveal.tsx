'use client'

import { useEffect, useRef } from 'react'

type RevealProps = {
  as?: React.ElementType
  children?: React.ReactNode
  className?: string
  delay?: number
}

export default function Reveal({ as: Element = 'div', children, className = '', delay = 0 }: RevealProps) {
  const elementRef = useRef<HTMLElement>(null)

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
    <Element
      className={`translate-y-10 opacity-0 transition-[opacity,transform] duration-1000 ease-out [&.is-visible]:translate-y-0 [&.is-visible]:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${className}`}
      ref={elementRef}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Element>
  )
}
