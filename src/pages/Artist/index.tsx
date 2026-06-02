import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Play, UserPlus, UserCheck, ChevronRight } from "lucide-react"
import { getArtistDetail, getArtistSongs, getArtistAlbum, getArtistMv, getArtistDesc, getSimiArtist, artistSub } from "../../api"
import { usePlayerStore } from "../../stores/usePlayerStore"
import { getImgUrl, formatDuration } from "../../utils/format"
import { SongList } from "../../components/SongList"
import { CoverCard } from "../../components/CoverCard"

export function ArtistPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { play, playAll } = usePlayerStore()
  const [artist, setArtist] = useState<any>(null)
  const [songs, setSongs] = useState<any[]>([])
  const [albums, setAlbums] = useState<any[]>([])
  const [mvs, setMvs] = useState<any[]>([])
  const [desc, setDesc] = useState("")
  const [simiArtists, setSimiArtists] = useState<any[]>([])
  const [tab, setTab] = useState<"songs" | "albums" | "mvs">("songs")
  const [followed, setFollowed] = useState(false)
  const [showFullDesc, setShowFullDesc] = useState(false)

  useEffect(() => {
    if (!id) return
    const aid = Number(id)
    Promise.all([
      getArtistDetail(aid),
      getArtistSongs(aid, "hot", 50),
      getArtistAlbum(aid, 20),
      getArtistMv(aid, 10),
      getArtistDesc(aid),
      getSimiArtist(aid),
    ]).then(([detail, songsRes, albumRes, mvRes, descRes, simiRes]) => {
      const artistData = detail.data?.artist
      setArtist(artistData)
      setSongs(songsRes.songs || [])
      setAlbums(albumRes.hotAlbums || [])
      setMvs(mvRes.mvs || [])
      setDesc(descRes.briefDesc || "")
      setSimiArtists(simiRes.artists || [])
      if (artistData?.followed !== undefined) setFollowed(!!artistData.followed)
    })
  }, [id])

  const toggleFollow = async () => {
    if (!id) return
    const t = followed ? 2 : 1
    await artistSub(Number(id), t)
    setFollowed(!followed)
  }

  if (!artist) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="h-full overflow-y-auto">
      <div className="relative h-72 md:h-96 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-primary)]/30 via-[var(--color-primary-dim)] to-[var(--color-bg-base)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-base)] via-transparent to-transparent" />
        {artist.picUrl && (
          <img src={getImgUrl(artist.picUrl, 1000)} className="w-full h-full object-cover opacity-40" style={{ filter: "blur(20px)" }} alt="" />
        )}
        <div className="absolute bottom-8 left-6 right-6 flex items-end gap-6">
          <img data-hero src={getImgUrl(artist.picUrl || artist.cover, 400)}
            className="w-40 h-40 md:w-56 md:h-56 rounded-full object-cover shadow-2xl border-4 border-white/10" alt="" />
          <div className="flex-1 min-w-0 pb-2">
            <p data-hero className="text-xs font-bold uppercase tracking-widest text-white/60 mb-1">歌手</p>
            <h1 data-hero className="text-3xl md:text-5xl font-black text-white mb-3">{artist.name}</h1>
            <div data-hero className="flex items-center gap-3 flex-wrap">
              {artist.identities?.map((idObj: any, i: number) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70">{idObj.name}</span>
              ))}
              <div className="flex items-center gap-2">
                <button onClick={toggleFollow}
                  className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    followed
                      ? "border border-white/30 text-white bg-white/10 hover:bg-white/20"
                      : "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] hover:scale-105"
                  }`}>
                  {followed ? <UserCheck size={16} /> : <UserPlus size={16} />}
                  {followed ? "已关注" : "关注"}
                </button>
                <button onClick={() => { if (songs.length) playAll(songs, 0) }}
                  className="flex items-center gap-2 px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium hover:bg-white/30 transition-all">
                  <Play size={16} fill="white" /> 播放热门
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pt-4 pb-28 space-y-8">
        {desc && (
          <div>
            <p className={`text-sm text-[var(--color-text-secondary)] leading-relaxed ${!showFullDesc ? "line-clamp-3" : ""}`}>
              {desc}
            </p>
            {desc.length > 150 && (
              <button onClick={() => setShowFullDesc(!showFullDesc)}
                className="text-xs text-[var(--color-primary)] hover:underline mt-1">
                {showFullDesc ? "收起" : "展开更多"}
              </button>
            )}
          </div>
        )}

        <div className="flex gap-6 border-b border-[var(--color-border)]">
          <button onClick={() => setTab("songs")}
            className={`pb-2 text-sm font-medium transition-colors ${
              tab === "songs" ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]" : "text-[var(--color-text-secondary)] hover:text-white"
            }`}>热门歌曲 ({songs.length})</button>
          <button onClick={() => setTab("albums")}
            className={`pb-2 text-sm font-medium transition-colors ${
              tab === "albums" ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]" : "text-[var(--color-text-secondary)] hover:text-white"
            }`}>专辑 ({albums.length})</button>
          {mvs.length > 0 && (
            <button onClick={() => setTab("mvs")}
              className={`pb-2 text-sm font-medium transition-colors ${
                tab === "mvs" ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]" : "text-[var(--color-text-secondary)] hover:text-white"
              }`}>MV ({mvs.length})</button>
          )}
        </div>

        {tab === "songs" && <SongList songs={songs} onPlay={(s) => { play(s) }} showAlbum />}

        {tab === "albums" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {albums.map((a) => <CoverCard key={a.id} id={a.id} name={a.name} picUrl={a.picUrl} type="album" />)}
          </div>
        )}

        {tab === "mvs" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {mvs.map((mv: any) => (
              <div key={mv.id} className="group cursor-pointer" onClick={() => navigate(`/mv/player/${mv.id}`)}>
                <div className="relative aspect-video rounded-lg overflow-hidden bg-[var(--color-bg-elevated)] mb-2">
                  <img src={getImgUrl(mv.cover || mv.picUrl, 400)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="p-3 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play size={22} className="text-black ml-0.5" fill="black" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 rounded text-[10px] text-white">
                    {formatDuration(mv.duration || 0)}
                  </span>
                </div>
                <p className="text-sm truncate">{mv.name}</p>
                <p className="text-xs text-[var(--color-text-muted)] truncate">{mv.artistName || artist.name}</p>
              </div>
            ))}
          </div>
        )}

        {simiArtists.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">相似歌手</h2>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {simiArtists.slice(0, 12).map((sa: any) => (
                <button key={sa.id} onClick={() => navigate(`/artist/${sa.id}`)}
                  className="flex flex-col items-center gap-2 group">
                  <img src={getImgUrl(sa.picUrl || sa.img1v1Url, 200)}
                    className="w-20 h-20 rounded-full object-cover group-hover:scale-105 transition-transform shadow-lg" alt="" />
                  <p className="text-sm text-center truncate w-full">{sa.name}</p>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
