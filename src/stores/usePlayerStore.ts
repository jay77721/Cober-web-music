import { create } from "zustand"
import type { Song, LyricLine } from "../types/song"
import type { PlayMode, AudioQuality, PlayerStore } from "../types/player"
import { audioSeek } from "../hooks/useAudio"

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentSong: null,
  queue: [],
  queueIndex: -1,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: parseFloat(localStorage.getItem("volume") || "0.8"),
  playMode: (localStorage.getItem("playMode") as PlayMode) || "sequence",
  lyrics: [],
  currentLyricIndex: -1,
  showFullPlayer: false,
  showPlayQueue: false,
  crossfade: parseFloat(localStorage.getItem("crossfade") || "0"),
  audioQuality: (localStorage.getItem("audioQuality") as AudioQuality) || "standard",
  bufferProgress: 0,
  isLoading: false,
  error: null,
  isMuted: false,

  play: (song) => {
    if (song) {
      const { queue } = get()
      const idx = queue.findIndex((s) => s.id === song.id)
      if (idx >= 0) {
        set({ currentSong: song, queueIndex: idx, isPlaying: true, currentTime: 0, error: null })
      } else {
        set({ currentSong: song, queue: [...queue, song], queueIndex: queue.length, isPlaying: true, currentTime: 0, error: null })
      }
    } else {
      set({ isPlaying: true })
    }
  },

  playAll: (songs, startIndex = 0) => {
    if (!songs || songs.length === 0) return
    set({ queue: songs, queueIndex: startIndex, currentSong: songs[startIndex], isPlaying: true, currentTime: 0, error: null })
  },

  pause: () => set({ isPlaying: false }),
  toggle: () => { const { isPlaying } = get(); set({ isPlaying: !isPlaying }) },

  next: () => {
    const { queue, queueIndex, playMode } = get()
    if (queue.length === 0) return
    let nextIdx: number
    if (playMode === "single") nextIdx = queueIndex
    else if (playMode === "shuffle") nextIdx = Math.floor(Math.random() * queue.length)
    else if (playMode === "loop") nextIdx = (queueIndex + 1) % queue.length
    else { nextIdx = queueIndex + 1; if (nextIdx >= queue.length) nextIdx = 0 }
    set({ currentSong: queue[nextIdx], queueIndex: nextIdx, isPlaying: true, currentTime: 0, error: null })
  },

  prev: () => {
    const { queue, queueIndex } = get()
    if (queue.length === 0) return
    const prevIdx = queueIndex > 0 ? queueIndex - 1 : queue.length - 1
    set({ currentSong: queue[prevIdx], queueIndex: prevIdx, isPlaying: true, currentTime: 0 })
  },

  seek: (time) => {
    if (audioSeek) audioSeek(time)
    else set({ currentTime: time })
  },

  setVolume: (vol) => { localStorage.setItem("volume", String(vol)); set({ volume: vol }) },
  setPlayMode: (mode) => { localStorage.setItem("playMode", mode); set({ playMode: mode }) },

  addToQueue: (song) => {
    const { queue } = get()
    if (!queue.find((s) => s.id === song.id)) set({ queue: [...queue, song] })
  },

  removeFromQueue: (index) => {
    const { queue, queueIndex } = get()
    const newQueue = queue.filter((_, i) => i !== index)
    let newIdx = queueIndex
    if (index < queueIndex) newIdx--
    if (index === queueIndex && newIdx >= newQueue.length) newIdx = newQueue.length - 1
    set({ queue: newQueue, queueIndex: newIdx })
  },

  clearQueue: () => set({ queue: [], queueIndex: -1, currentSong: null, isPlaying: false }),

  playFromQueue: (index) => {
    const { queue } = get()
    if (index >= 0 && index < queue.length) set({ currentSong: queue[index], queueIndex: index, isPlaying: true, currentTime: 0 })
  },

  toggleFullPlayer: () => set((s) => ({ showFullPlayer: !s.showFullPlayer })),
  togglePlayQueue: () => set((s) => ({ showPlayQueue: !s.showPlayQueue })),
  setLyrics: (lyrics) => set({ lyrics }),
  setCurrentLyricIndex: (idx) => set({ currentLyricIndex: idx }),
  setCurrentTime: (t) => set({ currentTime: t }),
  setDuration: (d) => set({ duration: d }),

  setCrossfade: (dur) => { localStorage.setItem("crossfade", String(dur)); set({ crossfade: dur }) },
  setAudioQuality: (q) => { localStorage.setItem("audioQuality", q); set({ audioQuality: q }) },
  setBufferProgress: (p) => set({ bufferProgress: p }),
  setLoading: (l) => set({ isLoading: l }),
  setError: (e) => set({ error: e }),
  setMuted: (m) => set({ isMuted: m }),
}))
