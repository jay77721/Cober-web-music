import { useRef, useCallback } from "react"

interface DragOptions {
  onDrag: (progress: number) => void
  onDragEnd?: () => void
}

export function useDragSeek({ onDrag, onDragEnd }: DragOptions) {
  const dragging = useRef(false)

  const getProgress = useCallback((e: MouseEvent | React.MouseEvent, el: HTMLElement) => {
    const rect = el.getBoundingClientRect()
    return Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    dragging.current = true
    const el = e.currentTarget
    const prog = getProgress(e, el)
    onDrag(prog)

    const onMove = (ev: MouseEvent) => {
      if (!dragging.current) return
      const p = getProgress(ev, el)
      onDrag(p)
    }
    const onUp = () => {
      dragging.current = false
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
      onDragEnd?.()
    }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
  }, [getProgress, onDrag, onDragEnd])

  const handleHover = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    return e.currentTarget.getBoundingClientRect()
  }, [])

  return { handleMouseDown, getProgress }
}
