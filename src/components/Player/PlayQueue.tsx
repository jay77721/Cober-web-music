import { useState, useRef } from "react"
import { X, Trash2, Disc3, Play, GripVertical, Save, ListMusic } from "lucide-react"
import { usePlayerStore } from "../../stores/usePlayerStore"
import { formatDuration, getImgUrl } from "../../utils/format"

export function PlayQueue() {
  const { queue, queueIndex, showPlayQueue, togglePlayQueue, playFromQueue, removeFromQueue, clearQueue } = usePlayerStore()
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [dropIdx, setDropIdx] = useState<number | null>(null)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  if (!showPlayQueue) return null

  const handleDragStart = (i: number) => { setDragIdx(i) }
  const handleDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault()
    setDropIdx(i)
  }
  const handleDrop = () => {
    if (dragIdx === null || dropIdx === null || dragIdx === dropIdx) { setDragIdx(null); setDropIdx(null); return }
    const items = [...queue]
    const [moved] = items.splice(dragIdx, 1)
    items.splice(dropIdx, 0, moved)
    const store = usePlayerStore.getState()
    let newIdx = store.queueIndex
    if (dragIdx === store.queueIndex) newIdx = dropIdx
    else if (dragIdx < store.queueIndex && dropIdx >= store.queueIndex) newIdx = store.queueIndex - 1
    else if (dragIdx > store.queueIndex && dropIdx <= store.queueIndex) newIdx = store.queueIndex + 1
    usePlayerStore.setState({ queue: items, queueIndex: newIdx })
    setDragIdx(null); setDropIdx(null)
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end animate-fade-in" onClick={togglePlayQueue}>
      <div className="w-full sm:w-96 h-full bg-[var(--color-bg-surface)] border-l border-[var(--color-border)] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
          <div>
            <h3 className="font-medium">播放队列</h3>
            <p className="text-xs text-[var(--color-text-muted)]">{queue.length} 首歌曲</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowClearConfirm(true)}
              className="p-1.5 hover:bg-[var(--color-bg-elevated)] rounded text-[var(--color-text-muted)] hover:text-red-400 transition-colors" title="清空队列">
              <Trash2 size={15} />
            </button>
            <button onClick={togglePlayQueue} className="p-1.5 hover:bg-[var(--color-bg-elevated)] rounded transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

        {showClearConfirm && (
          <div className="px-4 py-3 bg-red-500/10 border-b border-red-500/20 flex items-center justify-between">
            <span className="text-sm text-red-400">确认清空队列？</span>
            <div className="flex gap-2">
              <button onClick={() => setShowClearConfirm(false)}
                className="px-3 py-1 text-xs border border-[var(--color-border)] rounded hover:bg-[var(--color-bg-elevated)]">取消</button>
              <button onClick={() => { clearQueue(); setShowClearConfirm(false) }}
                className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600">清空</button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {queue.length === 0 && (
            <div className="flex flex-col items-center justify-center h-48 text-[var(--color-text-muted)]">
              <ListMusic size={32} className="mb-2 opacity-30" />
              <p className="text-sm">队列为空</p>
              <p className="text-xs mt-1">播放歌曲后自动添加到队列</p>
            </div>
          )}
          {queue.map((song, i) => {
            const isCurrent = i === queueIndex
            const isDragOver = dropIdx === i && dragIdx !== i
            return (
              <div key={`${song.id}-${i}`}
                className={`flex items-center gap-2 px-3 py-2.5 cursor-pointer hover:bg-[var(--color-bg-elevated)] transition-all duration-200 group
                  ${isCurrent ? "bg-[var(--color-primary-dim)]" : ""}
                  ${isDragOver ? "border-t-2 border-[var(--color-primary)]" : ""}
                  ${dragIdx === i ? "opacity-40 scale-[0.97]" : ""}`}
                draggable
                onDragStart={() => handleDragStart(i)}
                onDragOver={(e) => handleDragOver(e, i)}
                onDragLeave={() => setDropIdx(null)}
                onDrop={handleDrop}
                onDragEnd={() => { setDragIdx(null); setDropIdx(null) }}
                onClick={() => playFromQueue(i)}>
                <div className="p-0.5 cursor-grab active:cursor-grabbing text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  onMouseDown={(e) => e.stopPropagation()}>
                  <GripVertical size={13} />
                </div>
                <div className="w-5 flex items-center justify-center shrink-0">
                  {isCurrent ? (
                    <div className="flex gap-0.5 items-end h-3">
                      <div className="w-0.5 bg-[var(--color-primary)] animate-pulse" style={{ height: "8px", animationDelay: "0ms" }} />
                      <div className="w-0.5 bg-[var(--color-primary)] animate-pulse" style={{ height: "12px", animationDelay: "150ms" }} />
                      <div className="w-0.5 bg-[var(--color-primary)] animate-pulse" style={{ height: "6px", animationDelay: "300ms" }} />
                    </div>
                  ) : (
                    <span className="text-xs text-[var(--color-text-muted)]">{i + 1}</span>
                  )}
                </div>
                {(song.al?.picUrl || song.album?.picUrl) ? (
                  <img src={getImgUrl(song.al?.picUrl || song.album?.picUrl, 80)} className="w-9 h-9 rounded object-cover shrink-0" alt="" />
                ) : (
                  <div className="w-9 h-9 rounded bg-[var(--color-bg-elevated)] flex items-center justify-center shrink-0">
                    <Disc3 size={14} className="text-[var(--color-text-muted)]" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm truncate ${isCurrent ? "text-[var(--color-primary)] font-medium" : ""}`}>{song.name}</p>
                  <p className="text-xs text-[var(--color-text-muted)] truncate">
                    {(song.ar?.map((a: any) => a.name).join(" / ") || "") || song.artists?.map((a: any) => a.name).join(" / ")}
                  </p>
                </div>
                <span className="text-xs text-[var(--color-text-muted)] tabular-nums shrink-0">{formatDuration(song.duration || song.dt || 0)}</span>
                <button onClick={(e) => { e.stopPropagation(); removeFromQueue(i) }}
                  className="p-0.5 hover:text-red-400 text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <X size={13} />
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
