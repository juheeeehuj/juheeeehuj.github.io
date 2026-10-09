import { ChevronDown, Hash, Lock, Pin, Plus } from 'lucide-react'
import Avatar from './Avatar'
import { channels, dmRoster, favoriteChannels, members, pinnedMembers } from './data'
import { CHAT_METRICS, type ChatTokens } from './theme'

export default function Sidebar({ t }: { t: ChatTokens }) {
  return (
    <aside
      className="flex flex-col border-r"
      style={{ width: CHAT_METRICS.sidebarWidth, background: t.sidebarBg, borderColor: t.sidebarBorder }}
    >
      <header
        className="flex shrink-0 items-center gap-2.5 px-5"
        style={{ height: CHAT_METRICS.headerHeight }}
      >
        <span
          className="flex h-9 w-9 items-center justify-center rounded-[8px] text-[17px] font-bold"
          style={{ background: t.brand, color: t.onBrand }}
        >
          A
        </span>
        <span className="text-[19px] font-bold tracking-[-0.01em]" style={{ color: t.itemTextActive }}>
          Acme 팀
        </span>
        <ChevronDown className="ml-auto" color={t.sectionLabel} size={20} strokeWidth={2} />
      </header>

      <div className="min-h-0 flex-1 overflow-hidden px-3">
        <SectionLabel t={t}>즐겨찾기</SectionLabel>
        {favoriteChannels.map((channel) => (
          <Row key={channel.name} t={t} trailing={<Pin color={t.sectionLabel} size={16} strokeWidth={2} />}>
            <Hash color={t.sectionLabel} size={17} strokeWidth={2.2} />
            <span>{channel.name}</span>
          </Row>
        ))}

        <SectionLabel action t={t}>
          채널
        </SectionLabel>
        {channels.map((channel) => (
          <Row
            active={channel.active}
            key={channel.name}
            t={t}
            trailing={channel.unread ? <Badge t={t}>{channel.unread}</Badge> : null}
          >
            {channel.locked ? (
              <Lock color={t.sectionLabel} size={16} strokeWidth={2.2} />
            ) : (
              <Hash color={channel.active ? t.itemTextActive : t.sectionLabel} size={17} strokeWidth={2.2} />
            )}
            <span className="truncate">{channel.name}</span>
          </Row>
        ))}

        <SectionLabel t={t}>고정</SectionLabel>
        {pinnedMembers.map((id) => {
          const member = members[id]
          return (
            <Row key={id} t={t} trailing={<Pin color={t.sectionLabel} size={16} strokeWidth={2} />}>
              <Avatar
        theme={t.name}
                hair={member.hair}
                ringColor={t.sidebarBg}
                size={30}
                status={member.status}
              />
              <span className="truncate">{member.name}</span>
            </Row>
          )
        })}

        <SectionLabel t={t}>다이렉트 메시지</SectionLabel>
        {dmRoster.map((dm, index) => (
          <Row key={`${dm.name}-${index}`} t={t} trailing={dm.unread ? <Badge t={t}>{dm.unread}</Badge> : null}>
            <Avatar
        theme={t.name}
              hair={dm.hair}
              ringColor={t.sidebarBg}
              size={30}
              status={dm.status}
            />
            <span className="truncate">{dm.name}</span>
          </Row>
        ))}

        <Row t={t}>
          <ChevronDown color={t.sectionLabel} size={18} strokeWidth={2} />
          <span style={{ color: t.sectionLabel }}>더 보기 (61명)</span>
        </Row>
      </div>

      <footer className="shrink-0 border-t px-3 py-3" style={{ borderColor: t.sidebarBorder }}>
        <Row t={t}>
          <Avatar
        theme={t.name}
            hair="#2F3140"
            ringColor={t.sidebarBg}
            size={30}
          />
          <span>어시스턴트</span>
        </Row>
      </footer>
    </aside>
  )
}

function SectionLabel({
  action,
  children,
  t,
}: {
  action?: boolean
  children: React.ReactNode
  t: ChatTokens
}) {
  return (
    <div className="flex items-center justify-between px-3 pb-1.5 pt-5">
      <span className="text-[13px] font-semibold" style={{ color: t.sectionLabel }}>
        {children}
      </span>
      {action ? <Plus color={t.sectionLabel} size={17} strokeWidth={2.2} /> : null}
    </div>
  )
}

function Row({
  active,
  children,
  t,
  trailing,
}: {
  active?: boolean
  children: React.ReactNode
  t: ChatTokens
  trailing?: React.ReactNode
}) {
  return (
    <div
      className="flex h-10 items-center gap-2.5 rounded-[6px] px-3 text-[15px]"
      style={{
        background: active ? t.sidebarActive : 'transparent',
        color: active ? t.itemTextActive : t.itemText,
        fontWeight: active ? 700 : 500,
      }}
    >
      {children}
      {trailing ? <span className="ml-auto flex items-center">{trailing}</span> : null}
    </div>
  )
}

function Badge({ children, t }: { children: React.ReactNode; t: ChatTokens }) {
  return (
    <span
      className="flex h-[22px] min-w-[22px] items-center justify-center rounded-full px-1.5 text-[12px] font-bold"
      style={{ background: t.brand, color: t.onBrand }}
    >
      {children}
    </span>
  )
}
