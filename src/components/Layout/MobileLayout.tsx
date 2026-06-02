import { Outlet, NavLink } from "react-router-dom"
import { Music, Compass, Search, TrendingUp, Clapperboard, Library, X } from "lucide-react"
import { Topbar } from "./Topbar"
import { MiniPlayer } from "./MiniPlayer"
import { MobileNav } from "./MobileNav"
import { useAppStore } from "../../stores/useAppStore"
import { SIDEBAR_MENU } from "../../utils/constants"
import type { LucideIcon } from "lucide-react"

const iconMap: Record<string, LucideIcon> = { Compass, Search, TrendingUp, Clapperboard, Library }

export function MobileLayout() {
  const { showSidebar, setShowSidebar } = useAppStore()

  return (
    <div className="h-full flex flex-col">
      <Topbar />
      <main className="flex-1 overflow-y-auto bg-[var(--color-bg-base)]">
        <Outlet />
      </main>
      <MiniPlayer />
      <MobileNav />

      {showSidebar && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={() => setShowSidebar(false)} />
          <aside className="relative w-[240px] h-full flex flex-col bg-[var(--color-bg-surface)] shadow-2xl animate-slide-in-left z-10">
            <div className="h-14 flex items-center justify-between px-4 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-2">
                <Music size={24} className="text-[var(--color-primary)]" />
                <span className="text-base font-bold">Cober Music</span>
              </div>
              <button onClick={() => setShowSidebar(false)} className="p-1.5 hover:bg-[var(--color-bg-elevated)] rounded-full">
                <X size={18} />
              </button>
            </div>
            <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
              {SIDEBAR_MENU.map((item) => {
                const Icon = iconMap[item.icon] || Compass
                return (
                  <NavLink key={item.path} to={item.path} end
                    onClick={() => setShowSidebar(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive ? "bg-[var(--color-primary)] text-white" : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"}`
                    }>
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                )
              })}
            </nav>
          </aside>
        </div>
      )}
    </div>
  )
}