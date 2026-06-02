import type { Song, LyricLine } from "./song"

export type PlayMode = "sequence" | "shuffle" | "single" | "loop"
export type AudioQuality = "standard" | "high" | "lossless"

export interface PlayerState {
  currentSong: Song | null
  queue: Song[]
  queueIndex: number
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  playMode: PlayMode
  lyrics: LyricLine[]
  currentLyricIndex: number
  showFullPlayer: boolean
  showPlayQueue: boolean
  crossfade: number
  audioQuality: AudioQuality
  bufferProgress: number
  isLoading: boolean
  error: string | null
  isMuted: boolean
}

export interface PlayerActions {
  play: (song?: Song) => void
  playAll: (songs: Song[], startIndex?: number) => void
  pause: () => void
  toggle: () => void
  next: () => void
  prev: () => void
  seek: (time: number) => void
  setVolume: (vol: number) => void
  setPlayMode: (mode: PlayMode) => void
  addToQueue: (song: Song) => void
  removeFromQueue: (index: number) => void
  clearQueue: () => void
  playFromQueue: (index: number) => void
  toggleFullPlayer: () => void
  togglePlayQueue: () => void
  setLyrics: (lyrics: LyricLine[]) => void
  setCurrentLyricIndex: (idx: number) => void
  setCurrentTime: (t: number) => void
  setDuration: (d: number) => void
  setCrossfade: (dur: number) => void
  setAudioQuality: (q: AudioQuality) => void
  setBufferProgress: (p: number) => void
  setLoading: (l: boolean) => void
  setError: (e: string | null) => void
  setMuted: (m: boolean) => void
}

export type PlayerStore = PlayerState & PlayerActions
