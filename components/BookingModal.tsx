'use client'

import { useState, useEffect } from 'react'
import { X, ChevronRight, Check, AlertCircle } from 'lucide-react'
import { checkAvailability, initiateBooking } from '@/lib/api'
import { type FallbackRoom } from '@/lib/fallback'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  // When set, the modal checks availability for this specific room
  preSelectedRoom?: FallbackRoom | null
}

type Step = 'dates' | 'room' | 'details' | 'confirm' | 'success'
const ALL_STEPS: Step[] = ['dates', 'room', 'details', 'confirm']
const ALL_LABELS = ['Dates', 'Room', 'Details', 'Confirm']

// Steps when a room is pre-selected — room picker is replaced by availability result
const PRESELECT_STEPS: Step[] = ['dates', 'details', 'confirm']
const PRESELECT_LABELS = ['Dates', 'Details', 'Confirm']

export default function BookingModal({ isOpen, onClose, preSelectedRoom }: BookingModalProps) {
  const [step, setStep] = useState<Step>('dates')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState('2')
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', requests: '' })

  // For generic modal — list of available rooms user picks from
  const [availableRooms, setAvailableRooms] = useState<FallbackRoom[]>([])
  const [selectedRoomId, setSelectedRoomId] = useState('')

  // For pre-selected room — availability result for that specific room
  const [roomAvailable, setRoomAvailable] = useState<boolean | null>(null) // null = not checked yet
  const [checkingAvailability, setCheckingAvailability] = useState(false)
  // The confirmed real MongoDB _id to use when submitting the booking
  const [confirmedRoomId, setConfirmedRoomId] = useState<string | null>(null)

  const [availabilityError, setAvailabilityError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [confirmedRef, setConfirmedRef] = useState('')

  // Lock background scroll (including Lenis) while the modal is open
  useEffect(() => {
    if (!isOpen) return
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    return () => {
      html.style.overflow = prev
    }
  }, [isOpen])

  const today = new Date().toISOString().split('T')[0]
  const nights = checkIn && checkOut
    ? Math.max(0, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
    : 0

  // Determine which room is confirmed for booking
  const bookedRoom = preSelectedRoom
    ? preSelectedRoom
    : availableRooms.find(r => r._id === selectedRoomId || r.id === selectedRoomId) || null

  const totalPrice = (bookedRoom?.pricePerNight || 0) * (nights || 1)

  // ── Step logic ──────────────────────────────────────────────────────────────
  const steps = preSelectedRoom ? PRESELECT_STEPS : ALL_STEPS
  const labels = preSelectedRoom ? PRESELECT_LABELS : ALL_LABELS
  const stepIdx = steps.indexOf(step as Step)

  // ── Find rooms / check availability ─────────────────────────────────────────
  const handleCheckDates = async () => {
    if (!checkIn || !checkOut || nights < 1) return
    setCheckingAvailability(true)
    setRoomAvailable(null)

    if (preSelectedRoom) {
      // Check if this specific room is available for the selected dates
      try {
        const result = await checkAvailability(checkIn, checkOut, parseInt(guests))

        // Match by real _id first, then fall back to category slug comparison
        const categorySlug = preSelectedRoom.category.toLowerCase().replace(/\s+/g, '-')
        const matchedRoom = result?.data?.find(r =>
          r._id === preSelectedRoom._id ||
          r.category === categorySlug ||
          r.category === preSelectedRoom.category.toLowerCase()
        )
        const available = !!matchedRoom

        setRoomAvailable(available)
        if (available) {
          // Store the real _id from the API response for the booking submission
          setConfirmedRoomId(matchedRoom!._id)
          setStep('details')
        }
        // If not available, stay on 'dates' step and show the unavailability message
      } catch {
        // API unreachable — optimistically proceed, backend validates on submit
        setRoomAvailable(true)
        setStep('details')
      }
    } else {
      // Generic flow — fetch all available rooms
      setStep('room')
      setAvailabilityError('')
      try {
        const result = await checkAvailability(checkIn, checkOut, parseInt(guests))
        if (result?.data?.length) {
          const mapped = result.data.map(r => ({
            ...r,
            id: r._id,
            price: `₦${r.pricePerNight.toLocaleString()}`,
            img: r.images?.[0]?.url || '',
          })) as unknown as FallbackRoom[]
          setAvailableRooms(mapped)
        }
        // availableRooms stays empty → room step shows "no rooms" state
      } catch {
        setAvailabilityError('Unable to check availability. Please try again or contact us.')
      }
    }

    setCheckingAvailability(false)
  }

  // ── Submit booking ───────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!bookedRoom) return
    setSubmitting(true)
    setSubmitError('')
    setLoadingMessage('Creating your booking…')

    const result = await initiateBooking({
      roomId: confirmedRoomId || bookedRoom._id,
      checkIn,
      checkOut,
      adults: parseInt(guests),
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      specialRequests: form.requests,
      source: 'website',
    })

    if (!result.success || !result.data) {
      setSubmitError(result.error || 'Booking failed. Please try again.')
      setSubmitting(false)
      setLoadingMessage('')
      return
    }

    // Store booking details so the verify page can show them immediately
    try {
      sessionStorage.setItem('pendingBooking', JSON.stringify({
        bookingId: result.data.bookingId,
        reference: result.data.reference,
        paymentReference: result.data.paymentReference,
        totalAmount: result.data.totalAmount,
        checkIn: result.data.checkIn,
        checkOut: result.data.checkOut,
        room: result.data.room,
        guestDetails: result.data.guestDetails,
      }))
    } catch {
      // sessionStorage unavailable — verify page will call the API directly
    }

    setLoadingMessage('Redirecting to secure payment…')
    await new Promise(resolve => setTimeout(resolve, 700))
    window.location.href = result.data.paymentUrl
  }

  const reset = () => {
    setStep('dates')
    setCheckIn('')
    setCheckOut('')
    setGuests('2')
    setAvailableRooms([])
    setSelectedRoomId('')
    setRoomAvailable(null)
    setConfirmedRoomId(null)
    setForm({ firstName: '', lastName: '', email: '', phone: '', requests: '' })
    setAvailabilityError('')
    setSubmitError('')
    setLoadingMessage('')
    setConfirmedRef('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-panel bg-dark-section max-h-[92vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-8 py-5 border-b border-white/10 sticky top-0 bg-dark-section z-10">
          <div>
            <p className="text-[10px] tracking-[0.28em] uppercase text-gold mb-0.5">Mina Hotels</p>
            <h2 className="font-cormorant text-xl sm:text-2xl font-light text-white"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {step === 'success'
                ? 'Reservation Received'
                : preSelectedRoom
                ? preSelectedRoom.name
                : 'Reserve Your Stay'}
            </h2>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white/80 transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        {/* Step pills */}
        {step !== 'success' && (
          <div className="flex px-5 sm:px-8 py-3.5 gap-2 border-b border-white/10 overflow-x-auto">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-1.5 flex-shrink-0">
                <div className={`w-6 h-6 flex items-center justify-center text-[10px] transition-all ${
                  step === s ? 'bg-gold text-white' : stepIdx > i ? 'bg-gold/25 text-gold-light' : 'bg-white/10 text-white/30'
                }`}>
                  {stepIdx > i ? <Check size={11} /> : i + 1}
                </div>
                <span className={`text-[10px] tracking-[0.14em] uppercase hidden xs:block ${step === s ? 'text-white' : 'text-white/30'}`}>
                  {labels[i]}
                </span>
                {i < steps.length - 1 && <ChevronRight size={11} className="text-white/20" />}
              </div>
            ))}
          </div>
        )}

        <div className="px-5 sm:px-8 py-7">

          {/* ── STEP: DATES ─────────────────────────────────────────────────── */}
          {step === 'dates' && (
            <div className="space-y-5">

              {/* Pre-selected room info strip */}
              {preSelectedRoom && (
                <div className="flex gap-3 p-3.5 border border-white/10 items-center">
                  <img src={preSelectedRoom.img} alt={preSelectedRoom.name}
                    className="w-16 h-12 object-cover flex-shrink-0" />
                  <div>
                    <p className="text-[9px] tracking-[0.18em] uppercase text-gold mb-0.5">{preSelectedRoom.category}</p>
                    <p className="font-cormorant text-[18px] text-white font-light"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}>{preSelectedRoom.name}</p>
                    <p className="text-[12px] text-white/50">
                      ₦{preSelectedRoom.pricePerNight.toLocaleString()} / night
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] tracking-[0.22em] uppercase text-muted">Check In</label>
                  <input type="date" min={today} value={checkIn}
                    onChange={e => { setCheckIn(e.target.value); setRoomAvailable(null) }}
                    className="contact-input" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] tracking-[0.22em] uppercase text-muted">Check Out</label>
                  <input type="date" min={checkIn || today} value={checkOut}
                    onChange={e => { setCheckOut(e.target.value); setRoomAvailable(null) }}
                    className="contact-input" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[9px] tracking-[0.22em] uppercase text-muted">Guests</label>
                <select value={guests} onChange={e => setGuests(e.target.value)} className="contact-input">
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
                </select>
              </div>

              {nights > 0 && (
                <p className="text-[12px] text-white/45">{nights} night{nights > 1 ? 's' : ''} selected</p>
              )}

              {/* Not available message */}
              {roomAvailable === false && (
                <div className="flex items-start gap-2.5 p-4 border border-danger/30 bg-danger/10">
                  <AlertCircle size={15} className="text-danger flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[13px] text-white font-medium mb-1">
                      {preSelectedRoom?.name} is not available for those dates
                    </p>
                    <p className="text-[12px] text-white/55 leading-relaxed">
                      Please try different dates, or{' '}
                      <button
                        onClick={() => { setRoomAvailable(null); setStep('room') }}
                        className="text-gold-light underline underline-offset-2 hover:text-gold transition-colors"
                      >
                        browse all available rooms
                      </button>
                      {' '}for those dates instead.
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={handleCheckDates}
                disabled={!checkIn || !checkOut || nights < 1 || checkingAvailability}
                className="w-full py-3.5 bg-gold text-white text-[11px] tracking-[0.2em] uppercase disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gold-light transition-colors"
              >
                {checkingAvailability
                  ? 'Checking availability…'
                  : preSelectedRoom
                  ? 'Check Availability'
                  : 'Find Available Rooms'}
              </button>

              {/* If room wasn't available, offer to see all rooms */}
              {roomAvailable === false && (
                <button
                  onClick={async () => {
                    setCheckingAvailability(true)
                    setAvailabilityError('')
                    setStep('room')
                    try {
                      const result = await checkAvailability(checkIn, checkOut, parseInt(guests))
                      if (result?.data?.length) {
                        const mapped = result.data.map(r => ({
                          ...r, id: r._id,
                          price: `₦${r.pricePerNight.toLocaleString()}`,
                          img: r.images?.[0]?.url || '',
                        })) as unknown as FallbackRoom[]
                        setAvailableRooms(mapped)
                      }
                    } catch {
                      setAvailabilityError('Unable to check availability. Please try again or contact us.')
                    }
                    setCheckingAvailability(false)
                  }}
                  className="w-full py-3 border border-white/15 text-white/60 text-[11px] tracking-[0.14em] uppercase hover:border-white/30 transition-colors"
                >
                  Browse All Available Rooms
                </button>
              )}
            </div>
          )}

          {/* ── STEP: ROOM SELECTION (generic flow only) ─────────────────────── */}
          {step === 'room' && (
            <div className="space-y-3">
              {availableRooms.length === 0 ? (
                checkingAvailability ? (
                  <div className="py-10 text-center">
                    <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-[13px] text-white/50">Checking availability…</p>
                  </div>
                ) : (
                  <div className="py-10 text-center space-y-2">
                    <p className="text-[13px] text-white/60">
                      {availabilityError || 'No rooms available for these dates.'}
                    </p>
                    <p className="text-[11px] text-white/30">
                      Try different dates or call us: <span className="text-gold-light">+234 901 552 5389</span>
                    </p>
                  </div>
                )
              ) : (
                availableRooms.map(r => (
                  <div key={r._id || r.id} onClick={() => setSelectedRoomId(r._id || r.id)}
                    className={`flex gap-3 p-3.5 cursor-pointer border transition-all ${
                      (selectedRoomId === r._id || selectedRoomId === r.id)
                        ? 'border-gold' : 'border-white/10 hover:border-white/25'
                    }`}>
                    <img src={r.img} alt={r.name} className="w-16 h-14 sm:w-20 sm:h-16 object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-[9px] tracking-[0.18em] uppercase text-gold mb-0.5">{r.category}</p>
                          <h4 className="font-cormorant text-base sm:text-lg text-white font-light"
                            style={{ fontFamily: "'Cormorant Garamond', serif" }}>{r.name}</h4>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-cormorant text-lg sm:text-xl text-white font-light"
                            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                            ₦{r.pricePerNight.toLocaleString()}
                          </p>
                          <p className="text-[10px] text-white/40">/ night</p>
                        </div>
                      </div>
                      <p className="text-[11px] text-white/40 mt-1 leading-relaxed hidden sm:block line-clamp-1">
                        {r.description}
                      </p>
                    </div>
                    {(selectedRoomId === r._id || selectedRoomId === r.id) && (
                      <div className="flex-shrink-0 self-center">
                        <div className="w-5 h-5 bg-gold flex items-center justify-center">
                          <Check size={11} className="text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep('dates')}
                  className="flex-1 py-3 border border-white/15 text-white/50 text-[11px] tracking-[0.14em] uppercase hover:border-white/30 transition-colors">
                  Back
                </button>
                <button onClick={() => setStep('details')} disabled={!selectedRoomId}
                  className="flex-1 py-3 bg-gold text-white text-[11px] tracking-[0.2em] uppercase disabled:opacity-40 hover:bg-gold-light transition-colors">
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* ── STEP: GUEST DETAILS ─────────────────────────────────────────── */}
          {step === 'details' && (
            <div className="space-y-5">

              {/* Confirmed room summary */}
              {bookedRoom && (
                <div className="flex gap-3 p-3.5 border border-white/10 items-center mb-2">
                  <img src={bookedRoom.img} alt={bookedRoom.name} className="w-14 h-11 object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] tracking-[0.16em] uppercase text-gold mb-0.5">{bookedRoom.category}</p>
                    <p className="font-cormorant text-[17px] text-white font-light truncate"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}>{bookedRoom.name}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[11px] text-white/50">{nights}n × ₦{bookedRoom.pricePerNight.toLocaleString()}</p>
                    <p className="font-cormorant text-[18px] text-white font-light"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      ₦{totalPrice.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] tracking-[0.22em] uppercase text-muted">First Name *</label>
                  <input type="text" placeholder="Emeka" value={form.firstName}
                    onChange={e => setForm({...form, firstName: e.target.value})} className="contact-input" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] tracking-[0.22em] uppercase text-muted">Last Name</label>
                  <input type="text" placeholder="Okafor" value={form.lastName}
                    onChange={e => setForm({...form, lastName: e.target.value})} className="contact-input" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[9px] tracking-[0.22em] uppercase text-muted">Email Address *</label>
                <input type="email" placeholder="emeka@email.com" value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})} className="contact-input" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[9px] tracking-[0.22em] uppercase text-muted">Phone Number</label>
                <input type="tel" placeholder="+234 801 234 5678" value={form.phone}
                  onChange={e => setForm({...form, phone: e.target.value})} className="contact-input" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[9px] tracking-[0.22em] uppercase text-muted">Special Requests (optional)</label>
                <textarea placeholder="Dietary requirements, accessibility needs, preferences…" value={form.requests}
                  onChange={e => setForm({...form, requests: e.target.value})} className="contact-input min-h-[64px]" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(preSelectedRoom ? 'dates' : 'room')}
                  className="flex-1 py-3 border border-white/15 text-white/50 text-[11px] tracking-[0.14em] uppercase hover:border-white/30 transition-colors">
                  Back
                </button>
                <button onClick={() => setStep('confirm')} disabled={!form.firstName || !form.email}
                  className="flex-1 py-3 bg-gold text-white text-[11px] tracking-[0.2em] uppercase disabled:opacity-40 hover:bg-gold-light transition-colors">
                  Review
                </button>
              </div>
            </div>
          )}

          {/* ── STEP: CONFIRM ───────────────────────────────────────────────── */}
          {step === 'confirm' && bookedRoom && (
            <div className="space-y-5">
              <div className="border border-white/10 p-5 space-y-4">
                <p className="text-[10px] tracking-[0.24em] uppercase text-gold">Booking Summary</p>
                <div className="flex gap-3">
                  <img src={bookedRoom.img} alt={bookedRoom.name} className="w-20 h-14 object-cover flex-shrink-0" />
                  <div>
                    <p className="text-[9px] tracking-[0.18em] uppercase text-muted mb-0.5">{bookedRoom.category}</p>
                    <p className="font-cormorant text-xl text-white font-light"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}>{bookedRoom.name}</p>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-4 grid grid-cols-2 gap-y-3 gap-x-4">
                  {[
                    ['Check In', new Date(checkIn + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })],
                    ['Check Out', new Date(checkOut + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })],
                    ['Guests', `${guests} ${parseInt(guests) === 1 ? 'Guest' : 'Guests'}`],
                    ['Nights', `${nights} night${nights > 1 ? 's' : ''}`],
                    ['Name', `${form.firstName} ${form.lastName}`.trim()],
                    ['Email', form.email],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <p className="text-[9px] tracking-[0.16em] uppercase text-muted mb-0.5">{label}</p>
                      <p className="text-[13px] text-white truncate">{val}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/10 pt-4 flex justify-between items-end">
                  <div>
                    <p className="text-[9px] tracking-[0.16em] uppercase text-muted mb-0.5">Total (est.)</p>
                    <p className="text-[11px] text-white/40">{nights} nights × ₦{bookedRoom.pricePerNight.toLocaleString()}</p>
                  </div>
                  <p className="font-cormorant text-3xl text-white font-light"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    ₦{totalPrice.toLocaleString()}
                  </p>
                </div>
              </div>

              {submitError && (
                <div className="flex items-center gap-2 text-danger text-[12px]">
                  <AlertCircle size={13} /><span>{submitError}</span>
                </div>
              )}

              <p className="text-[12px] text-white/40 leading-relaxed">
                You will be redirected to our secure payment page. Your reservation is held for 30 minutes.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setStep('details')}
                  className="flex-1 py-3 border border-white/15 text-white/50 text-[11px] tracking-[0.14em] uppercase hover:border-white/30 transition-colors">
                  Back
                </button>
                <button onClick={handleSubmit} disabled={submitting}
                  className="flex-1 py-3 bg-gold text-white text-[11px] tracking-[0.2em] uppercase hover:bg-gold-light transition-colors disabled:opacity-70">
                  {submitting ? (loadingMessage || 'Processing…') : 'Confirm & Pay'}
                </button>
              </div>
            </div>
          )}

          {/* ── SUCCESS ──────────────────────────────────────────────────────── */}
          {step === 'success' && (
            <div className="text-center py-10 space-y-6">
              <div className="w-14 h-14 bg-gold flex items-center justify-center mx-auto">
                <Check size={26} className="text-white" />
              </div>
              <div>
                <h3 className="font-cormorant text-3xl text-white font-light mb-3"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Thank you, {form.firstName}
                </h3>
                <p className="text-[14px] text-white/55 leading-relaxed max-w-sm mx-auto">
                  Your request has been received. We'll contact you at{' '}
                  <span className="text-white/80">{form.email}</span> within the hour.
                </p>
              </div>
              {confirmedRef && (
                <div className="border border-white/10 p-5 text-left space-y-1.5 max-w-xs mx-auto">
                  <p className="text-[9px] tracking-[0.22em] uppercase text-gold">Reference Number</p>
                  <p className="font-cormorant text-2xl text-white font-light"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}>{confirmedRef}</p>
                  <p className="text-[11px] text-white/35">Keep this for your records</p>
                </div>
              )}
              <button onClick={reset}
                className="px-8 py-3 bg-gold text-white text-[11px] tracking-[0.2em] uppercase hover:bg-gold-light transition-colors">
                Close
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}