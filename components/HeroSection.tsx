'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import type { Variants } from 'framer-motion'

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut', delay: 1.4 } },
}

const heroImages = [
  { url: '/images/hero/deluxe.jpg',          alt: 'Mina Hotels suite with city view' },
  { url: '/images/rooms/luxury-suite.jpg',    alt: 'Mina Hotels luxury lobby Port Harcourt' },
  { url: '/images/hero/pix.png',             alt: 'Mina Hotels exterior' },
  { url: '/images/hero/pix1.png',            alt: 'Mina Hotels outdoor area' },
  { url: '/images/hero/room.png',            alt: 'Mina Hotels deluxe room interior' },
  { url: '/images/hero/room1.png',           alt: 'Mina Hotels fine dining restaurant' },
  { url: '/images/hero/pix2.jpg',            alt: 'Mina Hotels suite' },
]

const SLIDE_DURATION = 6000
const FADE_DURATION  = 1.5

export default function HeroSection() {
  const titleRef  = useRef<HTMLHeadingElement>(null)
  const [current, setCurrent] = useState(0)
  const [paused,  setPaused]  = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    heroImages.forEach(({ url }) => {
      const img = new Image()
      img.src = url
    })
  }, [])

  useEffect(() => {
    const el = titleRef.current
    if (!el) return
    const text = el.textContent || ''
    el.innerHTML = text
      .split('')
      .map(c => c === ' ' ? '<span class="inline-block">&nbsp;</span>' : `<span class="inline-block">${c}</span>`)
      .join('')
    gsap.from(el.querySelectorAll('span'), {
      opacity: 0,
      y: 52,
      rotateX: -36,
      duration: 0.65,
      stagger: 0.035,
      ease: 'power3.out',
      delay: 0.5,
    })
  }, [])

  const advance = useCallback(() => setCurrent(c => (c + 1) % heroImages.length), [])

  useEffect(() => {
    if (paused) { if (intervalRef.current) clearInterval(intervalRef.current); return }
    intervalRef.current = setInterval(advance, SLIDE_DURATION)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [paused, advance])

  return (
    <section
      className="relative overflow-hidden"
      style={{ height: '100svh', minHeight: '580px' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Crossfade slideshow */}
      <AnimatePresence mode="sync">
        <motion.div
          key={current}
          className="absolute inset-0 bg-cover bg-center hero-bg"
          style={{ backgroundImage: `url('${heroImages[current].url}')`, backgroundPosition: 'center 40%' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE_DURATION, ease: 'easeInOut' }}
          aria-label={heroImages[current].alt}
          role="img"
        />
      </AnimatePresence>

      {/* Gradient — strong at bottom, lighter at top */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: 'linear-gradient(to top, rgba(10,22,40,0.90) 0%, rgba(10,22,40,0.45) 35%, rgba(10,22,40,0.20) 70%, rgba(10,22,40,0.35) 100%)',
        }}
      />

      {/* Content — left-aligned, anchored to bottom */}
      <div className="hero-content absolute inset-0 z-10 flex flex-col justify-end px-5 sm:px-10 md:px-16 lg:px-20 pb-24 md:pb-28">
        <div className="flex items-end gap-6 md:gap-8">
          {/* Vertical gold rule */}
          <div className="hidden md:block w-px flex-shrink-0 bg-gold/50" style={{ height: '88px' }} />

          <div>
            <p
              className="text-[10px] sm:text-[11px] tracking-[0.32em] uppercase mb-4 font-inter"
              style={{ color: '#C9A84C', fontFamily: "'Inter', sans-serif" }}
            >
              Old GRA &nbsp;·&nbsp; Port Harcourt, Nigeria
            </p>

            <h1
              ref={titleRef}
              className="font-playfair font-light leading-none text-white mb-3 tracking-[0.01em]"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(52px, 10vw, 100px)',
                perspective: '800px',
              }}
            >
              Mina Hotels
            </h1>

            <p
              className="hero-subtitle text-[11px] sm:text-[13px] tracking-[0.26em] uppercase text-white/60 mb-8 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Movers &amp; Shakers
            </p>

            <motion.div
              className="flex flex-col xs:flex-row gap-3"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
            >
              <Link
                href="/rooms"
                className="inline-block px-9 sm:px-10 py-3.5 bg-gold text-navy text-[11px] tracking-[0.22em] uppercase font-semibold hover:bg-gold-light hover:scale-[1.02] transition-all duration-300 no-underline font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Reserve a Room
              </Link>
              <Link
                href="/#about"
                className="inline-block px-9 sm:px-10 py-3.5 border border-white/40 text-white text-[11px] tracking-[0.22em] uppercase hover:bg-white/10 hover:border-white/70 transition-all duration-300 no-underline font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Discover More
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Slide counter + bar indicators — bottom right */}
      <div className="absolute bottom-8 right-5 sm:right-10 z-10 flex items-center gap-4">
        <span
          className="text-[10px] tracking-[0.16em] text-white/35 font-inter hidden sm:block"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {String(current + 1).padStart(2, '0')} / {String(heroImages.length).padStart(2, '0')}
        </span>
        <div className="flex gap-1.5 items-center">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
              className="h-[2px] transition-all duration-500 cursor-pointer"
              style={{
                width: i === current ? 28 : 10,
                background: i === current ? '#C9A84C' : 'rgba(255,255,255,0.28)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Scroll indicator — bottom centre */}
      <div className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <div className="scroll-line" />
      </div>
    </section>
  )
}
