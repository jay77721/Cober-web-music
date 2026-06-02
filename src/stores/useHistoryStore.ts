import { create } from "zustand"
import type { Song } from "../types/song"

const STORAGE_KEY = "cober-history"
const MAX_HISTORY = 100

function loadHistory(): { song: Song; time: number }[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") } catch { return [] }
}

interface HistoryState {
  history: { song: Song; time: number }[]
  add: (song: Song) => void
  clear: () => void
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  history: loadHistory(),

  add: (song: Song) => {
    const list = get().history.filter((h) => h.song.id !== song.id)
    list.unshift({ song, time: Date.now() })
    if (list.length > MAX_HISTORY) list.length = MAX_HISTORY
    set({ history: list })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  },

  clear: () => {
    set({ history: [] })
    localStorage.removeItem(STORAGE_KEY)
  },
}))
