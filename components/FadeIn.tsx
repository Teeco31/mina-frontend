'use client'

import { useEffect, useRef, ReactNode } from 'react'

interface FadeInProps {
  children: ReactNode
  delay?: string
  className?: string
}

/**
 * FadeIn — viewport-driven entrance animation.
 *
 * The component still accepts the same props (children / delay / className)
 * so every existing call site keeps working. A few visual-only behaviors
 * are layered on top via the className prop:
 *
 *   • className="stagger"  → stagger any direct children at 90ms intervals
 *                            (CSS in globals.css handles the timing)
 *
 *   • className="parallax" → drive a subtle translateY based on scroll
 *                            position via IntersectionObserver + rAF.
 *                            Honours prefers-reduced-motion.
 */
export default function FadeIn({ children, delay = '0s', className = '' }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion) {
      el.classList.add('visible')
      return
    }

    // Entry observer — adds .visible the first time the element scrolls
    // into view, then disconnects so we don't re-fire.
    const entryObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('visible')
            entryObserver.unobserve(el)
          }
        })
      },
      { threshold: 0.12 }
    )
    entryObserver.observe(el)

    // Optional parallax — only when className opts in.
    const wantsParallax = className.includes('parallax')
    let inView = false
    let rafId = 0

    const update = () => {
      rafId = 0
      if (!inView) return
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight || 1
      // Range: -1 (just entered from bottom) → 1 (just left top)
      const progress = (rect.top + rect.height / 2 - vh / 2) / vh
      const offset = Math.max(-40, Math.min(40, progress * -28))
      const target = el.querySelector<HTMLElement>('.img-parallax') || el
      target.style.transform = `translate3d(0, ${offset}px, 0)`
    }

    const onScroll = () => {
      if (!wantsParallax) return
      if (rafId === 0) rafId = requestAnimationFrame(update)
    }

    let parallaxObserver: IntersectionObserver | null = null
    if (wantsParallax) {
      parallaxObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            inView = entry.isIntersecting
            if (inView && rafId === 0) rafId = requestAnimationFrame(update)
          })
        },
        { threshold: 0 }
      )
      parallaxObserver.observe(el)
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', onScroll, { passive: true })
    }

    return () => {
      entryObserver.disconnect()
      if (parallaxObserver) parallaxObserver.disconnect()
      if (wantsParallax) {
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', onScroll)
      }
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [className])

  return (
    <div
      ref={ref}
      className={`fade-in ${className}`}
      style={{ transitionDelay: delay }}
    >
      {children}
    </div>
  )
}