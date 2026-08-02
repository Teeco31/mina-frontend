'use client'

import { useEffect, useState } from 'react'
import FadeIn from '@/components/FadeIn'
import { Check, Star } from 'lucide-react'

interface Review {
  _id: string
  guestName: string
  overallRating: number
  title?: string
  body: string
  roomCategory?: string
  managementResponse?: { body: string }
  createdAt: string
}

const CATEGORY_LABELS: Record<string, string> = {
  standard: 'Standard Room', deluxe: 'Deluxe Room', royal: 'Royal Room',
  executive: 'Executive Room', 'exclusive-suite': 'Exclusive Suite', 'luxury-suite': 'Luxury Suite',
}

function Stars({ rating, interactive = false, onRate }: { rating: number; interactive?: boolean; onRate?: (n: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          disabled={!interactive}
          onClick={() => onRate?.(n)}
          className={`text-[20px] transition-colors ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} ${n <= rating ? 'text-gold' : 'text-gray-200'}`}
        >
          ★
        </button>
      ))}
    </div>
  )
}

const emptyForm = {
  guestName: '', guestEmail: '', overallRating: 0,
  title: '', body: '', bookingReference: '',
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

  useEffect(() => {
    fetch(`${API}/reviews?status=approved&limit=20`)
      .then(r => r.json())
      .then(d => { setReviews(d.data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')
    if (!form.guestName || !form.guestEmail || !form.overallRating || !form.body) {
      setSubmitError('Please fill in your name, email, rating, and review.')
      return
    }
    setSubmitting(true)
    try {
      // Don't send empty bookingReference — send undefined instead
      const payload = {
        guestName: form.guestName,
        guestEmail: form.guestEmail,
        overallRating: form.overallRating,
        title: form.title || undefined,
        body: form.body,
        ...(form.bookingReference.trim() ? { bookingReference: form.bookingReference.trim() } : {}),
      }
      const res = await fetch(`${API}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (json.success) {
        setSubmitted(true)
        setForm(emptyForm)
        setShowForm(false)
      } else {
        setSubmitError(json.message || 'Could not submit review. Please try again.')
      }
    } catch {
      setSubmitError('Network error. Please try again.')
    }
    setSubmitting(false)
  }

  const avg = reviews.length ? (reviews.reduce((a, r) => a + r.overallRating, 0) / reviews.length).toFixed(1) : null

  return (
    <main>
      {/* Hero */}
      <section
        className="relative flex items-end overflow-hidden"
        style={{ height: 'clamp(300px, 40vw, 460px)' }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1800&auto=format&fit=crop&q=85')" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(10,22,40,0.25) 0%, rgba(10,22,40,0.85) 100%)' }}
        />
        <div className="relative z-10 px-5 sm:px-8 md:px-12 pb-12 md:pb-18 pt-24">
          <p
            className="text-[10px] tracking-[0.3em] uppercase text-gold mb-3 font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Guest Experiences
          </p>
          <h1
            className="font-playfair text-white font-light leading-[1.05]"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(40px, 8vw, 88px)' }}
          >
            <em className="italic">Reviews</em>
          </h1>
        </div>
      </section>

      {/* Summary bar */}
      {avg && (
        <section className="px-5 sm:px-8 md:px-12 lg:px-16 py-8 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-10 border-b border-gray-100 bg-warm-white">
          <div className="flex items-center gap-4">
            <p
              className="font-playfair text-[56px] font-light text-navy leading-none"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {avg}
            </p>
            <div>
              <Stars rating={Math.round(parseFloat(avg))} />
              <p
                className="text-[12px] text-gray-400 mt-1 font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {reviews.length} verified review{reviews.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="sm:ml-auto">
            {submitted ? (
              <div className="flex items-center gap-2.5 text-[13px] text-green-600">
                <Check size={16} />
                <span className="font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Thank you — your review is pending approval.
                </span>
              </div>
            ) : (
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-8 py-3.5 bg-gold text-navy text-[11px] tracking-[0.22em] uppercase font-semibold hover:bg-gold-light transition-colors cursor-pointer font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {showForm ? 'Cancel' : 'Write a Review'}
              </button>
            )}
          </div>
        </section>
      )}

      {/* Review form */}
      {showForm && (
        <section className="px-5 sm:px-8 md:px-12 lg:px-16 py-12 bg-cream">
          <FadeIn>
            <div className="max-w-2xl">
              <h2
                className="font-playfair text-[28px] font-light text-navy mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Share Your Experience
              </h2>
              <div className="w-16 h-0.5 bg-gold mb-7" />

              {submitError && (
                <p
                  className="text-[12px] text-red-600 bg-red-50 border border-red-200 px-4 py-2.5 mb-5 font-inter"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {submitError}
                </p>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label
                      className="text-[9px] tracking-[0.22em] uppercase text-gray-400 font-inter"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Your Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Emeka Okafor"
                      value={form.guestName}
                      onChange={e => setForm({ ...form, guestName: e.target.value })}
                      className="contact-input-light"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      className="text-[9px] tracking-[0.22em] uppercase text-gray-400 font-inter"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="emeka@email.com"
                      value={form.guestEmail}
                      onChange={e => setForm({ ...form, guestEmail: e.target.value })}
                      className="contact-input-light"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    className="text-[9px] tracking-[0.22em] uppercase text-gray-400 font-inter"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Booking Reference (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="MH-XXXXXXXX"
                    value={form.bookingReference}
                    onChange={e => setForm({ ...form, bookingReference: e.target.value })}
                    className="contact-input-light"
                  />
                  <p
                    className="text-[11px] text-gray-400 font-inter"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    If you have a reference number, your review will be verified automatically.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    className="text-[9px] tracking-[0.22em] uppercase text-gray-400 font-inter"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Overall Rating *
                  </label>
                  <Stars rating={form.overallRating} interactive onRate={n => setForm({ ...form, overallRating: n })} />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    className="text-[9px] tracking-[0.22em] uppercase text-gray-400 font-inter"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Review Title
                  </label>
                  <input
                    type="text"
                    placeholder="Summarise your stay in a few words"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="contact-input-light"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    className="text-[9px] tracking-[0.22em] uppercase text-gray-400 font-inter"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Your Review *
                  </label>
                  <textarea
                    placeholder="Tell other guests about your experience at Mina Hotels…"
                    value={form.body}
                    onChange={e => setForm({ ...form, body: e.target.value })}
                    className="contact-input-light min-h-[120px]"
                  />
                </div>
                <div className="flex gap-4 items-center flex-wrap">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-10 py-3.5 bg-gold text-navy text-[11px] tracking-[0.22em] uppercase font-semibold hover:bg-gold-light transition-colors disabled:opacity-70 cursor-pointer font-inter"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {submitting ? 'Submitting…' : 'Submit Review'}
                  </button>
                  <p
                    className="text-[11px] text-gray-400 font-inter"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Reviews are published after a brief moderation check.
                  </p>
                </div>
              </form>
            </div>
          </FadeIn>
        </section>
      )}

      {/* No-average state */}
      {!avg && !loading && (
        <section className="px-5 sm:px-8 md:px-12 lg:px-16 py-8 border-b border-gray-100 flex items-center justify-between bg-warm-white">
          <p
            className="text-[13px] text-gray-400 font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            No reviews yet. Be the first to share your experience.
          </p>
          {!submitted ? (
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-8 py-3 bg-gold text-navy text-[11px] tracking-[0.22em] uppercase font-semibold hover:bg-gold-light transition-colors cursor-pointer font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Write a Review
            </button>
          ) : (
            <div className="flex items-center gap-2 text-[13px] text-green-600">
              <Check size={16} />
              <span className="font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                Thank you — pending approval.
              </span>
            </div>
          )}
        </section>
      )}

      {/* Reviews list */}
      <section className="px-5 sm:px-8 md:px-12 lg:px-16 py-16 md:py-20 bg-warm-white">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-7 border-t-2 border-gray-100 bg-cream">
                <div className="h-3 w-20 bg-gray-200 mb-4 animate-pulse" />
                <div className="h-4 w-full bg-gray-200 mb-2 animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-200 animate-pulse" />
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <p
            className="text-[13px] text-gray-400 text-center py-12 font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            No approved reviews yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map(r => (
              <FadeIn key={r._id}>
                <div className="relative p-7 sm:p-8 border-t-2 border-gold h-full flex flex-col bg-cream shadow-sm hover:shadow-lg transition-shadow duration-500">
                  {/* Gold quotation */}
                  <span
                    className="absolute top-5 right-7 text-[56px] leading-none text-gold/15 font-playfair select-none"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    &rdquo;
                  </span>

                  <Stars rating={r.overallRating} />

                  {r.title && (
                    <p
                      className="font-playfair text-[19px] text-navy font-light mt-3 mb-2"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {r.title}
                    </p>
                  )}

                  <p
                    className="font-playfair text-[16px] sm:text-[17px] italic font-light leading-[1.7] text-navy flex-1 mt-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    &ldquo;{r.body}&rdquo;
                  </p>

                  <div className="mt-5 pt-4 border-t border-gray-200">
                    <p
                      className="text-[12px] font-semibold text-navy font-inter"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {r.guestName}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      {r.roomCategory && (
                        <p
                          className="text-[11px] text-gray-400 font-inter"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          {CATEGORY_LABELS[r.roomCategory] || r.roomCategory}
                        </p>
                      )}
                      <p
                        className="text-[11px] text-gray-400 font-inter"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {new Date(r.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  {r.managementResponse && (
                    <div className="mt-4 p-3.5 bg-white border border-gray-100">
                      <p
                        className="text-[10px] tracking-[0.14em] uppercase text-gold mb-1.5 font-inter"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        Response from Mina Hotels
                      </p>
                      <p
                        className="text-[12px] leading-[1.65] text-gray-500 font-inter"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {r.managementResponse.body}
                      </p>
                    </div>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
