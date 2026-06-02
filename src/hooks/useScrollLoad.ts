import { useEffect, useRef, useCallback } from "react"

export function useScrollLoad(callback: () => void, hasMore: boolean, loading: boolean) {
  const ref = useRef<HTMLDivElement>(null)
  const handleScroll = useCallback(() => {
    const el = ref.current
    if (!el || loading || !hasMore) return
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 200) callback()
  }, [callback, hasMore, loading])
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.addEventListener("scroll", handleScroll)
    return () => el.removeEventListener("scroll", handleScroll)
  }, [handleScroll])
  return ref
}