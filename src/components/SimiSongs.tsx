import { useState, useEffect } from "react"
import { Play } from "lucide-react"
import { getSimiSong, getSongDetail } from "../api"
import { usePlayerStore } from "../stores/usePlayerStore"
import { getImgUrl, getSongArtists } from "../utils/format"

export function SimiSongs() {
  const { currentSong, play } = usePlayerStore()
  const [songs, setSongs] = useState<any[]>([])

  useEffect(() => {
    if (!currentSong?.id) return
    getSimiSong(currentSong.id, 6).then((r: any) => {
      const list = r.songs || []
      // Fetch details for pic URLs
      if (list.length > 0) {
        const ids = list.map((s: any) => s.id).join(",")
        getSongDetail(ids).then((d: any) => {
          const details = d.songs || []
          setSongs(list.map((s: any) => {
            const detail = details.find((ds: any) => ds.id === s.id)
            return { ...s, al: detail?.al, album: detail?.album }
          }))
        }).catch(() => setSongs(list))
      }
    }).catch(() => {})
  }, [currentSong?.id])

  if (songs.length === 0) return null

  return (
    <div className="mt-8">
      <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">相似歌曲推荐</h3>
      <div className="space-y-1">
        {songs.map((s: any) => (
          <div key={s.id}
            className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 cursor-pointer group transition-colors"
            onClick={() => play(s)}>
            <img src={getImgUrl(s.al?.picUrl || s.album?.picUrl, 80)} className="w-10 h-10 rounded object-cover" alt="" />
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate text-white/80 group-hover:text-white">{s.name}</p>
              <p className="text-xs text-white/40 truncate">{getSongArtists(s.artists || s.ar)}</p>
            </div>
            <button className="p-1.5 text-white/40 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <Play size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
