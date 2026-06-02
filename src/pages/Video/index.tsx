import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Play, Clapperboard, Flame, Sparkles } from "lucide-react"
import { getMvFirst, getMvExclusiveRcmd } from "../../api"
import { getImgUrl, formatCount } from "../../utils/format"

export function VideoListPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<"latest" | "exclusive">("latest")
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const fn = tab === "latest" ? getMvFirst(30) : getMvExclusiveRcmd(30, 0)
    fn.then((r: any) => {
      const items = r.data || []
      setVideos(items.map((v: any) => ({
        ...v,
        cover: v.cover || v.picUrl,
        title: v.name || v.title,
        artist: v.artistName || "",
      })))
    }).finally(() => setLoading(false))
  }, [tab])

  return (
    <div className="p-6 animate-page-enter pb-28">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center shadow-lg">
            <Clapperboard size={20} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold">视频</h1>
        </div>
        <div className="flex gap-2 bg-[var(--color-bg-surface)] p-1 rounded-xl">
          <button onClick={() => setTab("latest")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === "latest" ? "bg-[var(--color-primary)] text-white shadow-md" : "text-[var(--color-text-secondary)] hover:text-white"}`}>
            <Sparkles size={14} />最新
          </button>
          <button onClick={() => setTab("exclusive")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === "exclusive" ? "bg-[var(--color-primary)] text-white shadow-md" : "text-[var(--color-text-secondary)] hover:text-white"}`}>
            <Flame size={14} />独家
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[1,2,3,4,5,6,7,8].map((i) => <div key={i} className="aspect-video rounded-xl shimmer" />)}
        </div>
      ) : videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-[var(--color-text-muted)]">
          <Clapperboard size={40} className="mb-3 opacity-30" />
          <p className="text-sm">暂无视频内容</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {videos.map((v: any, i: number) => (
            <div key={v.id || i} className="group cursor-pointer animate-slide-up-fade-sm"
              style={{ animationDelay: i * 25 + "ms" }}
              onClick={() => navigate(`/mv/player/${v.id}`)}>
              <div className="relative rounded-xl overflow-hidden mb-2.5 aspect-video bg-[var(--color-bg-elevated)] shadow-lg group-hover:shadow-xl transition-all">
                <img src={getImgUrl(v.cover, 400)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                    <Play size={18} className="text-black ml-0.5" fill="black" />
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 right-2 flex justify-between">
                  <span className="px-1.5 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[10px] text-white">{formatCount(v.playCount || 0)}次播放</span>
                </div>
              </div>
              <p className="text-sm font-medium truncate px-0.5">{v.title || v.name}</p>
              <p className="text-xs text-[var(--color-text-secondary)] truncate px-0.5">{v.artist}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
