'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import BookingModal from './BookingModal'

export default function BookingBar() {
  const [bookingOpen, setBookingOpen] = useState(false)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState('2 Guests')
  const [roomType, setRoomType] = useState('All Rooms')

  const today = new Date().toISOString().split('T')[0]

  return (
    <>
      <div className="bg-navy px-5 sm:px-8 md:px-12 py-7 md:py-9 border-b border-gold/15">
        {/* Label */}
        <span
          className="block text-[13px] md:text-[15px] font-light text-white tracking-[0.06em] mb-5 md:mb-6 font-playfair"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Find Your Stay
        </span>

        {/* Fields grid */}
        <div className="grid grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-x-6 gap-y-5 items-end">
          <div className="flex flex-col gap-1.5">
            <label
              className="text-[9px] tracking-[0.2em] uppercase text-white/40 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Check In
            </label>
            <input
              type="date"
              min={today}
              value={checkIn}
              onChange={e => setCheckIn(e.target.value)}
              className="booking-input"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              className="text-[9px] tracking-[0.2em] uppercase text-white/40 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Check Out
            </label>
            <input
              type="date"
              min={checkIn || today}
              value={checkOut}
              onChange={e => setCheckOut(e.target.value)}
              className="booking-input"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              className="text-[9px] tracking-[0.2em] uppercase text-white/40 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Guests
            </label>
            <select
              value={guests}
              onChange={e => setGuests(e.target.value)}
              className="booking-input"
            >
              {[1, 2, 3, 4].map(n => (
                <option key={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              className="text-[9px] tracking-[0.2em] uppercase text-white/40 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Room Type
            </label>
            <select
              value={roomType}
              onChange={e => setRoomType(e.target.value)}
              className="booking-input"
            >
              {['All Rooms', 'Standard', 'Deluxe', 'Royal', 'Executive', 'Exclusive Suite', 'Luxury Suite'].map(r => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="col-span-2 lg:col-span-1">
            <button
              onClick={() => setBookingOpen(true)}
              className="w-full lg:w-auto px-8 py-3.5 bg-gold text-navy text-[11px] tracking-[0.22em] uppercase font-semibold whitespace-nowrap hover:bg-gold-light hover:scale-[1.02] transition-all duration-300 cursor-pointer font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Check Availability
            </button>
          </div>
        </div>
      </div>

      {typeof window !== 'undefined' && createPortal(
        <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />,
        document.body
      )}
    </>
  )
}
