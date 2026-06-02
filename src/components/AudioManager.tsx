import { useEffect, useRef } from "react"
import { useAudio } from "../hooks/useAudio"

export function AudioManager() {
  useAudio()

  // Unlock browser audio autoplay on first user interaction.
  // Modern browsers block audio playback initiated outside a user gesture.
  // Since Howler plays asynchronously (after the song URL API call), the
  // browser may treat it as autoplay. This primes the audio system.
  const audioCtxRef = useRef<AudioContext | null>(null)

  // Robust audio unlock: create persistent AudioContext, resume on user gesture
  // Also play a silent HTML5 Audio to prime the browser autoplay policy
  useEffect(() => {
    let unlocked = false
    const unlock = () => {
      if (unlocked) return
      unlocked = true

      // Method 1: Web Audio API - creates a persistent unlocked AudioContext
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
        audioCtxRef.current = ctx
        const silent = ctx.createOscillator()
        const gain = ctx.createGain()
        gain.gain.value = 0.001
        silent.connect(gain)
        gain.connect(ctx.destination)
        silent.start(0)
        silent.stop(0.01)
        ctx.resume()
      } catch { /* ignore */ }

      // Method 2: HTML5 Audio - play a silent clip to prime autoplay
      try {
        const a = new Audio()
        a.volume = 0.001
        const playPromise = a.play()
        if (playPromise) playPromise.catch(() => {})
      } catch { /* ignore */ }

    }
    document.addEventListener("pointerdown", unlock, { once: true })
    document.addEventListener("keydown", unlock, { once: true })
    document.addEventListener("touchstart", unlock, { once: true })
    return () => {
      document.removeEventListener("pointerdown", unlock)
      document.removeEventListener("keydown", unlock)
      document.removeEventListener("touchstart", unlock)
    }
  }, [])

  return null
}
