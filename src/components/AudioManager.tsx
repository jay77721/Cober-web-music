import { useEffect } from "react"
import { useAudio } from "../hooks/useAudio"

export function AudioManager() {
  useAudio()

  // Unlock browser audio autoplay on first user interaction.
  // Modern browsers block audio playback initiated outside a user gesture.
  // Since Howler plays asynchronously (after the song URL API call), the
  // browser may treat it as autoplay. This primes the audio system.
  useEffect(() => {
    let unlocked = false
    const unlock = () => {
      if (unlocked) return
      unlocked = true
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
        const silent = ctx.createOscillator()
        const gain = ctx.createGain()
        gain.gain.value = 0.001
        silent.connect(gain)
        gain.connect(ctx.destination)
        silent.start(0)
        silent.stop(0.01)
        ctx.resume()
      } catch {
        // fallback: create a silent audio element
        const a = new Audio()
        a.volume = 0.001
        a.play().catch(() => {})
      }
    }
    document.addEventListener("pointerdown", unlock, { once: true })
    document.addEventListener("keydown", unlock, { once: true })
    return () => {
      document.removeEventListener("pointerdown", unlock)
      document.removeEventListener("keydown", unlock)
    }
  }, [])

  return null
}
