import { useState, useRef, useEffect } from "react"

interface Props { src: string; alt?: string; className?: string }

export function LazyImage({ src, alt = "", className = "" }: Props) {
  const [loaded, setLoaded] = useState(false)
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} className={className}>
      {inView && <img src={src} alt={alt} className={`${className} transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`} onLoad={() => setLoaded(true)} />}
      {!loaded && <div className={`${className} bg-[var(--color-bg-elevated)] animate-pulse`} />}
    </div>
  )
}