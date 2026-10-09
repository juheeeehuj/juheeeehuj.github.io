import {
  Bell,
  Bookmark,
  House,
  LayoutGrid,
  MessageSquare,
  RefreshCw,
  Search,
  Settings,
} from 'lucide-react'
import Avatar from './Avatar'
import { CHAT_METRICS, type ChatTokens } from './theme'

const NAV = [MessageSquare, Bell, Search, LayoutGrid, Bookmark]

export default function Rail({ t }: { t: ChatTokens }) {
  return (
    <nav
      className="flex flex-col items-center justify-between border-r py-4"
      style={{ width: CHAT_METRICS.railWidth, background: t.railBg, borderColor: t.sidebarBorder }}
    >
      <div className="flex flex-col items-center gap-2">
        <RailButton t={t}>
          <House size={22} strokeWidth={1.8} />
        </RailButton>
        <div className="h-3" />
        {NAV.map((Icon, index) => (
          <RailButton active={index === 0} key={Icon.displayName ?? index} t={t}>
            <Icon size={22} strokeWidth={1.8} />
          </RailButton>
        ))}
      </div>

      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-col items-center gap-1.5">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-[10px]"
            style={{ background: t.brand, color: t.onBrand }}
          >
            <RefreshCw size={20} strokeWidth={2} />
          </div>
          <span className="text-[12px] font-semibold" style={{ color: t.metaText }}>
            v0.1
          </span>
        </div>
        <RailButton t={t}>
          <Settings size={22} strokeWidth={1.8} />
        </RailButton>
        <Avatar
        theme={t.name}
          hair="#C9CFFF"
          ringColor={t.railBg}
          size={36}
          status="online"
        />
      </div>
    </nav>
  )
}

function RailButton({
  active,
  children,
  t,
}: {
  active?: boolean
  children: React.ReactNode
  t: ChatTokens
}) {
  return (
    <span
      className="flex h-11 w-11 items-center justify-center rounded-[10px]"
      style={{
        background: active ? t.railActive : 'transparent',
        color: active ? t.railIconActive : t.railIcon,
      }}
    >
      {children}
    </span>
  )
}
