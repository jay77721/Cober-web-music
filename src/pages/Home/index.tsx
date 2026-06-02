import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Play, ChevronRight, History, Sparkles, Disc3 } from "lucide-react"
import { getBanner, getPersonalized, getPersonalizedNewsong, getRecommendSongs, getAlbumNewest, getTopArtists } from "../../api"
import { usePlayerStore } from "../../stores/usePlayerStore"
import { useHistoryStore } from "../../stores/useHistoryStore"
import { useAuthStore } from "../../stores/useAuthStore"
import { getImgUrl, getSongArtists } from "../../utils/format"
import { CoverCard } from "../../components/CoverCard"
import { SongList } from "../../components/SongList"
import gsap from "gsap"

export function Home() {
  const navigate = useNavigate()
  const { play } = usePlayerStore()
  const { isLoggedIn } = useAuthStore()
  const { history: playHistory } = useHistoryStore()
  const [banners, setBanners] = useState<any[]>([])
  const [recPlaylists, setRecPlaylists] = useState<any[]>([])
  const [newSongs, setNewSongs] = useState<any[]>([])
  const [dailySongs, setDailySongs] = useState<any[]>([])
  const [newAlbums, setNewAlbums] = useState<any[]>([])
  const [topArtists, setTopArtists] = useState<any[]>([])
  const [bannerIdx, setBannerIdx] = useState(0)
  const bannerRef = useRef<HTMLDivElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  useEffect(() => {
    getBanner().then((r: any) => setBanners(r?.banners || []))
    getPersonalized(18).then((r: any) => setRecPlaylists(r?.result || []))
    getPersonalizedNewsong(12).then((r: any) => setNewSongs(r?.result || []))
    getAlbumNewest().then((r: any) => setNewAlbums(r?.albums || []))
    getTopArtists(12).then((r: any) => setTopArtists(r?.artists || []))
    if (isLoggedIn) getRecommendSongs().then((r: any) => setDailySongs(r?.data?.dailySongs || []))
  }, [isLoggedIn])

  // ─── GSAP Banner auto-play timeline ───
  useEffect(() => {
    if (banners.length < 2) return
    const container = bannerRef.current
    if (!container) return

    const ctx = gsap.context(() => {
      const slides = container.querySelectorAll("[data-banner-slide]")
      if (!slides.length) return
      gsap.set(slides, { opacity: 0, scale: 1.08 })
      gsap.set(slides[0], { opacity: 1, scale: 1 })

      tlRef.current = gsap.timeline({ repeat: -1, paused: false, delay: 4 })
      const loop = () => {
        const nextIdx = (bannerIdx + 1) % Math.min(banners.length, 5)
        tlRef.current = gsap.timeline({ repeat: -1, paused: false, delay: 4 })
        tlRef.current
          .to(container.querySelectorAll("[data-banner-slide]"), {
            opacity: 0, scale: 1.08, duration: 0.5, ease: "power2.inOut",
            onComplete: () => setBannerIdx(nextIdx),
          })
          .to(slides[nextIdx], { opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" }, "-=0.3")
          .call(loop, [], "+=4")
      }
      loop()
    }, container)

    return () => {
      ctx.revert()
      tlRef.current?.kill()
    }
  }, [banners.length])



  const handlePlaySong = (song: any) => {
    play({ id: song.id, name: song.name, artists: song.ar || song.artists, album: song.al, duration: song.dt, fee: song.fee })
  }

  const bannerList = banners.slice(0, 5)

  return (
    <div className="h-full overflow-y-auto relative">
      {/* Ambient decorative orbs */}
      <div className="ambient-orb w-72 h-72 -top-20 -left-20" style={{ background: "var(--color-primary)", opacity: 0.08 }} />
      <div className="ambient-orb w-96 h-96 bottom-40 -right-32" style={{ background: "#6366f1", opacity: 0.06, animationDelay: "-2s" }} />
      <div className="ambient-orb w-48 h-48 top-1/2 left-1/2" style={{ background: "#ec4899", opacity: 0.04, animationDelay: "-4s" }} />

      <div className="px-6 pt-4 pb-28 space-y-10 relative z-10">
        {/* Banner with GSAP */}
        {bannerList.length > 0 && (
          <div ref={bannerRef} className="relative overflow-hidden rounded-2xl group aspect-[3.5/1] shadow-xl">
            {bannerList.map((b: any, i: number) => (
              <div key={b.imageUrl || i} data-banner-slide
                className="absolute inset-0 cursor-pointer">
                <img src={getImgUrl(b.imageUrl, 1000)} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-base)] via-transparent to-transparent" />
              </div>
            ))}
            {bannerList.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {bannerList.map((_, i) => (
                  <button key={i} onClick={() => { setBannerIdx(i); tlRef.current?.kill() }}
                    className={`rounded-full transition-all duration-500 ${
                      i === bannerIdx ? "w-6 h-1.5 bg-white shadow-md" : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
                    }`} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Recently played */}
        {playHistory.length > 0 && (
          <section data-section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <History size={18} className="text-[var(--color-text-secondary)]" />
                <h2 className="text-xl font-bold tracking-tight">最近播放</h2>
              </div>
              <button onClick={() => navigate("/user")} className="text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] tracking-wider uppercase transition-colors">查看全部</button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
              {playHistory.slice(0, 8).map((item: any, i: number) => (
                <button key={item.song.id + "-" + i} onClick={() => play(item.song)}
                  className="flex flex-col items-start gap-2 min-w-[140px] group">
                  <div className="relative w-[140px] h-[140px] rounded-xl overflow-hidden bg-[var(--color-bg-elevated)] shadow-md">
                    <img src={getImgUrl(item.song.al?.picUrl || item.song.album?.picUrl, 300)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 p-2.5 bg-[var(--color-primary)] rounded-full shadow-lg group-hover:shadow-[0_0_20px_var(--color-primary)]">
                        <Play size={18} fill="white" />
                      </div>
                    </div>
                  </div>
                  <p className="text-sm font-medium truncate w-full text-left">{item.song.name}</p>
                  <p className="text-xs text-[var(--color-text-muted)] truncate w-full text-left">{getSongArtists(item.song.ar || item.song.artists)}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Recommended playlists */}
        <section data-section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold tracking-tight">推荐歌单</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-5">
            {recPlaylists.map((p: any, i: number) => (
              <CoverCard key={p.id} id={p.id} name={p.name} picUrl={p.picUrl} playCount={p.playCount} type="playlist" data-animate style={{ animationDelay: i * 35 + "ms" }} />
            ))}
          </div>
        </section>

        {/* New albums */}
        {newAlbums.length > 0 && (
          <section data-section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-[var(--color-text-secondary)]" />
                <h2 className="text-xl font-bold tracking-tight">新碟上架</h2>
              </div>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
              {newAlbums.slice(0, 10).map((a: any) => (
                <div key={a.id} className="min-w-[180px]">
                  <CoverCard id={a.id} name={a.name} picUrl={a.picUrl} type="album" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Top artists */}
        {topArtists.length > 0 && (
          <section data-section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold tracking-tight">热门歌手</h2>
              <button onClick={() => navigate("/search")} className="text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] tracking-wider uppercase transition-colors">显示全部</button>
            </div>
            <div className="flex gap-5 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
              {topArtists.slice(0, 12).map((a: any) => (
                <button key={a.id} onClick={() => navigate(`/artist/${a.id}`)}
                  className="flex flex-col items-center gap-2 min-w-[100px] group">
                  <div className="w-[100px] h-[100px] rounded-full overflow-hidden shadow-lg ring-2 ring-transparent group-hover:ring-[var(--color-primary)]/30 transition-all duration-300">
                    <img src={getImgUrl(a.picUrl || a.img1v1Url, 200)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                  </div>
                  <p className="text-sm text-center truncate w-full font-medium">{a.name}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* New songs */}
        <section data-section>
          <h2 className="text-xl font-bold tracking-tight mb-4">最新音乐</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
            {newSongs.map((s: any, i: number) => (
              <div key={s.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--color-bg-highlight)] cursor-pointer group transition-all duration-200"
                onClick={() => handlePlaySong(s.song || s)}>
                <img src={getImgUrl((s.song || s)?.album?.picUrl || (s.song || s)?.al?.picUrl, 100)} className="w-10 h-10 rounded object-cover" alt="" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--color-text-primary)] truncate font-medium">{(s.song || s)?.name}</p>
                  <p className="text-xs text-[var(--color-text-secondary)] truncate">{getSongArtists((s.song || s)?.artists || (s.song || s)?.ar)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Daily recommendations */}
        {isLoggedIn && dailySongs.length > 0 && (
          <section data-section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold tracking-tight">每日推荐</h2>
              <button onClick={() => dailySongs[0] && play(dailySongs[0])}
                className="text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] tracking-wider uppercase transition-colors">播放全部</button>
            </div>
            <SongList songs={dailySongs.slice(0, 10)} onPlay={handlePlaySong} />
          </section>
        )}
      </div>
    </div>
  )
}







