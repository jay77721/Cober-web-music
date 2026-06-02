import { useEffect, useState, useRef } from "react"
import { useParams } from "react-router-dom"
import { getMvDetail, getMvUrl, getRelatedAllvideo } from "../../api"
import { getImgUrl } from "../../utils/format"

export function MvPlayerPage() {
  const { id } = useParams()
  const [mv, setMv] = useState<any>(null)
  const [url, setUrl] = useState("")
  const [related, setRelated] = useState<any[]>([])
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!id) return
    getMvDetail(Number(id)).then((r: any) => setMv(r.data))
    getMvUrl(Number(id)).then((r: any) => setUrl(r.data?.url || ""))
    getRelatedAllvideo(Number(id)).then((r: any) => setRelated(r.data || []))
  }, [id])

  return (
    <div className="p-6 animate-page-enter">
      <div className="max-w-4xl mx-auto">
        {url ? (
          <video ref={videoRef} src={url} controls autoPlay className="w-full rounded-xl bg-black" />
        ) : (
          <div className="w-full aspect-video bg-[var(--color-bg-surface)] rounded-xl flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {mv && (
          <div className="mt-4">
            <h1 className="text-xl font-bold">{mv.name}</h1>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">{mv.artistName} · {mv.playCount}次播放</p>
            <p className="text-sm text-[var(--color-text-secondary)] mt-2">{mv.desc}</p>
          </div>
        )}
        {related.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-bold mb-4">相关视频</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {related.map((v: any, i: number) => (
                <div key={v.vid} className="cursor-pointer group animate-slide-up-fade-sm" style={{ animationDelay: i * 30 + "ms" }}>
                  <img src={getImgUrl(v.coverUrl, 400)} className="w-full aspect-video rounded-lg object-cover group-hover:scale-105 transition-transform duration-300" alt="" />
                  <p className="text-sm mt-1 truncate">{v.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}