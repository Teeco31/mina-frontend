'use client'

import { useEffect, useState } from 'react'
import { AlertCircle } from 'lucide-react'
import {
  createTableReservation, getMemberReservations, cancelTableReservation,
  formatDateShort, type TableReservation,
} from '@/lib/memberApi'

const OCCASION_LABELS: Record<string, string> = {
  none: 'No occasion',
  birthday: 'Birthday',
  anniversary: 'Anniversary',
  business: 'Business',
  other: 'Other',
}

const STATUS_LABEL: Record<string, string> = {
  pending: 'Pending confirmation',
  confirmed: 'Confirmed',
  seated: 'Seated',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

function statusColor(status: string): string {
  if (status === 'confirmed' || status === 'seated') return 'text-gold'
  if (status === 'completed') return 'text-gray-500'
  if (status === 'cancelled') return 'text-red-400'
  return 'text-gray-400'
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<TableReservation[]>([])
  const [loading, setLoading] = useState(true)

  const [form, setForm] = useState({
    date: '',
    time: '',
    partySize: '2',
    occasion: 'none',
    specialRequests: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState(false)

  useEffect(() => {
    getMemberReservations().then(({ reservations: r }) => {
      setReservations(r)
      setLoading(false)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')

    if (!form.date || !form.time) {
      setFormError('Please select a date and time.')
      return
    }

    const reservationDate = new Date(form.date)
    if (reservationDate < new Date()) {
      setFormError('Reservation date must be in the future.')
      return
    }

    setSubmitting(true)
    const { reservation, error } = await createTableReservation({
      date: form.date,
      time: form.time,
      partySize: parseInt(form.partySize, 10),
      occasion: form.occasion,
      specialRequests: form.specialRequests || undefined,
    })
    setSubmitting(false)

    if (error || !reservation) {
      setFormError(error || 'Could not submit reservation. Please try again.')
      return
    }

    setReservations((prev) => [reservation, ...prev])
    setFormSuccess(true)
    setForm({ date: '', time: '', partySize: '2', occasion: 'none', specialRequests: '' })
    setTimeout(() => setFormSuccess(false), 4000)
  }

  const handleCancel = async (reference: string) => {
    if (!confirm('Cancel this reservation?')) return
    await cancelTableReservation(reference)
    setReservations((prev) =>
      prev.map((r) => (r.reference === reference ? { ...r, status: 'cancelled' as const } : r))
    )
  }

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  return (
    <div className="px-5 sm:px-8 md:px-10 py-10 max-w-2xl">
      <div className="mb-8">
        <p
          className="text-[9px] tracking-[0.26em] uppercase text-gray-400 mb-2 font-inter"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Restaurant
        </p>
        <h1
          className="font-playfair text-[28px] font-light text-navy"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Reservations
        </h1>
        <div className="w-10 h-px bg-gold mt-3" />
      </div>

      {/* Booking form */}
      <div className="border border-gray-100 bg-white p-6 mb-10">
        <p
          className="font-playfair text-[17px] font-light text-navy mb-5"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Book a Table
        </p>

        {formSuccess && (
          <div className="mb-4 p-3 border border-green-200 bg-green-50">
            <p
              className="text-[12px] text-green-700 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Reservation submitted. We'll confirm your booking shortly.
            </p>
          </div>
        )}

        {formError && (
          <div className="flex items-start gap-2.5 mb-4 p-3 bg-red-50 border border-red-200">
            <AlertCircle size={13} className="text-red-400 flex-shrink-0 mt-0.5" />
            <p
              className="text-[12px] text-red-600 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {formError}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label
                className="text-[9px] tracking-[0.2em] uppercase text-gray-400 font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Date *
              </label>
              <input
                type="date"
                required
                min={minDate}
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="contact-input-light"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                className="text-[9px] tracking-[0.2em] uppercase text-gray-400 font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Time *
              </label>
              <select
                required
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="contact-input-light"
              >
                <option value="">Select a time</option>
                {['07:00','07:30','08:00','08:30','09:00','09:30','10:00','10:30',
                  '12:00','12:30','13:00','13:30','14:00','14:30',
                  '18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30'].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label
                className="text-[9px] tracking-[0.2em] uppercase text-gray-400 font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Party Size *
              </label>
              <select
                required
                value={form.partySize}
                onChange={(e) => setForm({ ...form, partySize: e.target.value })}
                className="contact-input-light"
              >
                {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'guest' : 'guests'}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label
                className="text-[9px] tracking-[0.2em] uppercase text-gray-400 font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Occasion
              </label>
              <select
                value={form.occasion}
                onChange={(e) => setForm({ ...form, occasion: e.target.value })}
                className="contact-input-light"
              >
                {Object.entries(OCCASION_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              className="text-[9px] tracking-[0.2em] uppercase text-gray-400 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Special Requests
            </label>
            <textarea
              rows={3}
              placeholder="Dietary requirements, seating preferences, decorations…"
              value={form.specialRequests}
              onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
              className="contact-input-light resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-gold text-navy text-[11px] tracking-[0.22em] uppercase font-semibold hover:bg-gold-light transition-colors disabled:opacity-60 cursor-pointer font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {submitting ? 'Submitting…' : 'Request Reservation'}
          </button>
        </form>
      </div>

      {/* Existing reservations */}
      <div>
        <p
          className="text-[9px] tracking-[0.22em] uppercase text-gray-400 mb-4 font-inter"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Your Reservations
        </p>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-14 bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : reservations.length === 0 ? (
          <p
            className="text-[13px] text-gray-400 font-inter py-2"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            No reservations yet.
          </p>
        ) : (
          <div className="divide-y divide-gray-100">
            {reservations.map((r) => (
              <div key={r.reference} className="py-3.5 flex items-start justify-between gap-4">
                <div>
                  <p
                    className="text-[13px] text-navy font-inter"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {formatDateShort(r.date)} at {r.time}
                  </p>
                  <p
                    className="text-[11px] text-gray-400 mt-0.5 font-inter"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {r.partySize} guest{r.partySize !== 1 ? 's' : ''}
                    {r.occasion !== 'none' ? ` · ${OCCASION_LABELS[r.occasion]}` : ''}
                    {' · '}
                    <span className="font-mono text-gray-300">{r.reference}</span>
                  </p>
                  {r.specialRequests && (
                    <p
                      className="text-[11px] text-gray-400 italic mt-0.5 font-inter"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {r.specialRequests}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span
                    className={`text-[11px] font-inter ${statusColor(r.status)}`}
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {STATUS_LABEL[r.status]}
                  </span>
                  {!['completed', 'cancelled'].includes(r.status) && (
                    <button
                      onClick={() => handleCancel(r.reference)}
                      className="text-[10px] text-gray-300 hover:text-red-400 transition-colors font-inter"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
