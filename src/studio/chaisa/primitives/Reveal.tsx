'use client'

import { useEffect, useRef } from 'react'

type RevealProps = {
  as?: React.ElementType
  children?: React.ReactNode
  className?: string
  delay?: number
  style?: React.CSSProperties
}

export default function Reveal({ as: Element = 'div', children, className = '', delay = 0, style }: RevealProps) {
  const elementRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element || typeof IntersectionObserver === 'undefined') return undefined

    element.classList.add('reveal-pending')

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      element.classList.remove('reveal-pending')
      element.classList.add('is-visible')
      observer.unobserve(element)
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <Element
      className={`translate-y-0 opacity-100 transition-[opacity,transform] duration-700 ease-out [&.reveal-pending]:translate-y-8 [&.reveal-pending]:opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${className}`}
      ref={elementRef}
      style={{ ...style, transitionDelay: `${delay}ms` }}
    >
      {children}
    </Element>
  )
}
