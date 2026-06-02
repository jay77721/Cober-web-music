import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Menu, LogIn, ChevronLeft, ChevronRight } from "lucide-react"
import { useAuthStore } from "../../stores/useAuthStore"
import { useAppStore } from "../../stores/useAppStore"
import { useIsDesktop } from "../../hooks/useMediaQuery"

export function Topbar() {
  const navigate = useNavigate()
  const [kw, setKw] = useState("")
  const { isLoggedIn, user } = useAuthStore()
  const { setShowLogin, toggleSidebar } = useAppStore()
  const isDesktop = useIsDesktop()

  return (
    <header className="h-16 flex items-center px-6 gap-3 shrink-0 bg-[var(--color-bg-base)]">
      {!isDesktop && (
        <button onClick={toggleSidebar} className="p-2.5 -ml-2.5 hover:bg-white/10 rounded-full transition-colors touch-manipulation min-h-[44px] min-w-[44px]">
          <Menu size={20} />
        </button>
      )}
      {/* Nav arrows (desktop) */}
      <div className="hidden md:flex items-center gap-1">
        <button onClick={() => navigate(-1)} className="p-1.5 bg-black/40 rounded-full text-white/60 hover:text-white transition-colors">
          <ChevronLeft size={18} />
        </button>
        <button onClick={() => navigate(1)} className="p-1.5 bg-black/40 rounded-full text-white/60 hover:text-white transition-colors">
          <ChevronRight size={18} />
        </button>
      </div>
      {/* Search */}
      <div className="flex-1 max-w-md flex items-center bg-white/5 backdrop-blur-sm border border-white/5 rounded-full px-3.5 h-9 gap-2 hover:bg-white/10 focus-within:bg-white/10 focus-within:border-white/20 transition-all duration-200">
        <Search size={16} className="text-[var(--color-text-muted)]" />
        <input className="flex-1 bg-transparent border-none p-0 text-sm placeholder:text-[var(--color-text-muted)]"
          placeholder="搜索歌曲、歌手、专辑"
          value={kw} onChange={(e) => setKw(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && kw.trim() && navigate(`/search?q=${encodeURIComponent(kw.trim())}`)} />
      </div>
      {/* User */}
      <div className="flex items-center gap-2">
        {isLoggedIn ? (
          <button onClick={() => navigate("/user")} className="p-0.5 rounded-full hover:ring-2 hover:ring-white/30 transition-all">
            <img src={user?.avatarUrl} className="w-7 h-7 rounded-full" alt="" />
          </button>
        ) : (
          <button onClick={() => setShowLogin(true)}
            className="px-5 h-8 rounded-full bg-white text-black text-sm font-semibold hover:scale-105 active:scale-95 transition-all shadow-lg">
            登录
          </button>
        )}
      </div>
    </header>
  )
}
