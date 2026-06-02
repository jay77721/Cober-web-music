import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Play } from "lucide-react"
import { getTopList } from "../../api"
import { usePlayerStore } from "../../stores/usePlayerStore"
import { getImgUrl, formatCount } from "../../utils/format"
import { SongList } from "../../components/SongList"

export function RankingDetailPage() {
  const { id } = useParams()
  const { play, playAll } = usePlayerStore()
const [detail, setDetail] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    getTopList(Number(id)).then((r: any) => { setDetail(r.playlist) }).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>
  if (!detail) return <p className="text-center py-12">榜单不存在</p>

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <img src={getImgUrl(detail.coverImgUrl, 400)} className="w-52 h-52 rounded-xl object-cover shrink-0 mx-auto md:mx-0" alt="" />
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">{detail.name}</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mb-2">更新频率: {detail.updateFrequency}</p>
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">{detail.description}</p>
          <button onClick={() => { if (detail.tracks?.length) playAll(detail.tracks, 0) }}
            className="flex items-center gap-2 px-6 py-2 bg-[var(--color-primary)] rounded-full hover:bg-[var(--color-primary-hover)]"><Play size={18} /> 播放全部</button>
          <p className="text-xs text-[var(--color-text-muted)] mt-3">{detail.trackCount} 首 · 播放 {formatCount(detail.playCount)} 次</p>
        </div>
      </div>
      <SongList songs={detail.tracks || []} onPlay={(s: any) => { play(s) }} />
    </div>
  )
}
