'use client'

import { useState } from 'react'
import BookingModal from '@/components/BookingModal'

export default function BookPage() {
  const [bookingOpen, setBookingOpen] = useState(true)

  return (
    <main className="min-h-screen flex items-center justify-center py-20 px-8 bg-navy">
      <div className="text-center">
        <p
          className="text-[10px] tracking-[0.3em] uppercase text-gold mb-4 font-inter"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Reserve
        </p>
        <h1
          className="font-playfair text-[48px] font-light text-white mb-4 leading-[1.05]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Book Your <em className="italic text-gold">Stay</em>
        </h1>
        <div className="w-16 h-0.5 bg-gold mx-auto mb-6" />
        <p
          className="text-[14px] text-white/50 mb-8 font-inter"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Our team will confirm your reservation within the hour.
        </p>
        <button
          onClick={() => setBookingOpen(true)}
          className="px-10 py-3.5 bg-gold text-navy text-[11px] tracking-[0.22em] uppercase font-semibold hover:bg-gold-light transition-colors cursor-pointer font-inter"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Start Reservation
        </button>
      </div>

      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
    </main>
  )
}
