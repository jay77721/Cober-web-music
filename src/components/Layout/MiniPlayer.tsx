import { Play, Pause, Disc3, Heart } from "lucide-react"
import { usePlayerStore } from "../../stores/usePlayerStore"
import { useLikeStore } from "../../stores/useLikeStore"
import { useAuthStore } from "../../stores/useAuthStore"
import { useAppStore } from "../../stores/useAppStore"
import { getImgUrl } from "../../utils/format"
import { handleImgError } from "../../utils/format"

export function MiniPlayer() {
  const { currentSong, isPlaying, currentTime, duration, toggle, toggleFullPlayer } = usePlayerStore()
  const { toggleLike, isLiked } = useLikeStore()
  const { isLoggedIn } = useAuthStore()
  const { setShowLogin } = useAppStore()
  if (!currentSong) return null
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0
  const liked = isLiked(currentSong.id)
  const albumUrl = currentSong.al?.picUrl || currentSong.album?.picUrl

  return (
    <div className="shrink-0 bg-[var(--color-bg-surface)] border-t border-[var(--color-border)]">
      <div className="h-0.5 bg-[var(--color-bg-elevated)]">
        <div className="h-full bg-white/60 transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>
      <div className="h-[56px] flex items-center px-3 gap-3" onClick={toggleFullPlayer}>
        {albumUrl ? (
          <img src={getImgUrl(albumUrl, 120)}
            className={`w-10 h-10 rounded-md object-cover shrink-0 ${isPlaying ? "animate-spin-slow" : ""}`}
            style={{ animationDuration: "6s", animationPlayState: isPlaying ? "running" : "paused" }}
            alt=""  onError={handleImgError} />
        ) : (
          <div className="w-10 h-10 rounded-md bg-[var(--color-bg-elevated)] flex items-center justify-center shrink-0">
            <Disc3 size={18} className="text-[var(--color-text-muted)]" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{currentSong.name}</p>
          <p className="text-xs text-[var(--color-text-secondary)] truncate">
            {(currentSong.ar?.map((a: any) => a.name).join(" / ") || "") || currentSong.artists?.map((a: any) => a.name).join(" / ")}
          </p>
        </div>
        <button onClick={(e) => { e.stopPropagation(); if (isLoggedIn) toggleLike(currentSong.id); else setShowLogin(true) }}
          className="p-2.5 md:p-1.5 shrink-0 touch-manipulation min-h-[44px] min-w-[44px]">
          <Heart size={18} className={liked ? "fill-[var(--color-primary)] text-[var(--color-primary)]" : "text-[var(--color-text-muted)]"} />
        </button>
        <button onClick={(e) => { e.stopPropagation(); toggle() }} className="p-3 md:p-2 shrink-0 touch-manipulation min-h-[44px] min-w-[44px]">
          {isPlaying ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
        </button>
      </div>
    </div>
  )
}
