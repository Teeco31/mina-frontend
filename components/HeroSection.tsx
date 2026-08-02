'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import type { Variants } from 'framer-motion'

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
}

const heroImages = [
  {
    url: '/images/hero/deluxe.jpg',
    alt: 'Mina Hotels suite with city view',
  },
  {
    url: '/images/rooms/luxury-suite.jpg',
    alt: 'Mina Hotels luxury lobby Port Harcourt',
  },
  {
    url: '/images/hero/pix.png',
    alt: 'Mina Hotels luxury lobby Port Harcourt',
  },

  {
    url: '/images/hero/pix1.png',
    alt: 'Mina Hotels swimming pool and outdoor area',
  },
  {
    url: '/images/hero/room.png',
    alt: 'Mina Hotels deluxe room interior',
  },
  {
    url: '/images/hero/room1.png',
    alt: 'Mina Hotels fine dining restaurant',
  },
  {
    url: '/images/hero/pix2.jpg',
    alt: 'Mina Hotels suite with city view',
  },
]

const SLIDE_DURATION = 6000
const FADE_DURATION = 1.5

export default function HeroSection() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Preload all images on mount
  useEffect(() => {
    heroImages.forEach(({ url }) => {
      const img = new Image()
      img.src = url
    })
  }, [])

  // GSAP character-split title animation
  useEffect(() => {
    const el = titleRef.current
    if (!el) return
    const text = el.textContent || ''
    const chars = text.split('')
    el.innerHTML = chars
      .map((c) =>
        c === ' '
          ? '<span class="inline-block">&nbsp;</span>'
          : `<span class="inline-block">${c}</span>`
      )
      .join('')
    const spans = el.querySelectorAll('span')
    gsap.from(spans, {
      opacity: 0,
      y: 60,
      rotateX: -40,
      duration: 0.7,
      stagger: 0.04,
      ease: 'power3.out',
      delay: 0.4,
    })
  }, [])

  const advance = useCallback(() => {
    setCurrent((c) => (c + 1) % heroImages.length)
  }, [])

  // Auto-advance slideshow
  useEffect(() => {
    if (paused) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(advance, SLIDE_DURATION)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [paused, advance])

  return (
    <section
      className="relative flex flex-col items-center justify-center text-center overflow-hidden"
      style={{ height: '100svh', minHeight: '580px' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Crossfade slideshow */}
      <AnimatePresence mode="sync">
        <motion.div
          key={current}
          className="absolute inset-0 bg-cover bg-center hero-bg"
          style={{
            backgroundImage: `url('${heroImages[current].url}')`,
            backgroundPosition: 'center 40%',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE_DURATION, ease: 'easeInOut' }}
          aria-label={heroImages[current].alt}
          role="img"
        />
      </AnimatePresence>

      {/* Dark gradient overlay — always on top of images */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            'linear-gradient(to bottom, rgba(10,22,40,0.72) 0%, rgba(10,22,40,0.45) 50%, rgba(10,22,40,0.72) 100%)',
        }}
      />

      {/* Content */}
      <div className="hero-content relative z-10 px-5">
        <p
          className="text-[10px] sm:text-[11px] tracking-[0.32em] uppercase mb-5 font-inter"
          style={{ color: '#C9A84C', fontFamily: "'Inter', sans-serif" }}
        >
          Old GRA ·&nbsp; Port Harcourt, Nigeria &nbsp;
        </p>

        {/* GSAP character-split title */}
        <h1
          ref={titleRef}
          className="font-playfair font-light leading-none text-white mb-3 tracking-[0.02em] perspective-[800px]"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(56px, 11vw, 110px)',
          }}
        >
          Mina Hotels
        </h1>

        {/* Subtitle fades in after title */}
        <p
          className="hero-subtitle text-[12px] sm:text-[14px] tracking-[0.26em] uppercase text-white/65 mb-10 font-inter"
          style={{ fontFamily: "'Inter', sans-serif", animationDelay: '1.2s' }}
        >
          Movers &amp; Shakers
        </p>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-col xs:flex-row gap-3 justify-center"
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
            className="inline-block px-9 sm:px-10 py-3.5 border border-white/50 text-white text-[11px] tracking-[0.22em] uppercase hover:bg-white/10 hover:border-white/80 transition-all duration-300 no-underline font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Discover More
          </Link>
        </motion.div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
        {heroImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === current ? 24 : 8,
              height: 8,
              background: i === current ? '#C9A84C' : 'rgba(255,255,255,0.45)',
            }}
          />
        ))}
      </div>

      {/* Animated scroll chevron */}
      <div className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="text-gold" size={20} />
        </motion.div>
      </div>
    </section>
  )

  
}
