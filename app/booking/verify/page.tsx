'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { verifyBookingPayment } from '@/lib/api'
import Link from 'next/link'

type VerifyState = 'verifying' | 'success' | 'failed' | 'error'

function VerifyContent() {
  const searchParams = useSearchParams()
  const [state, setState] = useState<VerifyState>('verifying')
  const [booking, setBooking] = useState<any>(null)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const reference = searchParams.get('reference') || searchParams.get('trxref')

    if (!reference) {
      setState('error')
      setErrorMessage('No payment reference found. Please contact support.')
      return
    }

    const verify = async () => {
      const result = await verifyBookingPayment(reference)

      if (result.success && result.data) {
        setBooking(result.data)
        setState('success')
        try { sessionStorage.removeItem('pendingBooking') } catch {}
      } else {
        setState('failed')
        setErrorMessage(result.error || 'Payment could not be verified.')
      }
    }

    verify()
  }, [searchParams])

  if (state === 'verifying') {
    return (
      <main className="min-h-screen flex items-center justify-center bg-warm-white">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-gold border-t-transparent animate-spin mx-auto mb-6" />
          <h2
            className="font-playfair text-[22px] font-light text-navy"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Verifying your payment…
          </h2>
          <p
            className="text-[13px] text-gray-400 mt-2 font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Please do not close this page
          </p>
        </div>
      </main>
    )
  }

  if (state === 'success' && booking) {
    return (
      <main className="min-h-screen pt-24 pb-20 bg-warm-white">
        <div className="max-w-lg mx-auto px-5 text-center">
          {/* Success icon — square, not circle */}
          <div className="w-16 h-16 bg-gold flex items-center justify-center mx-auto mb-8">
            <svg className="w-8 h-8 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <p
            className="text-[10px] tracking-[0.3em] uppercase text-gold mb-3 font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Reservation Confirmed
          </p>
          <h1
            className="font-playfair text-[34px] font-light text-navy mb-3 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Booking <em className="italic text-gold">Confirmed</em>
          </h1>
          <div className="w-16 h-0.5 bg-gold mx-auto mb-4" />
          <p
            className="text-[13px] text-gray-400 mb-8 font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            A confirmation email has been sent to {booking.guestDetails?.email}
          </p>

          {/* Booking details card */}
          <div
            className="border border-gray-200 p-6 text-left mb-8 bg-white"
          >
            <div className="flex justify-between items-center mb-5 pb-5 border-b border-gray-100">
              <span
                className="text-[9px] tracking-[0.22em] uppercase text-gray-400 font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Booking Reference
              </span>
              <span
                className="font-mono font-bold text-navy text-[16px]"
              >
                {booking.reference}
              </span>
            </div>

            <div className="space-y-3 font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
              {booking.room?.name && (
                <div className="flex justify-between text-[13px]">
                  <span className="text-gray-400">Room</span>
                  <span className="text-navy font-medium">
                    {booking.room.name}{booking.room.roomNumber ? ` — ${booking.room.roomNumber}` : ''}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-[13px]">
                <span className="text-gray-400">Check-in</span>
                <span className="text-navy">
                  {new Date(booking.checkIn).toLocaleDateString('en-GB', {
                    weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-gray-400">Check-out</span>
                <span className="text-navy">
                  {new Date(booking.checkOut).toLocaleDateString('en-GB', {
                    weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-100 text-[14px]">
                <span className="text-gray-400">Total Paid</span>
                <span className="font-semibold text-gold">
                  ₦{booking.totalAmount?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Link
              href="/"
              className="px-7 py-3.5 text-[11px] tracking-[0.22em] uppercase border border-navy text-navy hover:bg-navy hover:text-white transition-colors no-underline font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Back to Home
            </Link>
            <Link
              href="/rooms"
              className="px-7 py-3.5 text-[11px] tracking-[0.22em] uppercase bg-gold text-navy font-semibold hover:bg-gold-light transition-colors no-underline font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Explore More
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-24 pb-20 bg-warm-white">
      <div className="max-w-lg mx-auto px-5 text-center">
        {/* Error icon — square */}
        <div className="w-16 h-16 bg-red-100 flex items-center justify-center mx-auto mb-8">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <p
          className="text-[10px] tracking-[0.3em] uppercase text-gray-400 mb-3 font-inter"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Payment Issue
        </p>
        <h1
          className="font-playfair text-[34px] font-light text-navy mb-3 leading-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Payment <em className="italic">Unsuccessful</em>
        </h1>
        <div className="w-16 h-0.5 bg-gray-200 mx-auto mb-5" />
        <p
          className="text-[13px] text-gray-500 mb-2 font-inter"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {errorMessage}
        </p>
        <p
          className="text-[12px] text-gray-400 mb-8 font-inter"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Your booking has been held for 30 minutes. You can try paying again or contact us for help.
        </p>

        <div className="flex gap-3 justify-center">
          <Link
            href="/rooms"
            className="px-7 py-3.5 text-[11px] tracking-[0.22em] uppercase border border-navy text-navy hover:bg-navy hover:text-white transition-colors no-underline font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Try Again
          </Link>
          <Link
            href="/contact"
            className="px-7 py-3.5 text-[11px] tracking-[0.22em] uppercase bg-navy text-white font-semibold hover:bg-navy/90 transition-colors no-underline font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Contact Us
          </Link>
        </div>
      </div>
    </main>
  )
}

function VerifyFallback() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-warm-white">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-gold border-t-transparent animate-spin mx-auto mb-6" />
        <p
          className="text-[13px] text-gray-400 font-inter"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Loading…
        </p>
      </div>
    </main>
  )
}

export default function BookingVerifyPage() {
  return (
    <Suspense fallback={<VerifyFallback />}>
      <VerifyContent />
    </Suspense>
  )
}
