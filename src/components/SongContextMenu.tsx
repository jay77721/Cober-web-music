import { useState, useRef, useEffect, useCallback } from "react"
import { Heart, ListPlus, User, Disc3, Share2, Copy, Play, Library, ExternalLink } from "lucide-react"
import { useLikeStore } from "../stores/useLikeStore"
import { usePlayerStore } from "../stores/usePlayerStore"
import { useAuthStore } from "../stores/useAuthStore"
import { PlaylistAddDialog } from "./PlaylistManager"
import type { Song } from "../types/song"

interface MenuState { show: boolean; x: number; y: number; song: Song | null }

export function SongContextMenu() {
  const [menu, setMenu] = useState<MenuState>({ show: false, x: 0, y: 0, song: null })
  const [showPlaylistPicker, setShowPlaylistPicker] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { toggleLike, isLiked } = useLikeStore()
  const { play, addToQueue } = usePlayerStore()
  const { isLoggedIn } = useAuthStore()

  const handleClose = useCallback(() => setMenu((s) => ({ ...s, show: false })), [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const row = target.closest("[data-song-id]") as HTMLElement
      if (!row) return
      e.preventDefault()
      const s: Song = {
        id: Number(row.dataset.songId),
        name: row.dataset.songName || "",
        ar: [{ id: 0, name: row.dataset.songArtist || "" }],
        al: { id: 0, name: row.dataset.songAlbum || "", picUrl: row.dataset.songPic || "" },
        dt: Number(row.dataset.songDuration) || 0,
      }
      setMenu({ show: true, x: e.clientX, y: e.clientY, song: s })
    }
    window.addEventListener("contextmenu", handler)
    return () => window.removeEventListener("contextmenu", handler)
  }, [])

  useEffect(() => {
    if (!menu.show) return
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) handleClose()
    }
    window.addEventListener("mousedown", close)
    return () => window.removeEventListener("mousedown", close)
  }, [menu.show, handleClose])

  if (!menu.show || !menu.song) return null

  const s = menu.song
  const liked = isLiked(s.id)

  const items = [
    { icon: Play, label: "立即播放", action: () => play(s) },
    { icon: ListPlus, label: "添加到队列", action: () => addToQueue(s) },
    { icon: Heart, label: liked ? "取消喜欢" : "喜欢", action: () => { if (isLoggedIn) toggleLike(s.id) }, disabled: !isLoggedIn, liked },
    { icon: Library, label: "添加到歌单", action: () => { handleClose(); setShowPlaylistPicker(true) } },
    { icon: Disc3, label: "查看专辑", action: () => { window.location.hash = `#/album/${s.al?.id || 0}` }, hidden: !s.al?.id },
    { icon: User, label: "查看歌手", action: () => { window.location.hash = `#/artist/${s.ar?.[0]?.id || 0}` }, hidden: !s.ar?.[0]?.id },
    { icon: Copy, label: "复制歌名", action: () => navigator.clipboard?.writeText(s.name) },
  ]
  const maxY = window.innerHeight - 340
  const maxX = window.innerWidth - 200

  return (
    <>
      <div className="fixed inset-0 z-[60]" onClick={handleClose} onContextMenu={(e) => e.preventDefault()}>
        <div ref={menuRef}
          className="fixed bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-2xl shadow-2xl py-1.5 w-[210px] animate-fade-in overflow-hidden backdrop-blur-xl"
          style={{ left: Math.min(menu.x, maxX), top: Math.min(menu.y, maxY) }}>
          {/* Song preview */}
          <div className="px-3 py-2.5 border-b border-[var(--color-border)] flex items-center gap-2.5">
            {(s.al?.picUrl) ? (
              <img src={s.al.picUrl + "?param=60y60"} className="w-8 h-8 rounded object-cover" alt="" />
            ) : (
              <div className="w-8 h-8 rounded bg-[var(--color-bg-elevated)] flex items-center justify-center">
                <Disc3 size={14} className="text-[var(--color-text-muted)]" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium truncate text-[var(--color-text-primary)]">{s.name}</p>
              <p className="text-[10px] truncate text-[var(--color-text-muted)]">{s.ar?.map((a) => a.name).join(" / ")}</p>
            </div>
          </div>
          {/* Menu items */}
          {items.filter((i) => !i.hidden).map((item, idx) => (
            <button key={idx} disabled={item.disabled}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                item.disabled
                  ? "text-[var(--color-text-muted)] cursor-not-allowed"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-highlight)] hover:text-[var(--color-text-primary)]"
              }`}
              onClick={() => { item.action(); if (!item.label.includes("歌单")) handleClose() }}>
              <item.icon size={15}
                className={item.liked ? "fill-[var(--color-primary)] text-[var(--color-primary)]" : ""} />
              {item.label}
            </button>
          ))}
        </div>
      </div>
      {showPlaylistPicker && <PlaylistAddDialog songId={s.id} onClose={() => setShowPlaylistPicker(false)} />}
    </>
  )
}
