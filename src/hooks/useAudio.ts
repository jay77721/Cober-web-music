import { useEffect, useRef, useCallback } from "react"
import { Howl } from "howler"
import { usePlayerStore } from "../stores/usePlayerStore"
import { useHistoryStore } from "../stores/useHistoryStore"
import { getSongUrl, getLyric } from "../api"

const QUALITY_BRS: Record<string, number> = {
  standard: 128000,
  high: 320000,
  lossless: 999000,
}

function monitorBuffer(howl: Howl, callback: (progress: number) => void) {
  const audioEl = (howl as any)._sounds?.[0]?._node as HTMLAudioElement | undefined
  if (!audioEl) return () => {}
  const onProgress = () => {
    if (audioEl.buffered.length > 0) {
      const end = audioEl.buffered.end(audioEl.buffered.length - 1)
      callback(audioEl.duration > 0 ? end / audioEl.duration : 0)
    }
  }
  audioEl.addEventListener("progress", onProgress)
  return () => audioEl.removeEventListener("progress", onProgress)
}

export let audioSeek: ((time: number) => void) | null = null

export function useAudio() {
  const howlRef = useRef<Howl | null>(null)
  const rafRef = useRef<number>(0)
  const unsubBufferRef = useRef<(() => void) | null>(null)
  const { currentSong, isPlaying, volume, crossfade, audioQuality, next, setDuration, setCurrentTime, setLyrics, setCurrentLyricIndex, setBufferProgress, setLoading, setError } = usePlayerStore()

  const setupHowl = useCallback((url: string, song: typeof currentSong) => {
    const store = usePlayerStore.getState()
    const howl = new Howl({ src: [url], html5: true, volume: store.volume, format: ["mp3", "flac"] })
    howlRef.current = howl

    howl.once("load", () => {
      setDuration(howl.duration())
      setLoading(false)
      unsubBufferRef.current?.()
      unsubBufferRef.current = monitorBuffer(howl, setBufferProgress)
    })
    howl.on("end", () => { next() })
    howl.on("loaderror", () => { setError("歌曲加载失败"); setLoading(false) })

    if (crossfade > 0 && store.isPlaying) {
      howl.volume(0); howl.play(); howl.fade(0, volume, crossfade * 1000)
    } else {
      howl.play()
    }

    // Preload next
    preloadNext(store)
  }, [next, setDuration, setLyrics, setBufferProgress, setLoading, setError, volume, crossfade, audioQuality])

  const preloadNext = useCallback((store: any) => {
    const { queue, queueIndex, playMode } = store
    if (queue.length === 0) return
    let nextIdx: number
    if (playMode === "shuffle") nextIdx = Math.floor(Math.random() * queue.length)
    else if (playMode === "single") return
    else nextIdx = (queueIndex + 1) % queue.length
    if (nextIdx === queueIndex) return
    const nextSong = queue[nextIdx]
    if (!nextSong) return
    getSongUrl(nextSong.id, QUALITY_BRS[audioQuality] || 999000).then((res) => {
      const url = res.data?.[0]?.url
      if (!url) return
      const audio = new Audio()
      audio.preload = "auto"
      audio.src = url
    }).catch(() => {})
  }, [audioQuality])

  const loadSong = useCallback(async (song: typeof currentSong) => {
    if (!song) return
    setLoading(true); setError(null); setBufferProgress(0)
    if (howlRef.current) {
      const old = howlRef.current
      const store = usePlayerStore.getState()
      if (crossfade > 0 && store.isPlaying) {
        old.fade(store.volume, 0, crossfade * 1000)
        setTimeout(() => { try { old.unload() } catch {} }, crossfade * 1000 + 100)
      } else { old.unload() }
    }
    howlRef.current = null
    unsubBufferRef.current?.(); unsubBufferRef.current = null
    useHistoryStore.getState().add(song)
    try {
      const br = QUALITY_BRS[audioQuality] || 999000
      const res = await getSongUrl(song.id, br)
      const url = res.data?.[0]?.url
      if (!url) {
        if (audioQuality !== "standard") {
          const fb = await getSongUrl(song.id, 128000)
          const fbUrl = fb.data?.[0]?.url
          if (!fbUrl) { setError("歌曲暂时无法播放"); setLoading(false); return }
          setupHowl(fbUrl, song)
        } else { setError("歌曲暂时无法播放"); setLoading(false); return }
      } else { setupHowl(url, song) }
    } catch { setError("加载失败"); setLoading(false) }
    try {
      const lr = await getLyric(song.id)
      setLyrics(parseLyric(lr.lrc?.lyric || ""))
    } catch { setLyrics([]) }
  }, [next, setDuration, setLyrics, setBufferProgress, setLoading, setError, volume, crossfade, audioQuality, setupHowl])

  useEffect(() => {
    if (currentSong) loadSong(currentSong)
    return () => { if (howlRef.current) { howlRef.current.unload(); howlRef.current = null } unsubBufferRef.current?.() }
  }, [currentSong?.id])

  useEffect(() => { if (howlRef.current) { if (isPlaying) howlRef.current.play(); else howlRef.current.pause() } }, [isPlaying])
  useEffect(() => { if (howlRef.current) howlRef.current.volume(volume) }, [volume])

  useEffect(() => {
    const tick = () => {
      if (howlRef.current && isPlaying) {
        const t = howlRef.current.seek() as number
        setCurrentTime(t)
        const { lyrics } = usePlayerStore.getState()
        const idx = findLyricIndex(lyrics, t)
        if (idx >= 0) setCurrentLyricIndex(idx)
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [isPlaying])

  const seek = useCallback((time: number) => { if (howlRef.current) { howlRef.current.seek(time); setCurrentTime(time) } }, [setCurrentTime])
  useEffect(() => { audioSeek = seek; return () => { audioSeek = null } }, [seek])
  return { seek }
}

function parseLyric(raw: string) {
  const lines: { time: number; text: string }[] = []
  raw.split("\n").forEach((line) => {
    const m = line.match(/^\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/)
    if (m) {
      const time = parseInt(m[1]) * 60 + parseInt(m[2]) + parseInt(m[3]) / (m[3].length === 3 ? 1000 : 100)
      lines.push({ time, text: m[4] || "" })
    }
  })
  return lines.sort((a, b) => a.time - b.time)
}

function findLyricIndex(lyrics: { time: number; text: string }[], t: number) {
  if (!lyrics.length) return -1
  let lo = 0, hi = lyrics.length - 1, ans = 0
  while (lo <= hi) { const mid = (lo + hi) >> 1; if (lyrics[mid].time <= t) { ans = mid; lo = mid + 1 } else hi = mid - 1 }
  return ans
}
