import { useState, useEffect, useCallback } from "react"
import { Heart, MessageCircle, ChevronDown, Send, ThumbsUp } from "lucide-react"
import { getCommentPlaylist, getCommentAlbum, comment, commentLike } from "../api/comment"
import { useAuthStore } from "../stores/useAuthStore"
import { useAppStore } from "../stores/useAppStore"
import { getImgUrl } from "../utils/format"

interface Props { type: "playlist" | "album"; id: number }

export function CommentSection({ type, id }: Props) {
  const [comments, setComments] = useState<any[]>([])
  const [hotComments, setHotComments] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [inputVal, setInputVal] = useState("")
  const [sending, setSending] = useState(false)
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set())
  const { isLoggedIn } = useAuthStore()
  const { setShowLogin } = useAppStore()
  const limit = 20

  const fetchComments = useCallback(async (p: number) => {
    setLoading(true)
    try {
      const fn = type === "playlist" ? getCommentPlaylist : getCommentAlbum
      const res = await fn(id, limit, (p - 1) * limit)
      const data = res || {}
      if (p === 1) setHotComments(data.hotComments || [])
      setComments((prev) => p === 1 ? (data.comments || []) : [...prev, ...(data.comments || [])])
      setTotal(data.total || 0)
    } catch {} finally { setLoading(false) }
  }, [type, id])

  useEffect(() => { setPage(1); fetchComments(1) }, [type, id, fetchComments])

  const handleSend = async () => {
    if (!isLoggedIn) return setShowLogin(true)
    if (!inputVal.trim()) return
    setSending(true)
    try {
      const t = type === "playlist" ? 1 : 3
      await comment(t, id, 1, inputVal.trim())
      setInputVal("")
      setPage(1)
      fetchComments(1)
    } catch {} finally { setSending(false) }
  }

  const handleLike = async (cid: number) => {
    if (!isLoggedIn) return setShowLogin(true)
    const t = type === "playlist" ? 1 : 3
    setLikedIds((prev) => { const n = new Set(prev); if (n.has(cid)) n.delete(cid); else n.add(cid); return n })
    try { await commentLike(t, id, cid, 1) } catch {}
  }

  const hasMore = comments.length < total

  return (
    <div className="mt-10 border-t border-[var(--color-border)] pt-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-dim)] flex items-center justify-center">
          <MessageCircle size={16} className="text-[var(--color-primary)]" />
        </div>
        <h3 className="text-base font-bold">评论</h3>
        <span className="text-sm text-[var(--color-text-muted)]">({total})</span>
      </div>

      {/* Input */}
      <div className="flex gap-3 mb-8">
        <div className="flex-1 relative">
          <input className="w-full bg-[var(--color-bg-elevated)] rounded-xl px-4 py-3 text-sm border border-[var(--color-border)] focus:border-[var(--color-primary)]/50 transition-all"
            placeholder={isLoggedIn ? "发表评论..." : "登录后发表评论"}
            value={inputVal} onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()} disabled={sending} />
        </div>
        <button onClick={handleSend} disabled={sending || !inputVal.trim()}
          className="px-5 py-2.5 bg-[var(--color-primary)] rounded-xl text-sm font-medium hover:bg-[var(--color-primary-hover)] disabled:opacity-40 transition-all flex items-center gap-2 shrink-0">
          <Send size={14} />
          {sending ? "发送中" : "发表"}
        </button>
      </div>

      {/* Hot comments */}
      {hotComments.length > 0 && (
        <div className="mb-8">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-4">精彩评论</h4>
          <div className="space-y-4">
            {hotComments.map((c) => (
              <CommentItem key={c.commentId} c={c} liked={likedIds.has(c.commentId) || c.liked} onLike={handleLike} isHot />
            ))}
          </div>
        </div>
      )}

      {/* All comments */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-4">最新评论 ({total})</h4>
        <div className="space-y-4">
          {comments.map((c) => (
            <CommentItem key={c.commentId} c={c} liked={likedIds.has(c.commentId) || c.liked} onLike={handleLike} />
          ))}
        </div>
        {loading && <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>}
        {!loading && hasMore && (
          <button onClick={() => { setPage((p) => p + 1); fetchComments(page + 1) }}
            className="w-full py-3 mt-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors rounded-lg hover:bg-[var(--color-bg-highlight)]">
            加载更多评论
          </button>
        )}
        {!loading && !hasMore && comments.length > 0 && (
          <p className="text-center py-4 text-xs text-[var(--color-text-muted)]">— 没有更多评论 —</p>
        )}
      </div>
    </div>
  )
}

function CommentItem({ c, liked, onLike, isHot }: { c: any; liked: boolean; onLike: (cid: number) => void; isHot?: boolean }) {
  return (
    <div className={`flex gap-3 p-3 rounded-xl transition-colors ${isHot ? "bg-[var(--color-primary-dim)]/30 border border-[var(--color-primary-dim)]" : "hover:bg-[var(--color-bg-highlight)]"}`}>
      <img src={getImgUrl(c.user?.avatarUrl, 80)} className="w-9 h-9 rounded-full shrink-0 ring-2 ring-[var(--color-bg-surface)]" alt="" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-[var(--color-primary)]">{c.user?.nickname}</span>
          {isHot && <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-primary-dim)] text-[var(--color-primary)] font-medium">热评</span>}
          <span className="ml-auto text-[10px] text-[var(--color-text-muted)]">{formatCommentTime(c.time)}</span>
        </div>
        <p className="text-sm text-[var(--color-text-primary)] leading-relaxed">{c.content}</p>
        {c.beReplied?.length > 0 && (
          <div className="mt-2 px-3 py-2 bg-[var(--color-bg-elevated)] rounded-lg text-xs text-[var(--color-text-secondary)] border-l-2 border-[var(--color-primary)]/30">
            <span className="text-[var(--color-primary)] font-medium">@{c.beReplied[0].user?.nickname}</span>: {c.beReplied[0].content}
          </div>
        )}
        <div className="flex items-center gap-4 mt-2">
          <button onClick={() => onLike(c.commentId)} className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
            <ThumbsUp size={12} className={liked ? "fill-[var(--color-primary)] text-[var(--color-primary)]" : ""} />
            {c.likedCount > 0 ? c.likedCount : ""}
          </button>
        </div>
      </div>
    </div>
  )
}

function formatCommentTime(ts: number): string {
  const d = new Date(ts)
  const now = new Date()
  const diff = now.getTime() - ts
  if (diff < 60000) return "刚刚"
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  if (diff < 2592000000) return `${Math.floor(diff / 86400000)}天前`
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`
}
