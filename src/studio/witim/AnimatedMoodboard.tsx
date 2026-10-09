import RandomMoodboard from './RandomMoodboard'

// 무드보드 갤러리 — 어드민(gallery)에서 이미지를 넣고 빼면 자동 재구성된다(하드코딩 없음).
// 움직임(모션)은 어드민에서 고른다: 위아래 분리 / 전체 흐름 / 정지 / 랜덤 교체.
type MoodboardMotion = 'dual' | 'single' | 'static' | 'random'
type MoodboardImage = {
  alt: string
  src: string
}

// 갤러리가 비었을 때만 쓰는 안전망(기존 values 30장). 운영 중엔 콘텐츠가 항상 채운다.
const FALLBACK_IMAGES: MoodboardImage[] = Array.from({ length: 10 }, (_, index) =>
  [
    { directory: 'together', label: 'Together' },
    { directory: 'easy', label: 'Easy' },
    { directory: 'gather', label: 'Gather' },
  ].map(({ directory, label }) => ({
    alt: `WITIM ${label} 무드 이미지 ${index + 1}`,
    src: `/work/witim-identity/values/${directory}/${directory}-${String(index + 1).padStart(2, '0')}.webp`,
  })),
).flat()

const MOVE_FRACTION = 0.42 // 각 스텝 중 실제 이동에 쓰는 비율 (나머지는 멈춤)
const STEP_DURATION = 2.2 // 스텝 1개(이동 + 멈춤)에 걸리는 시간(초)

// 한 칸 부드럽게 이동 → 멈춤 → 다시 한 칸을 반복하는 키프레임 생성.
// stepCount 만큼 나눠, 100%(= 한 사이클) 동안 endX 까지 이동한다.
function buildStepKeyframes(name: string, stepCount: number, positionAt: (step: number) => number, endX: number) {
  const frames: string[] = []
  for (let step = 0; step < stepCount; step += 1) {
    const moveStart = (step / stepCount) * 100
    const moveEnd = ((step + MOVE_FRACTION) / stepCount) * 100
    frames.push(`${moveStart.toFixed(3)}% { transform: translate3d(${positionAt(step).toFixed(3)}%, 0, 0); animation-timing-function: cubic-bezier(0.6, 0, 0.2, 1); }`)
    frames.push(`${moveEnd.toFixed(3)}% { transform: translate3d(${positionAt(step + 1).toFixed(3)}%, 0, 0); }`)
  }
  frames.push(`100% { transform: translate3d(${endX.toFixed(3)}%, 0, 0); }`)
  return `@keyframes ${name} {\n  ${frames.join('\n  ')}\n}`
}

// 위·아래 행이 같이 움직이고 같이 멈추도록 스텝 수를 공유한다. 이미지 수가 바뀌어도
// 위 행 타일 수에 맞춰 키프레임을 다시 만든다(정적 상수가 아니라 런타임 생성).
function buildStyles(stepCount: number) {
  const steps = Math.max(1, stepCount)
  const cycle = steps * STEP_DURATION
  const unit = 50 / steps // 한 칸 이동량(%) — 사본이 2개라 -50% 가 한 벌 폭
  const left = buildStepKeyframes('moodboard-step-left', steps, (step) => -unit * step, -50)
  const right = buildStepKeyframes('moodboard-step-right', steps, (step) => -50 + unit * step, 0)
  return `${left}
${right}
.moodboard-scroll-left {
  animation: moodboard-step-left ${cycle}s infinite;
  will-change: transform;
}
.moodboard-scroll-right {
  animation: moodboard-step-right ${cycle}s infinite;
  will-change: transform;
}
/* 인터랙션: 무드보드에 마우스를 올리면 흐름이 멈춘다 */
figure[data-moodboard]:hover .moodboard-scroll-left,
figure[data-moodboard]:hover .moodboard-scroll-right {
  animation-play-state: paused;
}
@media (prefers-reduced-motion: reduce) {
  .moodboard-scroll-left,
  .moodboard-scroll-right {
    animation: none;
  }
}`
}

type MoodboardRowProps = {
  scrollClass: string // '' 이면 정지
  duplicate: boolean // 무한 루프용 사본을 붙일지(정지면 불필요)
  images: MoodboardImage[]
}

function MoodboardRow({ scrollClass, duplicate, images }: MoodboardRowProps) {
  const copies = duplicate ? [false, true] : [false]
  return (
    <div className="overflow-hidden">
      <div className={`flex h-full w-max ${scrollClass}`}>
        {copies.map((copy) => (
          <div aria-hidden={copy || undefined} className="flex h-full shrink-0 gap-4 pr-4 md:gap-5 md:pr-5" key={copy ? 'duplicate' : 'original'}>
            {images.map((image, index) => (
              <div className="h-full w-[clamp(12rem,20vw,25rem)] shrink-0 overflow-hidden bg-[#e9ebf4]" key={`${copy ? 'copy' : 'original'}-${index}-${image.src}`}>
                <img alt={copy ? '' : image.alt} className="h-full w-full object-cover" loading="lazy" src={image.src} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

type AnimatedMoodboardProps = {
  images?: MoodboardImage[]
  motion?: MoodboardMotion
}

export default function AnimatedMoodboard({ images, motion = 'dual' }: AnimatedMoodboardProps) {
  const gallery = images && images.length ? images : FALLBACK_IMAGES

  // 랜덤 교체는 타이머·랜덤이 필요해 클라이언트 컴포넌트로 분리.
  if (motion === 'random') return <RandomMoodboard images={gallery} />

  const mid = Math.ceil(gallery.length / 2)
  const rows = [gallery.slice(0, mid), gallery.slice(mid)]
  const animate = motion !== 'static'
  const styles = buildStyles(rows[0].length)
  // 위 행은 항상 왼쪽. 아래 행은 dual=오른쪽, single=왼쪽(같이 흐름), static=정지.
  const topClass = animate ? 'moodboard-scroll-left' : ''
  const bottomClass = !animate ? '' : motion === 'single' ? 'moodboard-scroll-left' : 'moodboard-scroll-right'

  return (
    <figure
      aria-label="WITIM 브랜드 무드보드"
      data-moodboard
      className="grid h-[clamp(34rem,58vw,68rem)] grid-rows-2 gap-4 overflow-hidden bg-[#f4f6fb] py-4 md:gap-5 md:py-5"
    >
      {animate && <style dangerouslySetInnerHTML={{ __html: styles }} />}
      <MoodboardRow scrollClass={topClass} duplicate={animate} images={rows[0]} />
      <MoodboardRow scrollClass={bottomClass} duplicate={animate} images={rows[1].length ? rows[1] : rows[0]} />
    </figure>
  )
}
