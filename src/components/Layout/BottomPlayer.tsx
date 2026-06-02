import { useState, useRef, useCallback } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Disc3, Heart, ListMusic } from "lucide-react"
import { usePlayerStore } from "../../stores/usePlayerStore"
import { useLikeStore } from "../../stores/useLikeStore"
import { useAuthStore } from "../../stores/useAuthStore"
import { useAppStore } from "../../stores/useAppStore"
import { formatTime, getImgUrl } from "../../utils/format"
import { handleImgError } from "../../utils/format"

function AlbumCover({ url, isPlaying }: { url?: string; isPlaying: boolean }) {
  if (url) return (
    <img src={getImgUrl(url, 120)}
      className={`w-12 h-12 rounded-md object-cover shrink-0 shadow-lg ${isPlaying ? "animate-spin-slow" : ""}`}
      style={{ animationDuration: "6s", animationPlayState: isPlaying ? "running" : "paused" }}
      alt=""  onError={handleImgError} />
  )
  return (
    <div className="w-12 h-12 rounded-md bg-[var(--color-bg-elevated)] flex items-center justify-center shrink-0">
      <Disc3 size={22} className="text-[var(--color-text-muted)]" />
    </div>
  )
}

export function BottomPlayer() {
  const {
    currentSong, isPlaying, currentTime, duration, volume, isMuted, isLoading, error,
    toggle, next, prev, seek, setVolume, setMuted, toggleFullPlayer, togglePlayQueue,
  } = usePlayerStore()
  const { toggleLike, isLiked } = useLikeStore()
  const { isLoggedIn } = useAuthStore()
  const { setShowLogin } = useAppStore()
  const [hoverProgress, setHoverProgress] = useState<number | null>(null)
  const [hoverTime, setHoverTime] = useState("")
  const barRef = useRef<HTMLDivElement>(null)
  const prevVolumeRef = useRef(volume)

  const getProgressFromEvent = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (!barRef.current) return 0
    const rect = barRef.current.getBoundingClientRect()
    return Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
  }, [])

  const handleBarMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    const prog = getProgressFromEvent(e)
    seek(prog * duration)
    const onMove = (ev: MouseEvent) => seek(getProgressFromEvent(ev) * duration)
    const onUp = () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp) }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
  }, [duration, seek, getProgressFromEvent])

  if (!currentSong) return null

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0
  const liked = isLiked(currentSong.id)
  const albumUrl = currentSong.al?.picUrl || currentSong.album?.picUrl

  const toggleMute = () => {
    if (volume > 0 && !isMuted) { prevVolumeRef.current = volume; setMuted(true) }
    else { setMuted(false); setVolume(prevVolumeRef.current || 0.8) }
  }

  const artists = (currentSong.ar?.map((a: any) => a.name).join(" / ") || "") || currentSong.artists?.map((a: any) => a.name).join(" / ") || ""

  return (
    <div className="shrink-0 bg-[var(--color-bg-surface)] border-t border-[var(--color-border)] animate-slide-up-fade-sm">
      <div className="relative px-0 cursor-pointer"
        onMouseDown={handleBarMouseDown}
        onMouseMove={(e) => {
          const prog = getProgressFromEvent(e)
          setHoverProgress(prog)
          setHoverTime(formatTime(prog * duration))
        }}
        onMouseLeave={() => { setHoverProgress(null); setHoverTime("") }}>
        <div className="h-4 flex items-center" ref={barRef}>
          <div className="w-full h-0.5 group-hover:h-1.5 transition-all duration-150 bg-[var(--color-bg-elevated)] relative">
            <div className="absolute inset-y-0 left-0 bg-white/60 group-hover:bg-[var(--color-primary)] transition-colors rounded-full" style={{ width: `${progress}%` }} />
            {hoverProgress !== null && (
              <div className="absolute inset-y-0 left-0 bg-white/10 rounded-full" style={{ width: `${hoverProgress * 100}%` }} />
            )}
            <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `calc(${progress}% - 6px)` }} />
          </div>
        </div>
        {hoverTime && (
          <div className="absolute -top-5 px-1.5 py-0.5 bg-[var(--color-bg-elevated)] rounded text-[10px] text-white shadow pointer-events-none z-10"
            style={{ left: `${(hoverProgress || 0) * 100}%`, transform: "translateX(-50%)" }}>
            {hoverTime}
          </div>
        )}
      </div>

      <div className="h-[64px] flex items-center px-4 gap-3">
        <button onClick={toggleFullPlayer} className="flex items-center gap-3 min-w-0 flex-1 max-w-[280px] text-left">
          <AlbumCover url={albumUrl} isPlaying={isPlaying} />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium truncate">{currentSong.name}</p>
              {isLoading && <div className="w-3 h-3 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin shrink-0" />}
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] truncate">{artists}</p>
          </div>
        </button>

        <div className="flex flex-col items-center gap-0.5 flex-1">
          <div className="flex items-center gap-4">
            <button onClick={prev} className="p-1 text-[var(--color-text-secondary)] hover:text-white transition-colors"><SkipBack size={16} /></button>
            <button onClick={toggle} className="p-2 bg-white rounded-full hover:scale-105 active:scale-95 text-black transition-all shadow-lg">
              {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
            </button>
            <button onClick={next} className="p-1 text-[var(--color-text-secondary)] hover:text-white transition-colors"><SkipForward size={16} /></button>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[10px] text-[var(--color-text-muted)] tabular-nums">
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 flex-1 justify-end">
          <button onClick={() => { if (isLoggedIn) toggleLike(currentSong.id); else setShowLogin(true) }}
            className="p-1.5 text-[var(--color-text-muted)] hover:text-white transition-colors">
            <Heart size={16} className={liked ? "fill-[var(--color-primary)] text-[var(--color-primary)]" : ""} />
          </button>
          <button onClick={togglePlayQueue} className="p-1.5 text-[var(--color-text-muted)] hover:text-white transition-colors"><ListMusic size={16} /></button>
          <div className="flex items-center gap-1 ml-2">
            <button onClick={toggleMute} className="p-1.5 text-[var(--color-text-muted)] hover:text-white transition-colors">
              {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <input type="range" min="0" max="1" step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => { setMuted(false); setVolume(parseFloat(e.target.value)) }}
              className="w-16 h-1 accent-[var(--color-primary)] cursor-pointer volume-slider" />
          </div>
          {error && <span className="text-[10px] text-red-400 max-w-[80px] truncate">{error}</span>}
        </div>
      </div>
    </div>
  )
}
