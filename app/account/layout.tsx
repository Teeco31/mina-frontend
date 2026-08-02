'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutGrid, CalendarCheck, UtensilsCrossed, ShoppingBag,
  CalendarDays, Star, User, LogOut, Menu, X,
} from 'lucide-react'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'

const NAV = [
  { href: '/account', label: 'Overview', icon: LayoutGrid, exact: true },
  { href: '/account/bookings', label: 'My Bookings', icon: CalendarCheck },
  { href: '/account/menu', label: 'Food & Drinks', icon: UtensilsCrossed },
  { href: '/account/orders', label: 'My Orders', icon: ShoppingBag },
  { href: '/account/reservations', label: 'Reservations', icon: CalendarDays },
  { href: '/account/loyalty', label: 'Loyalty Rewards', icon: Star },
  { href: '/account/profile', label: 'Profile', icon: User },
]

const AUTH_PATHS = ['/account/login', '/account/register']

function AccountShell({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const isAuthPage = AUTH_PATHS.some((p) => pathname.startsWith(p))

  useEffect(() => {
    if (!loading && !user && !isAuthPage) {
      router.replace('/account/login')
    }
  }, [loading, user, isAuthPage, router])

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-navy flex flex-col">
        <div className="flex-shrink-0 px-5 sm:px-8 py-5 border-b border-white/10">
          <Link
            href="/"
            className="inline-block font-playfair text-[17px] font-light text-white tracking-[0.12em] uppercase hover:text-gold transition-colors"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Mina Hotels
          </Link>
        </div>
        <div className="flex-1 flex items-start justify-center px-5 pt-16 pb-12">
          {children}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="w-1 h-8 bg-gold/40 animate-pulse" />
      </div>
    )
  }

  if (!user) return null

  const isActive = (item: typeof NAV[0]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)

  const handleLogout = async () => {
    await logout()
    router.replace('/')
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Hotel wordmark */}
      <div className="px-6 py-6 border-b border-white/10">
        <Link
          href="/"
          className="block font-playfair text-[15px] font-light text-white tracking-[0.14em] uppercase hover:text-gold transition-colors"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Mina Hotels
        </Link>
        <p
          className="text-[10px] tracking-[0.16em] uppercase text-white/30 mt-0.5 font-inter"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Guest Portal
        </p>
      </div>

      {/* Guest identity */}
      <div className="px-6 py-5 border-b border-white/10">
        <p
          className="font-playfair text-[20px] font-light text-white leading-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {user.firstName} {user.lastName}
        </p>
        {user.rewardsNumber && (
          <p
            className="text-[10px] text-gold/60 font-mono mt-0.5 font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {user.rewardsNumber}
          </p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map((item) => {
          const active = isActive(item)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileNavOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 text-[12px] tracking-[0.04em] transition-all font-inter ${
                active
                  ? 'border-l-2 border-gold text-white pl-[10px]'
                  : 'text-white/40 hover:text-white/70 border-l-2 border-transparent'
              }`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <Icon size={14} className="flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full text-left text-[12px] text-white/40 hover:text-white/70 transition-colors font-inter"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <LogOut size={14} />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex w-56 flex-col flex-shrink-0 overflow-hidden"
        style={{ background: '#0A1628' }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileNavOpen(false)}
          />
          <aside
            className="absolute left-0 top-0 bottom-0 w-56 flex flex-col"
            style={{ background: '#0A1628' }}
          >
            <button
              onClick={() => setMobileNavOpen(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <header className="lg:hidden flex-shrink-0 h-12 flex items-center gap-4 px-5 bg-navy border-b border-white/10">
          <button
            onClick={() => setMobileNavOpen(true)}
            className="text-white/50 hover:text-white transition-colors"
          >
            <Menu size={18} />
          </button>
          <p
            className="font-playfair text-[15px] font-light text-white tracking-[0.1em] uppercase"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Mina Hotels
          </p>
        </header>

        <main className="flex-1 overflow-y-auto bg-warm-white">
          {children}
        </main>

        {/* Mobile bottom tab bar */}
        <nav className="lg:hidden flex-shrink-0 bg-navy border-t border-white/10">
          <div className="flex">
            {NAV.slice(0, 5).map((item) => {
              const active = isActive(item)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex-1 flex flex-col items-center gap-1 py-2.5 transition-colors ${
                    active ? 'text-gold' : 'text-white/30'
                  }`}
                >
                  <Icon size={17} />
                  <span
                    className="text-[9px] tracking-[0.04em] font-inter leading-none"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {item.label.split(' ')[0]}
                  </span>
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </div>
  )
}

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AccountShell>{children}</AccountShell>
    </AuthProvider>
  )
}
