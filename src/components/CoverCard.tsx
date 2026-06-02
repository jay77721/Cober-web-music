import { memo } from "react"
import { useNavigate } from "react-router-dom"
import { Play } from "lucide-react"
import { getImgUrl, formatCount } from "../utils/format"
import { handleImgError } from "../utils/format"

interface Props { id: number; name: string; picUrl: string; playCount?: number; type?: string; style?: React.CSSProperties }

export const CoverCard = memo(function CoverCard({ id, name, picUrl, playCount, type = "playlist", style }: Props) {
  const navigate = useNavigate()
  return (
    <div className="group cursor-pointer transition-all duration-500 hover:scale-[1.03]" style={style}
      onClick={() => navigate(`/${type}/${id}`)}>
      <div className="relative mb-3 rounded-xl overflow-hidden bg-[var(--color-bg-elevated)] shadow-lg group-hover:shadow-[0_0_30px_-5px_var(--color-primary)] transition-all duration-500">
        <img src={getImgUrl(picUrl, 400)} className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-110" alt=""  onError={handleImgError} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {playCount !== undefined && playCount > 0 && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 bg-black/50 backdrop-blur-sm rounded text-[10px] text-white/90 opacity-70 group-hover:opacity-100 transition-opacity">
            <Play size={10} fill="white" />
            <span className="tabular-nums">{formatCount(playCount)}</span>
          </div>
        )}
        <button
          className="absolute bottom-2 right-2 w-11 h-11 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 hover:scale-110 hover:shadow-[0_0_20px_var(--color-primary)]">
          <Play size={18} className="ml-0.5" fill="white" />
        </button>
      </div>
      <p className="text-sm font-medium text-[var(--color-text-primary)] truncate px-0.5 group-hover:text-[var(--color-primary)] transition-colors duration-300">{name}</p>
    </div>
  )
})
