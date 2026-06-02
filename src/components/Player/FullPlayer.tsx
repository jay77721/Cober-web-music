import { useEffect, useRef, useCallback } from "react"
import { X, ChevronDown, Play, Pause, SkipBack, SkipForward, Heart, Repeat, Shuffle, Repeat1, Disc3, ListMusic, Volume2, VolumeX } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { usePlayerStore } from "../../stores/usePlayerStore"
import { useLikeStore } from "../../stores/useLikeStore"
import { useAuthStore } from "../../stores/useAuthStore"
import { useAppStore } from "../../stores/useAppStore"
import { formatTime, getImgUrl } from "../../utils/format"
import { handleImgError } from "../../utils/format"
import { SimiSongs } from "../SimiSongs"
import type { PlayMode, AudioQuality } from "../../types/player"
import gsap from "gsap"

const MODE_LIST: PlayMode[] = ["sequence", "loop", "shuffle", "single"]
const modeIcons: Record<string, LucideIcon> = { sequence: Repeat, loop: Repeat, shuffle: Shuffle, single: Repeat1 }
const modeLabels: Record<string, string> = { sequence: "顺序播放", loop: "列表循环", shuffle: "随机播放", single: "单曲循环" }
const QUALITY_LABELS: Record<AudioQuality, string> = { standard: "标准", high: "高清", lossless: "无损" }

