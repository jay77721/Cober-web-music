export function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "0:00"
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

export function formatCount(count: number): string {
  if (count >= 100000000) return (count / 100000000).toFixed(1) + "亿"
  if (count >= 10000) return (count / 10000).toFixed(1) + "万"
  return count.toString()
}

export function formatDate(ts: number): string {
  if (!ts) return ""
  const d = new Date(ts)
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`
}

export function formatDuration(ms: number): string {
  if (!ms) return "0:00"
  const totalSec = Math.floor(ms / 1000)
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

export function getSongArtists(ar: { id: number; name: string }[] | undefined): string {
  return ar?.map((a) => a.name).join(" / ") || "未知歌手"
}

export function getImgUrl(url: string | undefined, size = 200): string {
  if (url?.startsWith("http://")) url = "https://" + url.slice(7)
  if (!url) return ""
  return `${url}?param=${size}y${size}`
}