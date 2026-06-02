import { useEffect } from "react"
import { usePlayerStore } from "../stores/usePlayerStore"

export function useKeyboardShortcuts() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (tag === "INPUT" || tag === "TEXTAREA") return

      const store = usePlayerStore.getState()
      switch (e.code) {
        case "Space":
          e.preventDefault()
          store.toggle()
          break
        case "ArrowLeft":
          e.preventDefault()
          store.seek(Math.max(0, store.currentTime - 5))
          break
        case "ArrowRight":
          e.preventDefault()
          store.seek(Math.min(store.duration, store.currentTime + 5))
          break
        case "ArrowUp":
          e.preventDefault()
          store.setVolume(Math.min(1, store.volume + 0.05))
          break
        case "ArrowDown":
          e.preventDefault()
          store.setVolume(Math.max(0, store.volume - 0.05))
          break
        case "KeyN":
          e.preventDefault()
          store.next()
          break
        case "KeyP":
          e.preventDefault()
          store.prev()
          break
        case "KeyM":
          e.preventDefault()
          store.setVolume(store.volume > 0 ? 0 : 0.8)
          break
        case "KeyL":
          e.preventDefault()
          store.toggleFullPlayer()
          break
        case "KeyQ":
          e.preventDefault()
          store.togglePlayQueue()
          break
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])
}
