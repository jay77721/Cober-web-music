import { useEffect, useRef, useCallback } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

// ─── Page entrance: fade + slide up with stagger ───
export function usePageEnter(selector = "[data-animate]", delay = 0) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const items = selector === "[data-animate]" ? el.querySelectorAll(selector) : el.querySelectorAll(selector)
    if (!items.length) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { opacity: 0, y: 24, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.04, ease: "power3.out", delay }
      )
    }, el)
    return () => ctx.revert()
  }, [selector, delay])
  return ref
}

// ─── Stagger children entrance (custom) ───
export function useStaggerEntrance(
  ref: React.RefObject<HTMLElement | null>,
  childrenSelector: string,
  options?: { from?: gsap.TweenVars; to?: gsap.TweenVars; delay?: number; stagger?: number }
) {
  const { from = { opacity: 0, y: 16 }, to = { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }, delay = 0, stagger = 0.03 } = options || {}
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const items = el.querySelectorAll(childrenSelector)
    if (!items.length) return
    const ctx = gsap.context(() => {
      gsap.fromTo(items, from, { ...to, stagger, delay })
    }, el)
    return () => ctx.revert()
  }, [childrenSelector, delay, stagger])
}

// ─── Hover scale + glow ───
export function useHoverScale(ref: React.RefObject<HTMLElement | null>, scale = 1.04) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ctx = gsap.context(() => {
      el.addEventListener("mouseenter", () => {
        gsap.to(el, { scale, duration: 0.25, ease: "power2.out", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" })
      })
      el.addEventListener("mouseleave", () => {
        gsap.to(el, { scale: 1, duration: 0.35, ease: "power2.out", boxShadow: "none" })
      })
    }, el)
    return () => ctx.revert()
  }, [ref, scale])
}

// ─── Number counter tween ───
export function useCountUp(
  ref: React.RefObject<HTMLElement | null>,
  target: number,
  options?: { duration?: number; delay?: number; prefix?: string; suffix?: string }
) {
  const { duration = 0.8, delay = 0, prefix = "", suffix = "" } = options || {}
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ctx = gsap.context(() => {
      const obj = { val: 0 }
      gsap.to(obj, {
        val: target,
        duration,
        delay,
        ease: "power2.out",
        onUpdate: () => {
          el!.textContent = prefix + Math.round(obj.val).toLocaleString() + suffix
        },
      })
    }, el)
    return () => ctx.revert()
  }, [ref, target, duration, delay, prefix, suffix])
}

// ─── Scroll-driven parallax ───
export function useScrollParallax(
  ref: React.RefObject<HTMLElement | null>,
  options?: { speed?: number; scrub?: number }
) {
  const { speed = 0.3, scrub = 1 } = options || {}
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.to(el, {
        y: () => el!.offsetHeight * speed,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub,
          invalidateOnRefresh: true,
        },
      })
    }, el)
    return () => ctx.revert()
  }, [ref, speed, scrub])
}

// ─── Full player open/close ───
export function useFullPlayerAnimation(
  show: boolean,
  ref: React.RefObject<HTMLElement | null>,
  onComplete?: () => void
) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ctx = gsap.context(() => {
      if (show) {
        gsap.fromTo(
          el,
          { opacity: 0, scale: 0.92, y: 40 },
          { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "power3.out", onComplete }
        )
      } else {
        gsap.to(el, {
          opacity: 0,
          scale: 0.92,
          y: 40,
          duration: 0.3,
          ease: "power2.in",
          onComplete,
        })
      }
    }, el)
    return () => ctx.revert()
  }, [show, ref, onComplete])
}

// ─── Horizontal scroll snap with dots ───
export function useBannerAutoplay(
  containerRef: React.RefObject<HTMLElement | null>,
  slides: unknown[],
  current: number,
  setCurrent: (i: number) => void,
  interval = 5000
) {
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container || slides.length < 2) return

    const ctx = gsap.context(() => {
      const slides_ = container.querySelectorAll("[data-banner-slide]")
      if (!slides_.length) return

      // Set initial state
      gsap.set(slides_, { opacity: 0, scale: 1.05 })
      gsap.set(slides_[current], { opacity: 1, scale: 1 })

      // Auto-play timeline
      tlRef.current = gsap.timeline({ repeat: -1, paused: false })
      slides_.forEach((_, i) => {
        if (i === 0) return
        tlRef.current!.to(slides_, {
          opacity: 0,
          scale: 1.05,
          duration: 0.5,
          ease: "power2.inOut",
          onComplete: () => setCurrent(i),
        })
        .to(slides_, {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "power2.out",
        }, "-=0.3")
      })
    }, container)

    return () => {
      ctx.revert()
      tlRef.current?.kill()
    }
  }, [slides.length, containerRef])

  // Update on manual index change
  useEffect(() => {
    const container = containerRef.current
    if (!container || slides.length < 2) return
    const slides_ = container.querySelectorAll("[data-banner-slide]")
    if (!slides_.length) return
    gsap.to(slides_, {
      opacity: 0,
      scale: 1.05,
      duration: 0.3,
      ease: "power2.out",
    })
    gsap.to(slides_[current], {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: "power2.out",
      delay: 0.1,
    })
  }, [current, slides.length, containerRef])
}
