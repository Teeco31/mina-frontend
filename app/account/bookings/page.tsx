'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { getMemberBookings, formatNGN, formatDate, type MemberBooking } from '@/lib/memberApi'

const STATUS_LABEL: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  'checked-in': 'Checked In',
  'checked-out': 'Checked Out',
  cancelled: 'Cancelled',
  'no-show': 'No Show',
}

const PAYMENT_LABEL: Record<string, string> = {
  pending: 'Payment pending',
  partial: 'Partially paid',
  paid: 'Paid',
  refunded: 'Refunded',
  failed: 'Payment failed',
}

const CATEGORY_LABEL: Record<string, string> = {
  standard: 'Standard',
  deluxe: 'Deluxe',
  royal: 'Royal',
  executive: 'Executive',
  'exclusive-suite': 'Exclusive Suite',
  'luxury-suite': 'Luxury Suite',
}

function statusColor(status: string): string {
  if (status === 'checked-in' || status === 'confirmed') return 'text-gold'
  if (status === 'checked-out') return 'text-gray-500'
  if (status === 'cancelled' || status === 'no-show') return 'text-red-400'
  return 'text-gray-400'
}

function BookingRow({ booking }: { booking: MemberBooking }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        className="w-full text-left py-4 flex items-start justify-between gap-4 group"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span
              className="text-[13px] font-medium text-navy font-mono font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {booking.reference}
            </span>
            <span
              className="text-[12px] text-gray-400 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {CATEGORY_LABEL[booking.roomCategory] || booking.roomCategory}
              {booking.room?.roomNumber ? ` — Room ${booking.room.roomNumber}` : ''}
            </span>
          </div>
          <div
            className="mt-1.5 flex flex-wrap gap-x-5 gap-y-0.5 text-[11px] text-gray-500 font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <span>
              {new Date(booking.checkIn).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              {' — '}
              {new Date(booking.checkOut).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            <span>{booking.numberOfNights} night{booking.numberOfNights !== 1 ? 's' : ''}</span>
            <span>{formatNGN(booking.totalAmount)}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span
            className={`text-[11px] font-inter ${statusColor(booking.status)}`}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {STATUS_LABEL[booking.status]}
          </span>
          <span className="text-gray-300">
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </span>
        </div>
      </button>

      {expanded && (
        <div className="pb-5 pl-0 space-y-4">
          <div className="h-px bg-gray-50" />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3">
            <div>
              <p
                className="text-[9px] tracking-[0.18em] uppercase text-gray-400 mb-0.5 font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Check-in
              </p>
              <p
                className="text-[12px] text-navy font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {formatDate(booking.checkIn)}
              </p>
            </div>
            <div>
              <p
                className="text-[9px] tracking-[0.18em] uppercase text-gray-400 mb-0.5 font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Check-out
              </p>
              <p
                className="text-[12px] text-navy font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {formatDate(booking.checkOut)}
              </p>
            </div>
            <div>
              <p
                className="text-[9px] tracking-[0.18em] uppercase text-gray-400 mb-0.5 font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Guests
              </p>
              <p
                className="text-[12px] text-navy font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {booking.adults} adult{booking.adults !== 1 ? 's' : ''}
                {booking.children > 0 ? `, ${booking.children} child${booking.children !== 1 ? 'ren' : ''}` : ''}
              </p>
            </div>
            <div>
              <p
                className="text-[9px] tracking-[0.18em] uppercase text-gray-400 mb-0.5 font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Room Rate
              </p>
              <p
                className="text-[12px] text-navy font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {formatNGN(booking.pricePerNight)} / night
              </p>
            </div>
            <div>
              <p
                className="text-[9px] tracking-[0.18em] uppercase text-gray-400 mb-0.5 font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Total (incl. 7.5% VAT)
              </p>
              <p
                className="text-[12px] text-navy font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {formatNGN(booking.totalAmount)}
              </p>
            </div>
            <div>
              <p
                className="text-[9px] tracking-[0.18em] uppercase text-gray-400 mb-0.5 font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Payment
              </p>
              <p
                className={`text-[12px] font-inter ${
                  booking.paymentStatus === 'paid' ? 'text-green-600' : 'text-gray-500'
                }`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {PAYMENT_LABEL[booking.paymentStatus]}
              </p>
            </div>
          </div>

          {booking.addons?.length > 0 && (
            <div>
              <p
                className="text-[9px] tracking-[0.18em] uppercase text-gray-400 mb-2 font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Add-ons
              </p>
              <div className="space-y-1">
                {booking.addons.map((addon, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-[12px] text-gray-500 font-inter"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <span>
                      {addon.name} × {addon.quantity}
                    </span>
                    <span>{formatNGN(addon.total)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {booking.specialRequests && (
            <div>
              <p
                className="text-[9px] tracking-[0.18em] uppercase text-gray-400 mb-1 font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Special Requests
              </p>
              <p
                className="text-[12px] text-gray-500 italic font-inter leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {booking.specialRequests}
              </p>
            </div>
          )}

          {booking.loyaltyPointsEarned > 0 && (
            <p
              className="text-[11px] text-gold font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              +{booking.loyaltyPointsEarned.toLocaleString()} loyalty points earned
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<MemberBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getMemberBookings().then(({ bookings: b, error: e }) => {
      if (e) setError(e)
      setBookings(b)
      setLoading(false)
    })
  }, [])

  return (
    <div className="px-5 sm:px-8 md:px-10 py-10 max-w-3xl">
      <div className="mb-8">
        <p
          className="text-[9px] tracking-[0.26em] uppercase text-gray-400 mb-2 font-inter"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Stay History
        </p>
        <h1
          className="font-playfair text-[28px] font-light text-navy"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          My Bookings
        </h1>
        <div className="w-10 h-px bg-gold mt-3" />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <p
          className="text-[13px] text-red-500 font-inter"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {error}
        </p>
      ) : bookings.length === 0 ? (
        <div className="py-8">
          <p
            className="text-[14px] text-gray-400 font-inter leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            No bookings on record.{' '}
            <Link href="/rooms" className="text-gold hover:text-gold-light transition-colors">
              Ready to plan your stay?
            </Link>
          </p>
        </div>
      ) : (
        <div>
          {bookings.map((booking) => (
            <BookingRow key={booking._id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  )
}
