'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { usePathname } from 'next/navigation'

interface NavItem {
  label: string
  href: string
}

interface NavDropdownProps {
  label: string
  items: NavItem[]
  showScrolled: boolean
}

export default function NavDropdown({ label, items, showScrolled }: NavDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  // Highlight trigger if any child is active
  const isActive = items.some((item) =>
    item.href === '/'
      ? pathname === '/'
      : item.href.startsWith('/#')
        ? pathname === '/'
        : pathname.startsWith(item.href)
  )

  const triggerColor = isActive
    ? '#C9A84C'
    : showScrolled
    ? 'rgba(255,255,255,0.75)'
    : 'rgba(255,255,255,0.85)'

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-[11px] tracking-[0.18em] uppercase transition-colors duration-300 font-inter cursor-pointer"
        style={{
          fontFamily: "'Inter', sans-serif",
          color: triggerColor,
        }}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {label}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <ChevronDown size={12} strokeWidth={2} />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="dropdown"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute top-full left-0 mt-3 min-w-[180px] shadow-xl border border-white/10 py-2 z-50"
            style={{ background: '#0A1628' }}
            role="menu"
          >
            {items.map((item) => {
              const itemActive = item.href.startsWith('/#')
                ? pathname === '/'
                : pathname.startsWith(item.href) && item.href !== '/'

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  role="menuitem"
                  className="block px-4 py-2.5 text-[11px] tracking-[0.14em] uppercase transition-all duration-150 no-underline border-l-2"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    color: itemActive ? '#C9A84C' : 'rgba(255,255,255,0.80)',
                    borderLeftColor: itemActive ? '#C9A84C' : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget
                    el.style.color = '#ffffff'
                    el.style.borderLeftColor = '#C9A84C'
                    el.style.background = 'rgba(255,255,255,0.07)'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget
                    el.style.color = itemActive ? '#C9A84C' : 'rgba(255,255,255,0.80)'
                    el.style.borderLeftColor = itemActive ? '#C9A84C' : 'transparent'
                    el.style.background = 'transparent'
                  }}
                >
                  {item.label}
                </Link>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
