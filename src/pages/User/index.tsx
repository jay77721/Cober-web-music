import { useEffect, useState } from "react"
import { getUserPlaylist, getUserRecord, getUserLevel, getUserFollows, getUserFolloweds, getUserDetail, followUser } from "../../api"
import { useAuthStore } from "../../stores/useAuthStore"
import { useAppStore } from "../../stores/useAppStore"
import { getImgUrl, formatCount } from "../../utils/format"
import { CoverCard } from "../../components/CoverCard"
import { Music, ListMusic, Users, Heart, LogOut, UserPlus, Disc3, Headphones, Clock } from "lucide-react"

export function UserPage() {
  const { isLoggedIn, user, logout } = useAuthStore()
  const { setShowLogin } = useAppStore()
  const [playlists, setPlaylists] = useState<any[]>([])
  const [record, setRecord] = useState<any[]>([])
  const [level, setLevel] = useState(0)
  const [follows, setFollows] = useState<any[]>([])
  const [followeds, setFolloweds] = useState<any[]>([])
  const [tab, setTab] = useState<"created" | "collected" | "follows" | "followeds">("created")
  useEffect(() => {
    if (!isLoggedIn || !user) return
    const uid = user.userId
    getUserPlaylist(uid).then((r: any) => setPlaylists(r.playlist || []))
    getUserRecord(uid, 1).then((r: any) => setRecord(r.weekData || []))
    getUserLevel().then((r: any) => setLevel(r.data?.level || 0)).catch(() => {})
    getUserFollows(uid, 10).then((r: any) => setFollows(r.follow || [])).catch(() => {})
    getUserFolloweds(uid, 10).then((r: any) => setFolloweds(r.followeds || [])).catch(() => {})
  }, [isLoggedIn])



  if (!isLoggedIn) return (
    <div className="h-full flex flex-col items-center justify-center gap-5 text-[var(--color-text-secondary)] p-6">
      <div className="w-20 h-20 rounded-full bg-[var(--color-bg-elevated)] flex items-center justify-center ring-4 ring-[var(--color-bg-surface)]">
        <Headphones size={36} className="opacity-40" />
      </div>
      <div className="text-center">
        <p className="text-base font-medium mb-1">登录后查看你的音乐</p>
        <p className="text-sm opacity-60">发现更多你喜欢的内容</p>
      </div>
      <button onClick={() => setShowLogin(true)}
        className="flex items-center gap-2 px-8 py-3 bg-[var(--color-primary)] text-white rounded-full hover:bg-[var(--color-primary-hover)] hover:scale-105 active:scale-95 transition-all shadow-lg">
        <UserPlus size={18} />
        立即登录
      </button>
    </div>
  )

  const uid = user?.userId ?? 0
  const created = playlists.filter((p: any) => p.creator?.userId === uid)
  const collected = playlists.filter((p: any) => p.creator?.userId !== uid)

  return (
    <div className="h-full overflow-y-auto relative">
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/40 via-[var(--color-primary-dim)] to-[var(--color-bg-base)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-base)] via-transparent to-transparent" />
        <div className="ambient-orb w-64 h-64 -top-10 -right-10" style={{ background: "var(--color-primary)", opacity: 0.1 }} />
      </div>

      <div className="px-6 -mt-24 relative z-10 pb-28">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-5 mb-8">
          <div className="relative group shrink-0">
            <img src={getImgUrl(user?.avatarUrl, 200)}
              className="w-24 h-24 rounded-full object-cover shadow-2xl ring-4 ring-[var(--color-bg-base)] transition-transform duration-300 group-hover:scale-105"
              alt="" />
            <div className="absolute -bottom-1 -right-1 px-2 py-0.5 bg-[var(--color-primary)] rounded-full text-xs font-bold text-white shadow-lg">
              Lv.{level}
            </div>
          </div>
          <div className="flex-1 min-w-0 text-center md:text-left">
            <h1 className="text-2xl font-black text-white mb-1">{user?.nickname}</h1>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {formatCount(playlists.length)} 个歌单 · {formatCount(follows.length)} 关注 · {formatCount(followeds.length)} 粉丝
            </p>
          </div>
          <button onClick={logout}
            className="flex items-center gap-2 px-5 py-2 border border-[var(--color-border)] rounded-full text-sm hover:border-red-400/50 hover:text-red-400 transition-all shrink-0">
            <LogOut size={14} />
            退出登录
          </button>
        </div>

        <div data-section className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { icon: ListMusic, label: "创建歌单", value: created.length, color: "from-blue-500 to-cyan-500" },
            { icon: Heart, label: "收藏歌单", value: collected.length, color: "from-pink-500 to-rose-500" },
            { icon: Users, label: "关注", value: follows.length, color: "from-green-500 to-emerald-500" },
            { icon: Music, label: "粉丝", value: followeds.length, color: "from-purple-500 to-violet-500" },
          ].map((stat, i) => {
            const Icon = stat.icon
            return (
              <div key={i}
                className="p-4 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/30 transition-all duration-200 group cursor-pointer">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                  <Icon size={16} className="text-white" />
                </div>
                <p className="text-2xl font-black tabular-nums">{stat.value}</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{stat.label}</p>
              </div>
            )
          })}
        </div>

        {record.length > 0 && (
          <section data-section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={16} className="text-[var(--color-text-secondary)]" />
              <h2 className="text-lg font-bold">最近播放</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {record.slice(0, 10).map((r: any, i: number) => (
                <div key={i}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--color-bg-surface)] hover:bg-[var(--color-bg-elevated)] transition-all duration-200 border border-[var(--color-border)] hover:border-[var(--color-primary)]/20 group cursor-pointer"
                  style={{ animationDelay: i * 30 + "ms" }}>
                  <img src={getImgUrl(r.song?.al?.picUrl || r.song?.album?.picUrl, 100)} className="w-12 h-12 rounded-xl object-cover shadow-sm group-hover:shadow-md transition-shadow" alt="" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate group-hover:text-[var(--color-primary)] transition-colors">{r.song?.name}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{formatCount(r.playCount)} 次播放</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div data-section className="flex gap-1 mb-6 border-b border-[var(--color-border)] overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {[
            { key: "created" as const, label: "创建的歌单", count: created.length },
            { key: "collected" as const, label: "收藏的歌单", count: collected.length },
            { key: "follows" as const, label: "关注", count: follows.length },
            { key: "followeds" as const, label: "粉丝", count: followeds.length },
          ].map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200 border-b-2 -mb-[1px] ${
                tab === t.key
                  ? "text-[var(--color-primary)] border-[var(--color-primary)]"
                  : "text-[var(--color-text-secondary)] border-transparent hover:text-white"
              }`}>
              {t.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                tab === t.key ? "bg-[var(--color-primary-dim)] text-[var(--color-primary)]" : "bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)]"
              }`}>{t.count}</span>
            </button>
          ))}
        </div>

        {(tab === "created" || tab === "collected") && (
          <>
            {(tab === "created" ? created : collected).length > 0 ? (
              <div data-section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                {(tab === "created" ? created : collected).map((p: any, i: number) => (
                  <div key={p.id} style={{ animationDelay: i * 25 + "ms" }}>
                    <CoverCard id={p.id} name={p.name} picUrl={p.coverImgUrl} playCount={p.playCount} type="playlist" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-[var(--color-text-muted)]">
                <Disc3 size={40} className="opacity-30 mb-3" />
                <p className="text-sm">{tab === "created" ? "还没有创建歌单" : "还没有收藏歌单"}</p>
              </div>
            )}
          </>
        )}

        {tab === "follows" && (
          follows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-[var(--color-text-muted)]">
              <Users size={40} className="opacity-30 mb-3" />
              <p className="text-sm">暂未关注任何人</p>
            </div>
          ) : (
            <div data-section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {follows.map((f: any) => (
                <div key={f.userId || f.id}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--color-bg-surface)] hover:bg-[var(--color-bg-elevated)] transition-all duration-200 border border-[var(--color-border)] hover:border-[var(--color-primary)]/20 group cursor-pointer">
                  <img src={getImgUrl(f.avatarUrl || f.picUrl, 100)} className="w-12 h-12 rounded-full object-cover ring-2 ring-[var(--color-bg-surface)] group-hover:ring-[var(--color-primary)]/30 transition-all" alt="" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate group-hover:text-[var(--color-primary)] transition-colors">{f.nickname || f.name}</p>
                    <p className="text-xs text-[var(--color-text-muted)] truncate">{f.signature || "这个人很懒，什么都没写"}</p>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {tab === "followeds" && (
          followeds.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-[var(--color-text-muted)]">
              <Users size={40} className="opacity-30 mb-3" />
              <p className="text-sm">暂无粉丝</p>
            </div>
          ) : (
            <div data-section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {followeds.map((f: any) => (
                <div key={f.userId || f.id}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--color-bg-surface)] hover:bg-[var(--color-bg-elevated)] transition-all duration-200 border border-[var(--color-border)] hover:border-[var(--color-primary)]/20 group cursor-pointer">
                  <img src={getImgUrl(f.avatarUrl || f.picUrl, 100)} className="w-12 h-12 rounded-full object-cover ring-2 ring-[var(--color-bg-surface)] group-hover:ring-[var(--color-primary)]/30 transition-all" alt="" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate group-hover:text-[var(--color-primary)] transition-colors">{f.nickname || f.name}</p>
                    <p className="text-xs text-[var(--color-text-muted)] truncate">{f.signature || "这个人很懒，什么都没写"}</p>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  )
}


