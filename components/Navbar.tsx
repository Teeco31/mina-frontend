'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, UserCircle } from 'lucide-react'
import BookingModal from './BookingModal'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import NavDropdown from './navbar/NavDropdown'

const discoverItems = [
  { label: 'Dining',       href: '/dining' },
  { label: 'Events',       href: '/events' },
  { label: 'Mina Updates', href: '/mina-updates' },
  { label: 'Rewards',      href: '/loyalty' },
]

const aboutItems = [
  { label: 'About',    href: '/#about' },
  { label: 'Reviews',  href: '/reviews' },
  { label: 'Contact',  href: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled]       = useState(false)
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('mina_access_token'))
  }, [])

  useEffect(() => {
    document.body.classList.toggle('mobile-nav-open', mobileOpen)
    return () => document.body.classList.remove('mobile-nav-open')
  }, [mobileOpen])

  // Reset accordion state when mobile menu closes
  useEffect(() => {
    if (!mobileOpen) setMobileExpanded(null)
  }, [mobileOpen])

  const showScrolled = scrolled || !isHome

  const linkColor = showScrolled ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.85)'

  const toggleMobileSection = (key: string) =>
    setMobileExpanded((prev) => (prev === key ? null : key))

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] h-16 md:h-[72px] flex items-center justify-between transition-all duration-500 px-5 sm:px-8 md:px-12 ${
          showScrolled
            ? 'bg-navy/90 backdrop-blur-md shadow-[0_1px_0_rgba(201,168,76,0.15)]'
            : 'bg-transparent'
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="bg-white px-2 py-1.5 flex items-center justify-center flex-shrink-0">
            <Image
              src="/images/images.png"
              alt="Mina Hotels Logo"
              width={36}
              height={28}
              className="object-contain"
            />
          </div>
          <span
            className="hidden sm:block text-[15px] tracking-[0.16em] uppercase font-playfair font-semibold transition-colors duration-300"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: showScrolled ? '#C9A84C' : '#fff',
            }}
          >
            Mina Hotels
          </span>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden lg:flex items-center gap-8 list-none">
          {/* Rooms — standalone flat link */}
          <li>
            <Link
              href="/rooms"
              className="text-[11px] tracking-[0.18em] uppercase no-underline transition-colors duration-300 font-inter"
              style={{
                fontFamily: "'Inter', sans-serif",
                color: pathname.startsWith('/rooms') ? '#C9A84C' : linkColor,
              }}
            >
              Rooms
            </Link>
          </li>

          {/* Discover dropdown */}
          <li>
            <NavDropdown label="Discover" items={discoverItems} showScrolled={showScrolled} />
          </li>

          {/* About dropdown */}
          <li>
            <NavDropdown label="About" items={aboutItems} showScrolled={showScrolled} />
          </li>
        </ul>

        <div className="flex items-center gap-3">
          {/* My Account link — desktop */}
          <Link
            href={isLoggedIn ? '/account' : '/account/login'}
            className="hidden lg:flex items-center gap-1.5 text-[11px] tracking-[0.16em] uppercase transition-colors duration-300 font-inter"
            style={{
              fontFamily: "'Inter', sans-serif",
              color: pathname.startsWith('/account') ? '#C9A84C' : linkColor,
            }}
          >
            <UserCircle size={15} strokeWidth={1.5} />
            My Account
          </Link>

          {/* Book Now CTA */}
          <button
            onClick={() => setBookingOpen(true)}
            className="hidden lg:inline-block text-[10px] tracking-[0.22em] uppercase px-6 py-2.5 bg-gold text-navy font-semibold hover:bg-gold-light hover:scale-[1.03] hover:brightness-105 transition-all duration-300 cursor-pointer"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Book Now
          </button>

          {/* Mobile: compact book button */}
          <button
            onClick={() => setBookingOpen(true)}
            className="lg:hidden text-[10px] tracking-[0.14em] uppercase px-3 py-1.5 bg-gold text-navy font-semibold transition-all duration-300"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Book
          </button>

          {/* Hamburger */}
          <button
            className="lg:hidden p-1 cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen
              ? <X className="text-gold" size={22} />
              : <Menu className={showScrolled ? 'text-gold' : 'text-white'} size={22} />
            }
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-nav"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="fixed inset-0 z-[99] bg-navy flex flex-col items-center justify-center gap-5 overflow-y-auto py-16"
          >
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="text-[22px] font-playfair font-semibold tracking-[0.12em] uppercase mb-2"
              style={{ fontFamily: "'Playfair Display', serif", color: '#C9A84C' }}
            >
              Mina Hotels
            </Link>

            {/* Rooms — flat */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06, duration: 0.4 }}
            >
              <Link
                href="/rooms"
                onClick={() => setMobileOpen(false)}
                className="text-3xl sm:text-4xl font-playfair font-light text-white tracking-[0.06em] hover:text-gold transition-colors"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Rooms
              </Link>
            </motion.div>

            {/* Discover accordion */}
            <motion.div
              className="w-full max-w-xs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.4 }}
            >
              <button
                onClick={() => toggleMobileSection('discover')}
                className="w-full flex items-center justify-center gap-2 text-3xl sm:text-4xl font-playfair font-light text-white tracking-[0.06em] hover:text-gold transition-colors cursor-pointer"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Discover
                <motion.span
                  animate={{ rotate: mobileExpanded === 'discover' ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <ChevronDown size={22} strokeWidth={1.5} />
                </motion.span>
              </button>

              <AnimatePresence>
                {mobileExpanded === 'discover' && (
                  <motion.div
                    key="discover-items"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col items-center gap-3 mt-3 pl-6">
                      {discoverItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="text-xl sm:text-2xl font-playfair font-light tracking-[0.06em] transition-colors hover:text-gold"
                          style={{
                            fontFamily: "'Playfair Display', serif",
                            color: 'rgba(255,255,255,0.70)',
                          }}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* About accordion */}
            <motion.div
              className="w-full max-w-xs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.4 }}
            >
              <button
                onClick={() => toggleMobileSection('about')}
                className="w-full flex items-center justify-center gap-2 text-3xl sm:text-4xl font-playfair font-light text-white tracking-[0.06em] hover:text-gold transition-colors cursor-pointer"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                About
                <motion.span
                  animate={{ rotate: mobileExpanded === 'about' ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <ChevronDown size={22} strokeWidth={1.5} />
                </motion.span>
              </button>

              <AnimatePresence>
                {mobileExpanded === 'about' && (
                  <motion.div
                    key="about-items"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col items-center gap-3 mt-3 pl-6">
                      {aboutItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="text-xl sm:text-2xl font-playfair font-light tracking-[0.06em] transition-colors hover:text-gold"
                          style={{
                            fontFamily: "'Playfair Display', serif",
                            color: 'rgba(255,255,255,0.70)',
                          }}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.4 }}
              onClick={() => { setMobileOpen(false); setBookingOpen(true) }}
              className="mt-6 text-[11px] tracking-[0.22em] uppercase px-10 py-3.5 bg-gold text-navy font-semibold hover:bg-gold-light transition-colors cursor-pointer"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Book a Room
            </motion.button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.34, duration: 0.4 }}
            >
              <Link
                href={isLoggedIn ? '/account' : '/account/login'}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 text-[12px] tracking-[0.18em] uppercase text-white/50 hover:text-gold transition-colors font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <UserCircle size={15} strokeWidth={1.5} />
                My Account
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
    </>
  )
}
