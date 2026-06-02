import { useEffect, useState, useRef, useCallback } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { Search, X, Music, Mic2, Album, ListMusic, Film, TrendingUp, Clock, Play } from "lucide-react"
import { search, searchSuggest, searchHot, searchDefault, getSongDetail } from "../../api"
import { usePlayerStore } from "../../stores/usePlayerStore"
import { getImgUrl, getSongArtists, formatCount, formatDuration } from "../../utils/format"
import { CoverCard } from "../../components/CoverCard"

const TYPE_MAP: Record<number, string> = { 1: "songs", 10: "albums", 100: "artists", 1000: "playlists", 1004: "mvs" }

const TABS = [
  { key: 1, label: "单曲", icon: Music },
  { key: 100, label: "歌手", icon: Mic2 },
  { key: 10, label: "专辑", icon: Album },
  { key: 1000, label: "歌单", icon: ListMusic },
  { key: 1004, label: "MV", icon: Film },
]

export function SearchPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { play, playAll } = usePlayerStore()
  const query = params.get("q") || ""
  const [activeTab, setActiveTab] = useState(1)
  const [results, setResults] = useState<Record<string, any[]>>({})
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [hotList, setHotList] = useState<any[]>([])
  const [defaultKw, setDefaultKw] = useState("")
  const [inputVal, setInputVal] = useState(query)
  const [loading, setLoading] = useState(false)
  const [hotLoading, setHotLoading] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()
  const prevQueryRef = useRef(query)
  const prevTabRef = useRef(activeTab)
  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    searchHot().then((r: any) => setHotList(r?.result?.hots || [])).finally(() => setHotLoading(false))
    searchDefault().then((r: any) => setDefaultKw(r?.data?.showKeyword || ""))
  }, [])

  useEffect(() => {
    if (!query) return
    setInputVal(query)
    setResults({})
    setLoading(true)
    const key = TYPE_MAP[activeTab] || "songs"
    search(query, activeTab, 30, 0).then((r: any) => {
      setResults({ [key]: r?.result?.[key] || [] })
    }).finally(() => setLoading(false))
  }, [query, activeTab])



  const handleInput = useCallback((val: string) => {
    setInputVal(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (val) {
      debounceRef.current = setTimeout(() => {
        searchSuggest(val).then((r: any) => {
          setSuggestions(r?.result?.allMatch?.map((m: any) => m.keyword) || [])
        })
      }, 300)
    } else {
      setSuggestions([])
    }
  }, [])

  const handleSubmit = (kw?: string) => {
    const q = kw || inputVal
    if (!q) return
    navigate(`/search?q=${encodeURIComponent(q)}`)
    setSuggestions([])
  }

  const handlePlaySong = (s: any) => {
    play({ id: s.id, name: s.name, artists: s.artists || s.ar, album: s.album || s.al, duration: s.duration || s.dt, fee: s.fee })
    getSongDetail(s.id).then((r: any) => {
      const song = r?.songs?.[0]
      if (song?.al?.picUrl) {
        const cur = usePlayerStore.getState().currentSong
        if (cur && cur.id === s.id) {
          usePlayerStore.setState({ currentSong: { ...cur, al: song.al, ar: song.ar || cur.ar || cur.artists } })
        }
      }
    }).catch(() => {})
  }

  return (
    <div className="h-full overflow-y-auto relative">
      <div className="ambient-orb w-72 h-72 -top-20 -right-20" style={{ background: "var(--color-primary)", opacity: 0.06 }} />
      <div className="ambient-orb w-96 h-96 bottom-40 -left-32" style={{ background: "#6366f1", opacity: 0.04, animationDelay: "-3s" }} />

      <div className="px-6 pt-6 pb-28 relative z-10">
        <div className="relative max-w-2xl mb-8">
          <div className="flex items-center bg-[var(--color-bg-surface)] rounded-2xl px-5 py-3 gap-3 ring-1 ring-[var(--color-border)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/50 transition-all duration-300 shadow-lg shadow-black/5">
            <Search size={20} className="text-[var(--color-text-muted)] shrink-0" />
            <input ref={inputRef}
              className="flex-1 bg-transparent border-none p-0 text-sm outline-none placeholder:text-[var(--color-text-muted)]"
              placeholder={defaultKw || "搜索歌曲、歌手、专辑..."}
              value={inputVal}
              onChange={(e) => handleInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              autoFocus={!!query}
            />
            {inputVal && (
              <button onClick={() => { setInputVal(""); setSuggestions([]); inputRef.current?.focus() }}
                className="p-1 rounded-full hover:bg-[var(--color-bg-elevated)] transition-colors">
                <X size={16} className="text-[var(--color-text-muted)]" />
              </button>
            )}
          </div>
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--color-bg-surface)] rounded-2xl shadow-2xl border border-[var(--color-border)] z-20 overflow-hidden backdrop-blur-xl">
              <p className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">搜索建议</p>
              {suggestions.map((s, i) => (
                <button key={i}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-[var(--color-bg-elevated)] flex items-center gap-3 transition-colors group"
                  onClick={() => handleSubmit(s)}>
                  <Search size={14} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-colors" />
                  <span className="group-hover:text-[var(--color-primary)] transition-colors">{s}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {!query ? (
          <div className="animate-page-enter">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
                <TrendingUp size={18} className="text-white" />
              </div>
              <h2 className="text-xl font-bold">热搜榜</h2>
            </div>

            {hotLoading && (
              <div className="space-y-2">
                {[1,2,3,4,5,6,7,8,9,10].map((i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-3">
                    <div className="w-7 h-7 shimmer rounded-lg" />
                    <div className="h-4 w-32 shimmer rounded" />
                  </div>
                ))}
              </div>
            )}

            {!hotLoading && hotList.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-[var(--color-text-muted)]">
                <TrendingUp size={40} className="opacity-30 mb-3" />
                <p className="text-sm">暂无热搜数据</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              {hotList.map((h: any, i: number) => (
                <div key={i}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-[var(--color-bg-highlight)] cursor-pointer group transition-all duration-200"
                  style={{ animationDelay: i * 30 + "ms" }}
                  onClick={() => handleSubmit(h.first)}>
                  <span className={`w-8 h-8 flex items-center justify-center rounded-xl text-sm font-extrabold ${
                    i === 0 ? "bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-lg" :
                    i === 1 ? "bg-gradient-to-br from-orange-400 to-amber-500 text-white shadow-md" :
                    i === 2 ? "bg-gradient-to-br from-amber-400 to-yellow-500 text-white shadow-md" :
                    "bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)]"
                  }`}>{i + 1}</span>
                  <div className="flex-1 min-w-0 flex items-center gap-2">
                    <span className="text-sm font-medium truncate group-hover:text-[var(--color-primary)] transition-colors">{h.first}</span>
                    {h.iconUrl && <img src={h.iconUrl} className="w-4 h-4 shrink-0" alt="" />}
                    {h.score && (
                      <span className="text-[10px] text-[var(--color-text-muted)] shrink-0 tabular-nums">{formatCount(h.score)}</span>
                    )}
                  </div>
                  {i < 3 && (
                    <span className="text-[10px] text-[var(--color-primary)] font-bold shrink-0">
                      {i === 0 ? "?? 热" : i === 1 ? "热" : "新"}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-page-enter">
            <div className="flex gap-1 mb-6 border-b border-[var(--color-border)] overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              {TABS.map((t) => {
                const Icon = t.icon
                return (
                  <button key={t.key} onClick={() => setActiveTab(t.key)}
                    className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200 border-b-2 -mb-[1px] ${
                      activeTab === t.key
                        ? "text-[var(--color-primary)] border-[var(--color-primary)]"
                        : "text-[var(--color-text-secondary)] border-transparent hover:text-white"
                    }`}>
                    <Icon size={15} />
                    {t.label}
                  </button>
                )
              })}
            </div>

            {loading && (
              <div className="flex flex-col items-center justify-center py-16 text-[var(--color-text-muted)]">
                <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-sm">搜索中...</p>
              </div>
            )}

            {!loading && activeTab === 1 && (results.songs || []).length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-[var(--color-text-muted)]">
                <Music size={40} className="opacity-30 mb-3" />
                <p className="text-sm">未找到相关歌曲</p>
                <p className="text-xs mt-1 opacity-60">试试其他关键词</p>
              </div>
            )}

            <div ref={resultsRef}>
            {!loading && activeTab === 1 && (results.songs || []).length > 0 && (
              <div className="space-y-0.5">
                {(results.songs || []).map((s: any, i: number) => {
                  const alPic = s.album?.picUrl || s.al?.picUrl || ""
                  const artists = s.artists || s.ar || []
                  return (
                    <div key={s.id} data-result-item
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-[var(--color-bg-highlight)] cursor-pointer group transition-all duration-200"
                      onClick={() => handlePlaySong(s)}>
                      <span className="w-6 text-center text-xs text-[var(--color-text-muted)] tabular-nums group-hover:hidden shrink-0">{i + 1}</span>
                      <span className="hidden group-hover:flex items-center justify-center w-6 shrink-0">
                        <Play size={13} fill="var(--color-primary)" className="text-[var(--color-primary)]" />
                      </span>
                      <div className="relative shrink-0">
                        <img src={getImgUrl(alPic, 80)} className="w-11 h-11 rounded-xl object-cover shadow-sm group-hover:shadow-md transition-all duration-300" alt="" />
                        <div className="absolute inset-0 rounded-xl bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <Play size={14} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate group-hover:text-[var(--color-primary)] transition-colors">{s.name}</p>
                          {s.fee && s.fee > 0 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-primary-dim)] text-[var(--color-primary)] shrink-0 leading-normal font-medium">
                              {s.fee === 1 ? "VIP" : s.fee === 4 ? "付费" : "试听"}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[var(--color-text-secondary)] truncate">
                          {getSongArtists(artists)}
                          {s.album?.name && <span className="text-[var(--color-text-muted)]"> · {s.album.name}</span>}
                        </p>
                      </div>
                      <span className="text-xs text-[var(--color-text-muted)] tabular-nums shrink-0">{formatDuration(s.duration || s.dt || 0)}</span>
                    </div>
                  )
                })}
              </div>
            )}

            {!loading && activeTab === 100 && (results.artists || []).length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-[var(--color-text-muted)]">
                <Mic2 size={40} className="opacity-30 mb-3" />
                <p className="text-sm">未找到相关歌手</p>
              </div>
            )}

            {!loading && activeTab === 100 && (results.artists || []).map((a: any, i: number) => (
              <div key={a.id} data-result-item
                className="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-[var(--color-bg-highlight)] cursor-pointer transition-all duration-200"
                onClick={() => navigate(`/artist/${a.id}`)}>
                <div className="relative">
                  <img src={getImgUrl(a.picUrl || a.img1v1Url, 200)} className="w-14 h-14 rounded-full object-cover shadow-md ring-2 ring-[var(--color-bg-surface)] group-hover:ring-[var(--color-primary)]/30 transition-all" alt="" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-[var(--color-primary)] rounded-full flex items-center justify-center shadow-md">
                    <Mic2 size={10} className="text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium group-hover:text-[var(--color-primary)] transition-colors">{a.name}</p>
                  {a.alias?.[0] && <p className="text-xs text-[var(--color-text-muted)] truncate">{a.alias[0]}</p>}
                </div>
                {a.accountId && (
                  <span className="text-[10px] px-2 py-1 rounded-full bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)]">已入驻</span>
                )}
              </div>
            ))}

            {!loading && activeTab === 10 && (results.albums || []).length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-[var(--color-text-muted)]">
                <Album size={40} className="opacity-30 mb-3" />
                <p className="text-sm">未找到相关专辑</p>
              </div>
            )}

            {!loading && activeTab === 10 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {(results.albums || []).map((a: any, i: number) => (
                  <div key={a.id} data-result-item
                    className="group cursor-pointer"
                    onClick={() => navigate(`/album/${a.id}`)}>
                    <div className="relative mb-3 rounded-xl overflow-hidden bg-[var(--color-bg-elevated)] shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <img src={getImgUrl(a.picUrl, 400)} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      <button className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110">
                        <Play size={16} className="ml-0.5" fill="white" />
                      </button>
                    </div>
                    <p className="text-sm font-medium truncate px-0.5 group-hover:text-[var(--color-primary)] transition-colors">{a.name}</p>
                    <p className="text-xs text-[var(--color-text-secondary)] truncate px-0.5">{a.artist?.name}</p>
                  </div>
                ))}
              </div>
            )}

            {!loading && activeTab === 1000 && (results.playlists || []).length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-[var(--color-text-muted)]">
                <ListMusic size={40} className="opacity-30 mb-3" />
                <p className="text-sm">未找到相关歌单</p>
              </div>
            )}

            {!loading && activeTab === 1000 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                {(results.playlists || []).map((p: any, i: number) => (
                  <div key={p.id} data-result-item>
                    <CoverCard id={p.id} name={p.name} picUrl={p.coverImgUrl} playCount={p.playCount} type="playlist" />
                  </div>
                ))}
              </div>
            )}

            {!loading && activeTab === 1004 && (results.mvs || []).length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-[var(--color-text-muted)]">
                <Film size={40} className="opacity-30 mb-3" />
                <p className="text-sm">未找到相关MV</p>
              </div>
            )}

            {!loading && activeTab === 1004 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {(results.mvs || []).map((m: any, i: number) => (
                  <div key={m.id} data-result-item
                    className="group cursor-pointer"
                    onClick={() => navigate(`/mv/player/${m.id}`)}>
                    <div className="relative rounded-xl overflow-hidden mb-2.5 bg-[var(--color-bg-elevated)] shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <img src={getImgUrl(m.cover || m.picUrl, 400)} className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-11 h-11 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                          <Play size={18} className="text-black ml-0.5" fill="black" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                        <span className="px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[10px] text-white">{formatCount(m.playCount || 0)}次播放</span>
                        <span className="px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[10px] text-white">{formatDuration(m.duration || m.dt || 0)}</span>
                      </div>
                    </div>
                    <p className="text-sm font-medium truncate px-0.5 group-hover:text-[var(--color-primary)] transition-colors">{m.name || m.title}</p>
                    <p className="text-xs text-[var(--color-text-secondary)] truncate px-0.5">{m.artistName}</p>
                  </div>
                ))}
              </div>
            )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}




