import { useRef } from "react"
import { Play, Heart, Clock, Music } from "lucide-react"
import { getImgUrl, formatDuration, getSongArtists } from "../utils/format"
import { FEE_LABELS } from "../utils/constants"
import { useLikeStore } from "../stores/useLikeStore"
import { useAuthStore } from "../stores/useAuthStore"
import { useAppStore } from "../stores/useAppStore"

interface Props { songs: any[]; onPlay?: (song: any) => void; showAlbum?: boolean; showHeader?: boolean }

export function SongList({ songs, onPlay, showAlbum = true, showHeader = false }: Props) {
  const { toggleLike, isLiked } = useLikeStore()
  const { isLoggedIn } = useAuthStore()
  const { setShowLogin } = useAppStore()

  if (!songs?.length) return (
    <div className="flex flex-col items-center justify-center py-16 text-[var(--color-text-muted)]">
      <Music size={40} className="opacity-30 mb-3" />
      <p className="text-sm">暂无歌曲</p>
    </div>
  )

  return (
    <div>
      {showHeader && (
        <div className="grid grid-cols-[32px_1fr_auto_auto] md:grid-cols-[32px_1fr_2fr_auto_64px] gap-3 px-3 py-2.5 border-b border-[var(--color-border)] text-xs text-[var(--color-text-muted)] font-medium uppercase tracking-wider">
          <span className="text-center">#</span>
          <span>标题</span>
          {showAlbum && <span className="hidden md:block">专辑</span>}
          <span className="text-center"><Heart size={13} /></span>
          <span className="text-right flex items-center justify-end gap-1"><Clock size={13} /></span>
        </div>
      )}
      <div className="space-y-0.5">
        {songs.map((song, i) => {
          const s = song.song || song
          const feeLabel = FEE_LABELS[s.fee] || ""
          const alPic = s.al?.picUrl || s.album?.picUrl || ""
          const liked = isLiked(s.id)
          return (
            <div key={s.id || i}
              className="grid grid-cols-[32px_1fr_auto_auto] md:grid-cols-[32px_1fr_2fr_auto_64px] gap-3 px-3 py-2.5 rounded-xl group cursor-pointer transition-all duration-200 hover:bg-[var(--color-bg-highlight)]"
              onClick={() => onPlay?.(s)}>
              <span className="text-center text-sm tabular-nums text-[var(--color-text-muted)] group-hover:hidden self-center">{i + 1}</span>
              <span className="text-center hidden group-hover:flex items-center justify-center self-center">
                <Play size={13} fill="var(--color-primary)" className="text-[var(--color-primary)]" />
              </span>
              <div className="flex items-center gap-3 min-w-0">
                {alPic ? (
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 shadow-sm">
                    <img src={getImgUrl(alPic, 100)} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" alt="" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-bg-elevated)] flex items-center justify-center shrink-0">
                    <Music size={16} className="text-[var(--color-text-muted)]" />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm truncate text-[var(--color-text-primary)] font-medium group-hover:text-[var(--color-primary)] transition-colors">{s.name}</span>
                    {feeLabel && <span className="text-[10px] px-1.5 py-0.5 rounded text-[var(--color-primary)] bg-[var(--color-primary-dim)] shrink-0 leading-normal font-medium">{feeLabel}</span>}
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] truncate">{getSongArtists(s.ar || s.artists)}</p>
                </div>
              </div>
              {showAlbum && (
                <span className="hidden md:flex items-center text-sm text-[var(--color-text-secondary)] truncate">
                  {s.al?.name || s.album?.name || "-"}
                </span>
              )}
              <button
                className="flex items-center justify-center self-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                onClick={(e) => { e.stopPropagation(); if (isLoggedIn) toggleLike(s.id); else setShowLogin(true) }}>
                <Heart size={14} className={`transition-all duration-200 ${
                  liked ? "fill-[var(--color-primary)] text-[var(--color-primary)] scale-110 opacity-100" : "text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:scale-110"
                }`} />
              </button>
              <span className="self-center text-right text-sm text-[var(--color-text-muted)] tabular-nums">{formatDuration(s.dt || s.duration || 0)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
