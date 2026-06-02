import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Play, Heart, ChevronDown, Clock, Disc3 } from "lucide-react"
import { getAlbum, albumSub } from "../../api"
import { usePlayerStore } from "../../stores/usePlayerStore"
import { useAuthStore } from "../../stores/useAuthStore"
import { useAppStore } from "../../stores/useAppStore"
import { getImgUrl, formatDate, formatDuration } from "../../utils/format"
import { SongList } from "../../components/SongList"
import { CommentSection } from "../../components/CommentSection"

const GRADIENT_HEIGHT = 360

export function AlbumPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { play, playAll } = usePlayerStore()
  const { isLoggedIn } = useAuthStore()
  const { setShowLogin } = useAppStore()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [subscribed, setSubscribed] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    if (!id) return
    setLoading(true)
    getAlbum(Number(id)).then((r) => {
      setData(r)
      setSubscribed(r.album?.subscribed || false)
    }).finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    const el = document.getElementById("album-scroll")
    if (!el) return
    const onScroll = () => setScrollY(el.scrollTop)
    el.addEventListener("scroll", onScroll, { passive: true })
    return () => el.removeEventListener("scroll", onScroll)
  }, [])



  const handleToggleSub = async () => {
    if (!isLoggedIn) return setShowLogin(true)
    const t = subscribed ? 2 : 1
    await albumSub(Number(id), t)
    setSubscribed(!subscribed)
  }

  if (loading) return (
    <div className="h-full overflow-y-auto p-6">
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-52 h-52 rounded-xl shrink-0 mx-auto md:mx-0 shimmer" />
        <div className="flex-1 space-y-4">
          <div className="h-8 w-3/5 rounded shimmer" />
          <div className="h-4 w-2/5 rounded shimmer" />
          <div className="h-4 w-1/4 rounded shimmer" />
          <div className="flex gap-3 mt-6">
            <div className="w-14 h-14 rounded-full shimmer" />
            <div className="w-32 h-10 rounded-full shimmer" />
          </div>
        </div>
      </div>
      <div className="space-y-3 mt-8">
        {[1,2,3,4,5,6,7,8].map((n) => (
          <div key={n} className="flex items-center gap-4 px-3 py-2">
            <div className="w-8 h-4 shimmer rounded" />
            <div className="w-10 h-10 shimmer rounded shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-4 w-3/5 shimmer rounded" />
              <div className="h-3 w-2/5 shimmer rounded" />
            </div>
            <div className="h-4 w-12 shimmer rounded" />
          </div>
        ))}
      </div>
    </div>
  )

  if (!data?.album) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3 text-[var(--color-text-muted)]">
      <Disc3 size={48} className="opacity-30" />
      <p className="text-sm">专辑不存在</p>
    </div>
  )

  const album = data.album
  const songs = data.songs || []
  const fadeOpacity = Math.max(0, 1 - scrollY / (GRADIENT_HEIGHT * 0.6))
  const bgColor = `rgba(232,89,60,${0.4 * fadeOpacity})`

  return (
    <div id="album-scroll" className="h-full overflow-y-auto relative animate-page-enter">
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: GRADIENT_HEIGHT,
          background: `linear-gradient(180deg, ${bgColor} 0%, rgba(232,89,60,${0.15 * fadeOpacity}) 40%, transparent 100%)`,
          opacity: fadeOpacity,
        }}
      />

      <div
        className="sticky top-0 z-10 transition-all duration-200"
        style={{
          background: scrollY > 10 ? `rgba(18,18,18,${Math.min(0.95, scrollY / 200)})` : "transparent",
          backdropFilter: scrollY > 10 ? "blur(12px)" : "none",
        }}
      >
        <div className="flex items-center gap-4 px-6 py-3">
          <button onClick={() => navigate(-1)} className="p-1 hover:text-white text-[var(--color-text-secondary)] transition-colors">
            <ChevronDown className="rotate-90" size={22} />
          </button>
          {scrollY > 120 && (
            <div className="flex items-center gap-3 min-w-0 animate-fade-in">
              <img src={getImgUrl(album.picUrl, 60)} className="w-10 h-10 rounded object-cover shrink-0" alt="" />
              <span className="text-sm font-bold truncate">{album.name}</span>
            </div>
          )}
        </div>
      </div>

      <div className="px-6 pt-8 pb-6 flex flex-col md:flex-row items-center md:items-end gap-6 relative" style={{ marginTop: -56 }}>
        <div data-hero className="shrink-0 relative group" style={{ width: 232, height: 232 }}>
          <img
            src={getImgUrl(album.picUrl, 400)}
            className="w-full h-full object-cover rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
            alt=""
            style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.6)" }}
          />
        </div>
        <div className="flex-1 min-w-0 text-center md:text-left">
          <p data-hero className="text-xs font-bold uppercase tracking-widest mb-2 text-[var(--color-text-secondary)]">Album</p>
          <h1 data-hero className="font-black text-white leading-tight mb-3 text-4xl md:text-5xl" style={{ lineHeight: 1.1 }}>
            {album.name}
          </h1>
          <div data-hero className="flex items-center justify-center md:justify-start gap-2 text-sm text-[var(--color-text-secondary)] mb-2 flex-wrap">
            {album.artist && (
              <>
                <span className="font-semibold text-white hover:underline cursor-pointer">{album.artist.name}</span>
                <span>·</span>
              </>
            )}
            <span>{formatDate(album.publishTime)}</span>
            {album.company && (
              <>
                <span>·</span>
                <span>{album.company}</span>
              </>
            )}
          </div>
          {album.description && (
            <p data-hero className="text-sm text-[var(--color-text-secondary)] line-clamp-2 max-w-2xl mx-auto md:mx-0 mb-2">
              {album.description}
            </p>
          )}
          {album.size > 0 && (
            <p data-hero className="text-xs text-[var(--color-text-muted)] mb-4">
              {album.size} 首 · 总时长 {getTotalDuration(songs)}
            </p>
          )}
          <div data-hero className="flex items-center justify-center md:justify-start gap-4 mt-4">
            <div className="relative inline-flex">
              <div className="absolute inset-0 rounded-full animate-pulse-ring bg-[var(--color-primary)]" />
              <button onClick={() => { if (songs.length) playAll(songs, 0) }}
                className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] hover:scale-105 transition-all shadow-xl z-10">
                <Play size={26} fill="white" />
              </button>
            </div>
            <button onClick={handleToggleSub}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-sm transition-all ${
                subscribed
                  ? "bg-[var(--color-primary)] text-white"
                  : "border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-white"
              }`}>
              <Heart size={18} className={subscribed ? "fill-white" : ""} />
              {subscribed ? "已收藏" : "收藏"}
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 pb-32">
        <SongList songs={songs} onPlay={(s) => { play(s) }} showHeader showAlbum={false} />
        {id && <CommentSection type="album" id={Number(id)} />}
      </div>
    </div>
  )
}

function getTotalDuration(songs: any[]): string {
  const totalMs = songs.reduce((sum, s) => sum + (s.dt || s.duration || 0), 0)
  const totalSec = Math.floor(totalMs / 1000)
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${m}分${s}秒`
}



