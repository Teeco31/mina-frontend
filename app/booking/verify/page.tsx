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
      <main className="min-h-screen flex items-center justify-center"
        style={{ background: '#FFFDF7' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#C9A84C] border-t-transparent
            rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-xl font-light text-[#0A1628]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Verifying your payment…
          </h2>
          <p className="text-sm text-gray-500 mt-2"
            style={{ fontFamily: "'Inter', sans-serif" }}>
            Please do not close this page
          </p>
        </div>
      </main>
    )
  }

  if (state === 'success' && booking) {
    return (
      <main className="min-h-screen pt-24 pb-20"
        style={{ background: '#FFFDF7' }}>
        <div className="max-w-lg mx-auto px-5 text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: '#C9A84C' }}>
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-light text-[#0A1628] mb-2"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Booking Confirmed
          </h1>
          <p className="text-sm text-gray-500 mb-8"
            style={{ fontFamily: "'Inter', sans-serif" }}>
            A confirmation email has been sent to {booking.guestDetails?.email}
          </p>

          <div className="border border-[#E8E0D0] rounded-sm p-6 text-left mb-6"
            style={{ background: '#fff' }}>
            <div className="flex justify-between items-center mb-4 pb-4
              border-b border-[#E8E0D0]">
              <span className="text-xs tracking-widest uppercase text-gray-400"
                style={{ fontFamily: "'Inter', sans-serif" }}>
                Booking Reference
              </span>
              <span className="font-mono font-bold text-[#0A1628] text-lg">
                {booking.reference}
              </span>
            </div>

            <div className="space-y-3 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
              {booking.room?.name && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Room</span>
                  <span className="text-[#0A1628] font-medium">
                    {booking.room.name}{booking.room.roomNumber ? ` — ${booking.room.roomNumber}` : ''}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Check-in</span>
                <span className="text-[#0A1628]">
                  {new Date(booking.checkIn).toLocaleDateString('en-GB', {
                    weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Check-out</span>
                <span className="text-[#0A1628]">
                  {new Date(booking.checkOut).toLocaleDateString('en-GB', {
                    weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-[#E8E0D0]">
                <span className="text-gray-500">Total Paid</span>
                <span className="font-semibold text-base" style={{ color: '#C9A84C' }}>
                  ₦{booking.totalAmount?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Link href="/"
              className="px-6 py-3 text-sm border border-[#0A1628] text-[#0A1628]
                hover:bg-[#0A1628] hover:text-white transition-colors"
              style={{ fontFamily: "'Inter', sans-serif" }}>
              Back to Home
            </Link>
            <Link href="/rooms"
              className="px-6 py-3 text-sm text-white transition-colors"
              style={{ background: '#C9A84C', fontFamily: "'Inter', sans-serif" }}>
              Explore More
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-24 pb-20" style={{ background: '#FFFDF7' }}>
      <div className="max-w-lg mx-auto px-5 text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: '#fee2e2' }}>
          <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="text-3xl font-light text-[#0A1628] mb-2"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          Payment Unsuccessful
        </h1>
        <p className="text-sm text-gray-500 mb-2"
          style={{ fontFamily: "'Inter', sans-serif" }}>
          {errorMessage}
        </p>
        <p className="text-xs text-gray-400 mb-8"
          style={{ fontFamily: "'Inter', sans-serif" }}>
          Your booking has been held for 30 minutes.
          You can try paying again or contact us for help.
        </p>

        <div className="flex gap-3 justify-center">
          <Link href="/rooms"
            className="px-6 py-3 text-sm border border-[#0A1628] text-[#0A1628]
              hover:bg-[#0A1628] hover:text-white transition-colors"
            style={{ fontFamily: "'Inter', sans-serif" }}>
            Try Again
          </Link>
          <Link href="/contact"
            className="px-6 py-3 text-sm text-white"
            style={{ background: '#0A1628', fontFamily: "'Inter', sans-serif" }}>
            Contact Us
          </Link>
        </div>
      </div>
    </main>
  )
}

function VerifyFallback() {
  return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: '#FFFDF7' }}>
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#C9A84C] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
        <p className="text-sm text-gray-500" style={{ fontFamily: "'Inter', sans-serif" }}>
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
