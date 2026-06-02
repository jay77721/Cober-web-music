import { NavLink, useLocation } from "react-router-dom"
import { Compass, TrendingUp, Search, Library, Clapperboard, Film } from "lucide-react"
import { MOBILE_TABS } from "../../utils/constants"
import { useAuthStore } from "../../stores/useAuthStore"
import { useAppStore } from "../../stores/useAppStore"
import type { LucideIcon } from "lucide-react"

const iconMap: Record<string, LucideIcon> = { Compass, TrendingUp, Search, Library, Clapperboard, Film }

export function MobileNav() {
  const location = useLocation()
  const { isLoggedIn } = useAuthStore()
  const { setShowLogin } = useAppStore()

  return (
    <nav className="h-16 border-t border-[var(--color-border)] flex items-center justify-around shrink-0 bg-[var(--color-bg-surface)]">
      {MOBILE_TABS.map((tab) => {
        const Icon = iconMap[tab.icon] || Compass
        const isActive = location.pathname === tab.path
        return (
          <NavLink key={tab.path} to={tab.path}
            className={`relative flex flex-col items-center justify-center gap-0.5 text-xs transition-all duration-200 w-full h-full ${
              isActive ? "text-[var(--color-primary)]" : "text-[var(--color-text-muted)]"
            }`}>
            {isActive && <div className="absolute top-0 w-6 h-0.5 bg-[var(--color-primary)] rounded-full" />}
            <div className={`p-1 rounded-full transition-all duration-200 ${isActive ? "bg-[var(--color-primary-dim)]" : ""}`}>
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
            </div>
            <span className="text-[10px] font-medium">{tab.label}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}
