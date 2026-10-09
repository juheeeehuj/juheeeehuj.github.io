'use client'

import Image from '@studio/lib/Image'
import {
  Bookmark,
  CarFront,
  Check,
  ClipboardCheck,
  Gift,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
  ShieldCheck,
  Store,
  Timer,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { wrapFeedIndex } from './characterFeedModel'
import { slideLabel, tr } from '../../locale'

const AUTOPLAY_MS = 3200
const TRANSITION_MS = 650
const MASCOT_SRC = '/work/chaisa/brand/character/cheetah-upscaled.webp'
const AVATAR_LOGO_SRC = '/work/chaisa/brand/logo/logo-blue.webp'

const POSTS = [
  {
    id: 'compare',
    alt: '내 차 견적을 간편하게 받고 합리적으로 비교하는 차이사 안내',
  },
  {
    id: 'free',
    alt: '회원가입 없이 무료로 받는 차이사 차량 견적 안내',
  },
  {
    id: 'fast',
    alt: '평균 28분 안에 직접 연락하는 차이사 빠른 응답 안내',
  },
  {
    id: 'verified',
    alt: '검증된 전문 업체를 무료로 매칭하는 차이사 안내',
  },
] as const

type Post = (typeof POSTS)[number]

function SpeedLines({ dark = false }: { dark?: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden opacity-70">
      <span
        className={`absolute left-[-18%] top-[13%] h-[2px] w-[72%] -skew-x-[28deg] ${
          dark ? 'bg-black/20' : 'bg-white/30'
        }`}
      />
      <span
        className={`absolute left-[-10%] top-[18%] h-[5px] w-[48%] -skew-x-[28deg] ${
          dark ? 'bg-black/10' : 'bg-white/15'
        }`}
      />
      <span
        className={`absolute right-[-18%] top-[54%] h-[3px] w-[70%] -skew-x-[28deg] ${
          dark ? 'bg-black/20' : 'bg-white/25'
        }`}
      />
      <span
        className={`absolute bottom-[20%] right-[-12%] h-[7px] w-[58%] -skew-x-[28deg] ${
          dark ? 'bg-black/10' : 'bg-white/10'
        }`}
      />
    </div>
  )
}

function Mascot({
  alt,
  className,
}: {
  alt: string
  className: string
}) {
  return (
    <div className={`absolute ${className}`}>
      <Image
        alt={alt}
        className="object-contain object-bottom drop-shadow-[0_18px_24px_rgba(0,0,0,0.24)]"
        fill
        sizes="(max-width: 639px) 48vw, (max-width: 1023px) 24vw, 16vw"
        src={MASCOT_SRC}
      />
    </div>
  )
}

function ComparePost({ alt }: { alt: string }) {
  const services = ['신차패키지', '래핑', '튜닝', '틴팅', '수리·정비', '판금·도색']

  return (
    <div
      aria-label={alt}
      className="relative h-full overflow-hidden bg-[linear-gradient(145deg,#0a83ff_0%,#007aff_43%,#0456b8_100%)] text-white"
      role="img"
    >
      <SpeedLines />
      <div aria-hidden className="absolute -right-[30%] -top-[12%] size-[78%] rounded-full border-[48px] border-white/[0.06]" />

      <Image
        alt=""
        className="absolute left-[8%] top-[7%] h-auto w-[34%] object-contain"
        height={222}
        src="/work/chaisa/brand/logo/logo-white.webp"
        width={1024}
      />

      <h3 className="absolute left-[8%] top-[25%] text-[clamp(1.35rem,2vw,1.75rem)] font-black leading-[1.2] tracking-[-0.055em]">
        내 차 견적,
        <br />
        간편하게 받고
        <br />
        합리적으로 비교하세요
      </h3>

      <Mascot alt="" className="bottom-[-2%] left-[3%] h-[43%] w-[44%]" />

      <div className="absolute bottom-[7%] right-[6%] flex w-[48%] flex-wrap justify-end gap-[6px]">
        {services.map((service) => (
          <span
            className="rounded-full border border-white/15 bg-white/15 px-[10px] py-[6px] text-[clamp(0.56rem,0.9vw,0.75rem)] font-medium tracking-[-0.025em] backdrop-blur-sm"
            key={service}
          >
            {service}
          </span>
        ))}
      </div>
    </div>
  )
}

function FreePost({ alt }: { alt: string }) {
  return (
    <div
      aria-label={alt}
      className="relative h-full overflow-hidden bg-[linear-gradient(155deg,#0d75e8_0%,#0069dc_55%,#06469d_100%)] text-white"
      role="img"
    >
      <SpeedLines />
      <div className="absolute left-[8%] top-[8%]">
        <p className="text-[clamp(0.75rem,1.2vw,1rem)] font-bold text-white/75">무료 견적</p>
        <h3 className="mt-[10px] text-[clamp(1.5rem,2.2vw,2.1rem)] font-black leading-[1.16] tracking-[-0.055em]">
          회원가입 없이
          <br />
          100% 무료
        </h3>
      </div>

      <div className="absolute bottom-[7%] left-[7%] h-[34%] w-[42%] rotate-[-4deg] rounded-[18px] bg-white p-[9%_8%] text-[#007AFF] shadow-[0_22px_50px_rgba(0,20,70,0.28)]">
        <div className="mb-[12%] flex items-center justify-between">
          <ClipboardCheck className="size-[22%]" strokeWidth={2.4} />
          <Gift className="size-[22%] text-[#FDC320]" strokeWidth={2.4} />
        </div>
        <div className="space-y-[10%]">
          {[0, 1, 2].map((item) => (
            <div className="flex items-center gap-[7%]" key={item}>
              <span className="grid size-[15%] place-items-center rounded-full bg-[#007AFF] text-white">
                <Check className="size-[68%]" strokeWidth={3} />
              </span>
              <span className="h-[5px] flex-1 rounded-full bg-[#dbeaff]" />
            </div>
          ))}
        </div>
      </div>

      <Mascot alt="" className="bottom-[-1%] right-[-3%] h-[56%] w-[58%]" />
    </div>
  )
}

function FastPost({ alt }: { alt: string }) {
  return (
    <div
      aria-label={alt}
      className="relative h-full overflow-hidden bg-[linear-gradient(145deg,#ffd72e_0%,#fdc320_58%,#f2aa00_100%)] text-[#111522]"
      role="img"
    >
      <SpeedLines dark />
      <div className="absolute left-[8%] top-[8%] z-10">
        <p className="text-[clamp(0.75rem,1.2vw,1rem)] font-bold text-black/60">빠른 응답</p>
        <h3 className="mt-[10px] text-[clamp(1.5rem,2.2vw,2.1rem)] font-black leading-[1.16] tracking-[-0.055em]">
          평균 28분 안에
          <br />
          직접 연락드려요
        </h3>
      </div>

      <div aria-hidden className="absolute bottom-[9%] right-[2%] grid size-[52%] place-items-center rounded-full bg-[#101522] shadow-[0_24px_45px_rgba(92,59,0,0.22)]">
        <Timer className="size-[72%] text-white" strokeWidth={1.4} />
        <span className="absolute right-[7%] top-[13%] size-[11%] rounded-full bg-[#007AFF]" />
      </div>
      <span aria-hidden className="absolute bottom-[20%] left-[-8%] h-[7px] w-[62%] -skew-x-[28deg] bg-white/55" />
      <span aria-hidden className="absolute bottom-[16%] left-[-1%] h-[3px] w-[52%] -skew-x-[28deg] bg-white/70" />

      <Mascot alt="" className="bottom-[-3%] right-[12%] h-[50%] w-[51%] -rotate-[5deg]" />
    </div>
  )
}

function VerifiedPost({ alt }: { alt: string }) {
  return (
    <div
      aria-label={alt}
      className="relative h-full overflow-hidden bg-[linear-gradient(150deg,#087fff_0%,#005aca_58%,#072f78_100%)] text-white"
      role="img"
    >
      <SpeedLines />
      <div className="absolute left-[8%] top-[8%] z-10">
        <p className="text-[clamp(0.75rem,1.2vw,1rem)] font-bold text-white/70">검증 업체 매칭</p>
        <h3 className="mt-[10px] text-[clamp(1.5rem,2.2vw,2.1rem)] font-black leading-[1.16] tracking-[-0.055em]">
          검증된 전문 업체
          <br />
          무료로 매칭
        </h3>
      </div>

      <div className="absolute left-[8%] top-[42%] grid size-[27%] place-items-center rounded-[28%] border border-white/25 bg-white/15 shadow-[0_20px_46px_rgba(0,23,70,0.25)] backdrop-blur-sm">
        <ShieldCheck className="size-[62%] text-white" strokeWidth={1.7} />
      </div>

      <div className="absolute bottom-[8%] left-[7%] flex w-[58%] gap-[5%]">
        {[CarFront, Store, Check].map((Icon, index) => (
          <span
            className="relative grid aspect-square flex-1 place-items-center rounded-[22%] border border-white/20 bg-white/95 text-[#007AFF] shadow-[0_16px_35px_rgba(0,20,60,0.2)]"
            key={index}
          >
            <Icon className="size-[47%]" strokeWidth={2.2} />
            <span className="absolute -right-[5%] -top-[5%] grid size-[27%] place-items-center rounded-full bg-[#FDC320] text-[#111522]">
              <Check className="size-[65%]" strokeWidth={3} />
            </span>
          </span>
        ))}
      </div>

      <Mascot alt="" className="bottom-[-2%] right-[-10%] h-[49%] w-[50%]" />
    </div>
  )
}

function PortraitPost({ post }: { post: Post }) {
  if (post.id === 'compare') return <ComparePost alt={tr(post.alt)} />
  if (post.id === 'free') return <FreePost alt={tr(post.alt)} />
  if (post.id === 'fast') return <FastPost alt={tr(post.alt)} />
  return <VerifiedPost alt={tr(post.alt)} />
}

function FeedCard({
  post,
  cardRef,
  isClone = false,
}: {
  post: Post
  cardRef: (element: HTMLElement | null) => void
  isClone?: boolean
}) {
  return (
    <article
      aria-hidden={isClone || undefined}
      className="w-[76vw] max-w-[420px] shrink-0 snap-start overflow-hidden rounded-[22px] border border-white/10 bg-[#111827] shadow-[0_18px_60px_rgba(0,0,0,0.35)] sm:w-[40vw] lg:w-[calc((min(100vw,1440px)-60px)/4)]"
      ref={cardRef}
    >
      <div className="flex h-14 items-center gap-3 border-b border-white/10 px-4">
        <span
          aria-hidden
          className="relative size-8 shrink-0 overflow-hidden rounded-full bg-[#0C1120]"
        >
          <Image
            alt=""
            className="absolute left-0 top-1/2 h-auto w-[78px] max-w-none -translate-y-1/2"
            height={347}
            src={AVATAR_LOGO_SRC}
            width={1452}
          />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold tracking-[-0.01em] text-white">
            chaisa.official
          </p>
          <p className="text-[10px] text-white/45">차량 견적 비교 플랫폼</p>
        </div>
        <MoreHorizontal aria-hidden className="size-5 text-white/60" strokeWidth={1.8} />
      </div>

      <div className="relative aspect-[4/5] overflow-hidden">
        <PortraitPost post={post} />
      </div>

      <div className="flex h-[58px] items-center gap-4 px-4 text-white/90">
        <Heart aria-hidden className="size-[21px]" strokeWidth={1.7} />
        <MessageCircle aria-hidden className="size-[21px]" strokeWidth={1.7} />
        <Send aria-hidden className="size-[21px]" strokeWidth={1.7} />
        <Bookmark aria-hidden className="ml-auto size-[21px]" strokeWidth={1.7} />
      </div>
    </article>
  )
}

export default function CharacterFeedCarousel() {
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const cardRefs = useRef<Array<HTMLElement | null>>([])
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [isFocusWithin, setIsFocusWithin] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  const scrollToCard = useCallback(
    (domIndex: number, behavior: ScrollBehavior = reduceMotion ? 'auto' : 'smooth') => {
      const viewport = viewportRef.current
      const card = cardRefs.current[domIndex]
      if (!viewport || !card) return

      const viewportRect = viewport.getBoundingClientRect()
      const cardRect = card.getBoundingClientRect()
      const left = viewport.scrollLeft + cardRect.left - viewportRect.left
      viewport.scrollTo({ behavior, left })
    },
    [reduceMotion],
  )

  const goTo = useCallback(
    (nextIndex: number) => {
      const wrappedIndex = wrapFeedIndex(nextIndex, POSTS.length)
      setActiveIndex(wrappedIndex)
      scrollToCard(wrappedIndex)
    },
    [scrollToCard],
  )

  const goNext = useCallback(() => {
    if (activeIndex < POSTS.length - 1) {
      goTo(activeIndex + 1)
      return
    }

    setActiveIndex(0)
    scrollToCard(POSTS.length)

    if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
    resetTimerRef.current = setTimeout(() => {
      scrollToCard(0, 'auto')
    }, reduceMotion ? 0 : TRANSITION_MS)
  }, [activeIndex, goTo, reduceMotion, scrollToCard])

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setReduceMotion(media.matches)
    updatePreference()
    media.addEventListener('change', updatePreference)
    return () => media.removeEventListener('change', updatePreference)
  }, [])

  useEffect(() => {
    if (isHovering || isFocusWithin || reduceMotion) return undefined

    const interval = window.setInterval(goNext, AUTOPLAY_MS)
    return () => window.clearInterval(interval)
  }, [goNext, isFocusWithin, isHovering, reduceMotion])

  useEffect(
    () => () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current)
    },
    [],
  )

  const handleScroll = () => {
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current)
    scrollTimerRef.current = setTimeout(() => {
      const viewport = viewportRef.current
      if (!viewport) return

      const viewportLeft = viewport.getBoundingClientRect().left
      let closestDomIndex = 0
      let closestDistance = Number.POSITIVE_INFINITY

      cardRefs.current.forEach((card, index) => {
        if (!card) return
        const distance = Math.abs(card.getBoundingClientRect().left - viewportLeft)
        if (distance < closestDistance) {
          closestDistance = distance
          closestDomIndex = index
        }
      })

      setActiveIndex(wrapFeedIndex(closestDomIndex, POSTS.length))
    }, 120)
  }

  return (
    <div
      aria-label={tr('차타 이사님 캠페인 콘텐츠')}
      aria-roledescription="carousel"
      className="relative mt-[clamp(3.5rem,7vw,6.5rem)]"
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsFocusWithin(false)
      }}
      onFocusCapture={() => setIsFocusWithin(true)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      role="region"
    >
      <div
        aria-label={slideLabel(activeIndex + 1, POSTS.length)}
        className="mx-auto w-full max-w-[1440px] overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onScroll={handleScroll}
        ref={viewportRef}
      >
        <div className="flex w-max snap-x snap-mandatory gap-5 px-6 pb-10 md:px-10 lg:px-0">
          {[...POSTS, ...POSTS].map((post, index) => (
            <FeedCard
              cardRef={(element) => {
                cardRefs.current[index] = element
              }}
              isClone={index >= POSTS.length}
              key={`${post.id}-${index}`}
              post={post}
            />
          ))}
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {slideLabel(activeIndex + 1, POSTS.length)}
      </p>
    </div>
  )
}