export function FullPlayer() {
  const {
    currentSong, isPlaying, currentTime, duration, volume, playMode, lyrics, currentLyricIndex,
    showFullPlayer, bufferProgress, isLoading, error,
    toggle, next, prev, seek, setPlayMode, toggleFullPlayer, togglePlayQueue,
    setVolume, setAudioQuality, audioQuality, setCrossfade, crossfade, isMuted, setMuted,
  } = usePlayerStore()
  const { toggleLike, isLiked } = useLikeStore()
  const { isLoggedIn } = useAuthStore()
  const { setShowLogin } = useAppStore()
  const lyricsRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const prevShowRef = useRef(false)
  const prevSongIdRef = useRef<number | null>(null)
  const gsapCtxRef = useRef<gsap.Context | null>(null)

  // ─── GSAP open/close transition ───
  useEffect(() => {
    const el = panelRef.current
    if (!el) return
    if (showFullPlayer && !prevShowRef.current) {
      gsap.fromTo(el,
        { opacity: 0, scale: 0.92, y: 40 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "power3.out" }
      )
    } else if (!showFullPlayer && prevShowRef.current) {
      gsap.to(el, {
        opacity: 0, scale: 0.92, y: 40, duration: 0.25, ease: "power2.in",
      })
    }
    prevShowRef.current = showFullPlayer
  }, [showFullPlayer])

  // ─── GSAP album art entrance — 只在 FullPlayer 打开时触发一次，而非每次切歌 ───
  useEffect(() => {
    if (!showFullPlayer) return
    const el = panelRef.current
    if (!el) return

    // 如果已经针对当前歌曲播过入场动画，跳过
    const songId = currentSong?.id ?? null
    if (songId === prevSongIdRef.current) return
    prevSongIdRef.current = songId

    // 清理旧 context
    if (gsapCtxRef.current) gsapCtxRef.current.revert()

    const ctx = gsap.context(() => {
      const albumArt = el.querySelector("[data-album-art]")
      const controls = el.querySelector("[data-controls-area]")
      if (albumArt) { gsap.set(albumArt, { clearProps: "all" }); gsap.fromTo(albumArt, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }) }
      if (controls) { gsap.set(controls, { clearProps: "all" }); gsap.fromTo(controls, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }) }
    }, el)
    gsapCtxRef.current = ctx

    return () => { if (gsapCtxRef.current) { gsapCtxRef.current.revert(); gsapCtxRef.current = null } }
  }, [showFullPlayer, currentSong?.id])

  useEffect(() => {
    if (lyricsRef.current && currentLyricIndex >= 0) {
      const el = lyricsRef.current.children[currentLyricIndex] as HTMLElement
      if (el) {
        gsap.to(lyricsRef.current, {
          scrollTop: el.offsetTop - lyricsRef.current.clientHeight / 2 + el.clientHeight / 2,
          duration: 0.4,
          ease: "power2.out",
        })
      }
    }
  }, [currentLyricIndex])

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

  const cyclePlayMode = () => {
    const idx = MODE_LIST.indexOf(playMode)
    setPlayMode(MODE_LIST[(idx + 1) % MODE_LIST.length])
  }

  const cycleQuality = () => {
    const qualities: AudioQuality[] = ["standard", "high", "lossless"]
    const idx = qualities.indexOf(audioQuality)
    setAudioQuality(qualities[(idx + 1) % qualities.length])
  }

  if (!showFullPlayer || !currentSong) return null

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0
  const buffer = duration > 0 ? bufferProgress * 100 : 0
  const ModeIcon = modeIcons[playMode] || Repeat
  const liked = isLiked(currentSong.id)
  const albumUrl = currentSong.al?.picUrl || currentSong.album?.picUrl

  return (
    <div ref={panelRef}
      className="fixed inset-0 z-50 flex flex-col bg-black ">
      {albumUrl && (
        <div className="absolute inset-0 transition-all duration-700">
          <img src={getImgUrl(albumUrl, 500)} className="w-full h-full object-cover opacity-40"
            style={{ filter: "blur(80px) saturate(1.5)" }} alt=""  onError={handleImgError} />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      )}
      {!albumUrl && <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-black" />}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/90 via-black/60 to-transparent">
          <button onClick={toggleFullPlayer} className="p-3 md:p-2 touch-manipulation min-h-[44px] hover:bg-white/20 rounded-2xl md:rounded-full transition-colors min-w-[44px] text-white">
            <ChevronDown size={22} /><span className="text-sm font-medium hidden sm:inline ml-1">收起</span>
          </button>
          <div className="flex items-center gap-3">
            {isLoading && <div className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />}
            {error && <span className="text-xs text-red-400">{error}</span>}
          </div>
          <button onClick={toggleFullPlayer} className="p-3 md:p-2 touch-manipulation min-h-[44px] hover:bg-white/20 rounded-2xl md:rounded-full transition-colors min-w-[44px] text-white">
            <><span className="text-sm font-medium hidden sm:inline mr-1">关闭</span><X size={20} /></>
          </button>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-4 md:gap-8 px-4 md:px-6 lg:px-12 pb-2 md:pb-4 min-h-0">
          <div data-album-art className="w-44 h-44 md:w-64 md:h-64 lg:w-80 lg:h-80 shrink-0">
            {albumUrl ? (
              <img src={getImgUrl(albumUrl, 500)}
                className="w-full h-full rounded-full object-cover shadow-2xl animate-spin-slow"
                style={{ animationPlayState: isPlaying ? "running" : "paused" }}
                alt=""  onError={handleImgError} />
            ) : (
              <div className="w-full h-full rounded-full bg-white/5 flex items-center justify-center">
                <Disc3 size={60} className="text-white/20" />
              </div>
            )}
          </div>

          <div className="flex-1 max-w-xl w-full flex flex-col min-h-0">
            <div className="hidden lg:block w-64 shrink-0 overflow-y-auto px-2">
            <SimiSongs />
          </div>
          <div ref={lyricsRef} className="flex-1 md:flex-none md:h-64 lg:h-80 overflow-y-auto text-center space-y-5 px-4"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              {lyrics.length === 0 && <p className="text-white/40 mt-20">{isLoading ? "加载歌词中..." : "暂无歌词"}</p>}
              {lyrics.map((line: any, i: number) => (
                <p key={i}
                  className={`transition-all duration-500 text-base leading-relaxed ${
                    i === currentLyricIndex
                      ? "text-white text-xl font-semibold scale-105"
                      : i < currentLyricIndex
                        ? "text-white/30"
                        : "text-white/50"
                  }`}>
                  {line.text || "\u00A0"}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom controls */}
        <div data-controls-area className="px-3 md:px-6 pb-3 md:pb-6 space-y-2 md:space-y-3 bg-[#0a0a0a] border-t border-white/10">
          <div className="flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{currentSong.name}</p>
              <p className="text-xs text-white/80 truncate">
                {(currentSong.ar?.map((a: any) => a.name).join(" / ") || "") || currentSong.artists?.map((a: any) => a.name).join(" / ")}
              </p>
            </div>
            <button onClick={() => { if (isLoggedIn) toggleLike(currentSong.id); else setShowLogin(true) }}
              className="p-3 md:p-2 text-white/90 hover:text-[var(--color-primary)] transition-colors">
              <Heart size={18} className={liked ? "fill-[var(--color-primary)] text-[var(--color-primary)]" : ""} />
            </button>
            <button onClick={togglePlayQueue} className="p-3 md:p-2 touch-manipulation min-h-[44px] text-white/90 hover:text-white transition-colors">
              <ListMusic size={18} />
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs text-white/80">
            <span className="tabular-nums w-10 text-right">{formatTime(currentTime)}</span>
            <div ref={barRef} className="flex-1 h-1.5 bg-white/40 rounded-full cursor-pointer relative group"
              onMouseDown={handleBarMouseDown}>
              <div className="absolute inset-y-0 left-0 bg-white/25 rounded-full" style={{ width: `${buffer}%` }} />
              <div className="absolute inset-y-0 left-0 bg-white rounded-full transition-all" style={{ width: `${progress}%` }} />
              <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `calc(${progress}% - 8px)` }} />
            </div>
            <span className="tabular-nums w-10">{formatTime(duration)}</span>
          </div>

          <div className="flex items-center justify-between">
            <button onClick={cyclePlayMode} className="p-3 md:p-2 touch-manipulation min-h-[44px] text-white hover:text-[var(--color-primary)] transition-colors" title={modeLabels[playMode]}>
              <div className="relative">
                <ModeIcon size={18} />
                {playMode === "single" && <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold">1</span>}
              </div>
            </button>

            <div className="flex items-center gap-4">
              <button onClick={prev} className="p-3 md:p-2 hover:text-white text-white/90 transition-colors"><SkipBack size={22} /></button>
              <button onClick={toggle} className="p-5 bg-white rounded-full hover:scale-110 active:scale-95 text-black transition-all shadow-2xl shadow-black/40">
                {isPlaying ? <Pause size={26} /> : <Play size={26} className="ml-0.5" />}
              </button>
              <button onClick={next} className="p-3 md:p-2 hover:text-white text-white/90 transition-colors"><SkipForward size={22} /></button>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-1">
                <button onClick={() => setMuted(!isMuted)} className="p-3 md:p-2 touch-manipulation min-h-[44px] text-white hover:text-[var(--color-primary)] transition-colors">
                  {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <input type="range" min="0" max="1" step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => { setMuted(false); setVolume(parseFloat(e.target.value)) }}
                  className="w-20 h-1 accent-[var(--color-primary)] cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
                  style={{ accentColor: "var(--color-primary)" }} />
              </div>
              <div className="hidden md:block">
                <button onClick={cycleQuality}
                  className="px-2 py-1 text-[10px] border border-white/40 rounded text-white/80 hover:border-white hover:text-white transition-colors uppercase tracking-wider">
                  {QUALITY_LABELS[audioQuality]}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
