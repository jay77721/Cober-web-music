import { useState, useEffect } from "react"
import { X, Plus } from "lucide-react"
import { createPlaylist, getUserPlaylist, addTracks, getPlaylistCatlist, getTopPlaylist } from "../api"
import { useAuthStore } from "../stores/useAuthStore"
import { useAppStore } from "../stores/useAppStore"
import { getImgUrl } from "../utils/format"
import { CoverCard } from "./CoverCard"

interface Props {
  songId?: number
  onClose: () => void
}

export function PlaylistAddDialog({ songId, onClose }: Props) {
  const { isLoggedIn, user } = useAuthStore()
  const { setShowLogin } = useAppStore()
  const [playlists, setPlaylists] = useState<any[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState("")
  const [newPrivacy, setNewPrivacy] = useState(0)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!isLoggedIn || !user) { setShowLogin(true); return }
    getUserPlaylist(user.userId).then((r: any) => {
      const mine = (r.playlist || []).filter((p: any) => p.creator?.userId === user?.userId)
      setPlaylists(mine)
    })
  }, [isLoggedIn])

  const handleCreate = async () => {
    if (!newName.trim()) return
    setLoading(true)
    try {
      const res = await createPlaylist(newName.trim(), newPrivacy)
      if (res.code === 200) {
        setPlaylists((prev) => [res.playlist, ...prev])
        setShowCreate(false)
        setNewName("")
        setMessage("创建成功！")
        setTimeout(() => setMessage(""), 2000)
      }
    } catch {} finally { setLoading(false) }
  }

  const handleAddToPlaylist = async (pid: number) => {
    if (!songId) return
    setLoading(true)
    try {
      await addTracks(pid, String(songId))
      setMessage("已添加到歌单")
      setTimeout(() => setMessage(""), 2000)
    } catch {} finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="w-80 bg-[var(--color-bg-surface)] rounded-2xl border border-white/5 shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
          <h3 className="font-medium">添加到歌单</h3>
          <button onClick={onClose} className="p-1 hover:bg-[var(--color-bg-elevated)] rounded-full"><X size={16} /></button>
        </div>
        <div className="max-h-72 overflow-y-auto p-2">
          {playlists.length === 0 && <p className="text-center text-[var(--color-text-muted)] text-sm py-6">还没有创建的歌单</p>}
          {playlists.map((p) => (
            <button key={p.id} onClick={() => handleAddToPlaylist(p.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--color-bg-elevated)] transition-colors text-left">
              <img src={getImgUrl(p.coverImgUrl, 80)} className="w-10 h-10 rounded object-cover" alt="" />
              <div className="min-w-0 flex-1">
                <p className="text-sm truncate">{p.name}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{p.trackCount} 首</p>
              </div>
            </button>
          ))}
        </div>
        {message && <p className="text-center text-sm text-[var(--color-primary)] py-2">{message}</p>}
        {showCreate ? (
          <div className="p-4 border-t border-[var(--color-border)] space-y-2">
            <input className="w-full bg-[var(--color-bg-elevated)] rounded-lg px-3 py-2 text-sm" placeholder="歌单名称"
              value={newName} onChange={(e) => setNewName(e.target.value)} autoFocus />
            <label className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)] cursor-pointer">
              <input type="checkbox" checked={newPrivacy === 1} onChange={(e) => setNewPrivacy(e.target.checked ? 1 : 0)} className="accent-[var(--color-primary)]" />
              私密歌单
            </label>
            <div className="flex gap-2">
              <button onClick={() => setShowCreate(false)} className="flex-1 py-2 text-sm border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-bg-elevated)]">取消</button>
              <button onClick={handleCreate} disabled={loading || !newName.trim()}
                className="flex-1 py-2 text-sm bg-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-hover)] disabled:opacity-50">创建</button>
            </div>
          </div>
        ) : (
          <div className="p-4 border-t border-[var(--color-border)]">
            <button onClick={() => setShowCreate(true)}
              className="w-full flex items-center justify-center gap-2 py-2 text-sm border border-dashed border-[var(--color-border)] rounded-lg hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors">
              <Plus size={16} /> 创建新歌单
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
