import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { TrendingUp, Crown, Globe, Play, Music } from "lucide-react"
import { getToplist } from "../../api"
import { getImgUrl, formatCount } from "../../utils/format"
import { CoverCard } from "../../components/CoverCard"

export function RankingPage() {
  const navigate = useNavigate()
  const [lists, setLists] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { getToplist().then((r: any) => setLists(r.list || [])).finally(() => setLoading(false)) }, [])



  const official = lists.filter((l: any) => l.ToplistType !== undefined)
  const global_ = lists.filter((l: any) => l.ToplistType === undefined)

  if (loading) return (
    <div className="p-6 pb-28 space-y-8 animate-page-enter">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
          <TrendingUp size={20} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold">排行榜</h1>
      </div>
      <div className="space-y-2">
        <div className="h-4 w-20 rounded shimmer mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[1,2,3,4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="aspect-square rounded-xl shimmer" />
              <div className="h-4 w-3/4 rounded shimmer" />
              <div className="h-3 w-1/2 rounded shimmer" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  if (lists.length === 0) return (
    <div className="p-6 pb-28">
      <div className="flex flex-col items-center justify-center h-64 text-[var(--color-text-muted)]">
        <TrendingUp size={48} className="opacity-30 mb-3" />
        <p className="text-sm">暂无排行榜数据</p>
      </div>
    </div>
  )

  return (
    <div className="h-full overflow-y-auto relative">
      <div className="ambient-orb w-72 h-72 -top-20 -left-20" style={{ background: "var(--color-primary)", opacity: 0.06 }} />
      <div className="ambient-orb w-80 h-80 bottom-20 -right-24" style={{ background: "#3b82f6", opacity: 0.04, animationDelay: "-3s" }} />

      <div className="px-6 pt-6 pb-28 relative z-10 space-y-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <TrendingUp size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">排行榜</h1>
            <p className="text-sm text-[var(--color-text-muted)]">发现最热门的音乐</p>
          </div>
        </div>

        {official.length > 0 && (
          <section className="animate-page-enter">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
                <Crown size={16} className="text-white" />
              </div>
              <h2 className="text-lg font-bold">官方榜</h2>
              <span className="text-xs text-[var(--color-text-muted)]">{official.length} 个榜单</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {official.map((l: any, i: number) => (
                <div key={l.id} data-grid-item>
                  <CoverCard id={l.id} name={l.name} picUrl={l.coverImgUrl} playCount={l.playCount} type="ranking" />
                </div>
              ))}
            </div>
          </section>
        )}

        {global_.length > 0 && (
          <section className="animate-page-enter">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center shadow-md">
                <Globe size={16} className="text-white" />
              </div>
              <h2 className="text-lg font-bold">全球榜</h2>
              <span className="text-xs text-[var(--color-text-muted)]">{global_.length} 个榜单</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
              {global_.map((l: any, i: number) => (
                <div key={l.id} data-grid-item>
                  <CoverCard id={l.id} name={l.name} picUrl={l.coverImgUrl} playCount={l.playCount} type="ranking" />
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="text-center pt-4">
          <p className="text-xs text-[var(--color-text-muted)] flex items-center justify-center gap-2">
            <Music size={12} className="opacity-50" />
            榜单数据来源于网易云音乐
          </p>
        </div>
      </div>
    </div>
  )
}


