import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Play, TrendingUp, Sparkles } from "lucide-react"
import { getMvAll, getTopMvList } from "../../api"
import { getImgUrl, formatCount, formatDuration } from "../../utils/format"

export function MvListPage() {
  const navigate = useNavigate()
  const [mvs, setMvs] = useState<any[]>([])
  const [tab, setTab] = useState<"all" | "top">("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const fn = tab === "all" ? getMvAll("", "", "", 30) : getTopMvList(30)
    fn.then((r: any) => setMvs(r.data || [])).finally(() => setLoading(false))
  }, [tab])

  return (
    <div className="p-6 animate-page-enter pb-28">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
            <Sparkles size={20} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold">MV</h1>
        </div>
        <div className="flex gap-2 bg-[var(--color-bg-surface)] p-1 rounded-xl">
          <button onClick={() => setTab("all")}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${tab === "all" ? "bg-[var(--color-primary)] text-white shadow-md" : "text-[var(--color-text-secondary)] hover:text-white"}`}>全部MV</button>
          <button onClick={() => setTab("top")}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${tab === "top" ? "bg-[var(--color-primary)] text-white shadow-md" : "text-[var(--color-text-secondary)] hover:text-white"}`}>排行榜</button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[1,2,3,4,5,6,7,8].map((i) => (
            <div key={i} className="space-y-2">
              <div className="aspect-video rounded-xl shimmer" />
              <div className="h-4 w-3/4 rounded shimmer" />
              <div className="h-3 w-1/2 rounded shimmer" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {mvs.map((m: any, i: number) => (
            <div key={m.id} className="group cursor-pointer animate-slide-up-fade-sm"
              style={{ animationDelay: i * 25 + "ms" }}
              onClick={() => navigate(`/mv/player/${m.id}`)}>
              <div className="relative rounded-xl overflow-hidden mb-2.5 bg-[var(--color-bg-elevated)] shadow-lg group-hover:shadow-xl transition-all duration-300">
                <img src={getImgUrl(m.cover, 400)} className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-110" alt="" />
                {/* Play overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <Play size={20} className="text-black ml-0.5" fill="black" />
                  </div>
                </div>
                {/* Badges */}
                <div className="absolute bottom-2 left-2 right-2 flex justify-between">
                  <span className="px-1.5 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[10px] text-white text-xs">{formatCount(m.playCount)}次播放</span>
                </div>
                <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/50 backdrop-blur-sm rounded text-[10px] text-white/90">
                  {formatDuration(m.duration || m.dt)}
                </div>
              </div>
              <p className="text-sm font-medium truncate px-0.5">{m.name}</p>
              <p className="text-xs text-[var(--color-text-secondary)] truncate px-0.5">{m.artistName}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
