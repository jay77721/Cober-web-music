import { NavLink, useLocation } from "react-router-dom"
import { Compass, Search, TrendingUp, Clapperboard, Library, Film, Palette } from "lucide-react"
import { SIDEBAR_MENU } from "../../utils/constants"
import { useThemeStore } from "../../stores/useThemeStore"
import type { LucideIcon } from "lucide-react"

const iconMap: Record<string, LucideIcon> = { Compass, Search, TrendingUp, Clapperboard, Library, Film }

export function Sidebar() {
  const location = useLocation()
  const { togglePrefs, presetName } = useThemeStore()

  return (
    <aside className="w-56 h-full flex flex-col bg-[var(--color-bg-surface)] shrink-0 border-r border-[var(--color-border)]">
      <div className="h-16 flex items-center px-6 gap-2.5">
        <img src="/logo.png" alt="Cober Music" className="w-8 h-8 rounded-full object-cover" />
        <span className="text-base font-bold tracking-tight">Cober</span>
      </div>
      <nav className="flex-1 px-3 py-2 space-y-1">
        {SIDEBAR_MENU.map((item) => {
          const Icon = iconMap[item.icon] || Compass
          const isActive = location.pathname === item.path
          return (
            <NavLink key={item.path} to={item.path} end
              className={`relative flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-[var(--color-primary-dim)] text-[var(--color-primary)]"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-highlight)] hover:text-[var(--color-text-primary)]"
              }`}>
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-[var(--color-primary)] rounded-full" />}
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>
      {/* Theme preferences */}
      <div className="px-3 py-3 border-t border-[var(--color-border)] space-y-1">
        <button onClick={togglePrefs}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-highlight)] hover:text-[var(--color-text-primary)] transition-all">
          <Palette size={18} />
          <span>����ƫ��</span>
          <span className="ml-auto w-3 h-3 rounded-full" style={{ backgroundColor: "var(--color-primary)" }} />
        </button>
      </div>
    </aside>
  )
}
