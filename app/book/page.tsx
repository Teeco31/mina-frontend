'use client'

import { useState } from 'react'
import BookingModal from '@/components/BookingModal'

export default function BookPage() {
  const [bookingOpen, setBookingOpen] = useState(true)

  return (
    <main className="min-h-screen flex items-center justify-center py-20 px-8" style={{ background: 'var(--dark-section)' }}>
      <div className="text-center">
        <p className="text-[10px] tracking-[0.28em] uppercase text-gold mb-4">Reserve</p>
        <h1 className="font-cormorant text-[48px] font-light text-white mb-4"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Book Your Stay
        </h1>
        <p className="text-[14px] text-white/50 mb-8">
          Our team will confirm your reservation within the hour.
        </p>
        <button
          onClick={() => setBookingOpen(true)}
          className="px-10 py-4 bg-gold text-white text-[11px] tracking-[0.2em] uppercase hover:bg-gold-light transition-colors"
        >
          Start Reservation
        </button>
      </div>

      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
    </main>
  )
}
