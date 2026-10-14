'use client'
import { useState } from 'react'
import { Check } from 'lucide-react'
import FadeIn from './FadeIn'
import { submitEnquiry } from '@/lib/api'

export default function HomeContactForm() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', type: 'Room Reservation', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.firstName.trim() || !form.email.trim() || !form.message.trim()) return
    setSubmitting(true)
    setError('')
    const result = await submitEnquiry({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      type: form.type.toLowerCase().replace(/\s+/g, '-'),
      message: form.message.trim(),
    })
    setSubmitting(false)
    if (result.success) {
      setSubmitted(true)
    } else {
      setError('We could not send your message. Please try again, or call us on +234 901 552 5389.')
    }
  }

  if (submitted) {
    return (
      <FadeIn>
        <div className="flex flex-col items-start gap-5 py-8">
          <div className="w-12 h-12 bg-gold flex items-center justify-center shadow-lg">
            <Check size={22} className="text-navy" />
          </div>
          <div>
            <h3
              className="font-playfair text-2xl text-white font-light mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Message Received
            </h3>
            <p
              className="text-[14px] text-white/55 leading-relaxed font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Thank you, {form.firstName}. Our team will respond within the hour.
            </p>
          </div>
          <button
            onClick={() => { setSubmitted(false); setForm({ firstName: '', lastName: '', email: '', phone: '', type: 'Room Reservation', message: '' }) }}
            className="text-[11px] tracking-[0.18em] uppercase text-gold border-b border-gold/40 pb-0.5 hover:border-gold transition-colors cursor-pointer font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Send Another
          </button>
        </div>
      </FadeIn>
    )
  }

  return (
    <FadeIn delay="0.15s">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label
              className="text-[9px] tracking-[0.22em] uppercase text-white/40 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              First Name
            </label>
            <input
              type="text"
              name="given-name"
              autoComplete="given-name"
              required
              placeholder="Emeka"
              value={form.firstName}
              onChange={e => setForm({ ...form, firstName: e.target.value })}
              className="contact-input"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              className="text-[9px] tracking-[0.22em] uppercase text-white/40 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Last Name
            </label>
            <input
              type="text"
              name="family-name"
              autoComplete="family-name"
              placeholder="Okafor"
              value={form.lastName}
              onChange={e => setForm({ ...form, lastName: e.target.value })}
              className="contact-input"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label
              className="text-[9px] tracking-[0.22em] uppercase text-white/40 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              placeholder="emeka@email.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="contact-input"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              className="text-[9px] tracking-[0.22em] uppercase text-white/40 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Phone Number
            </label>
            <input
              type="tel"
              name="tel"
              autoComplete="tel"
              placeholder="+234 801 234 5678"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              className="contact-input"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="text-[9px] tracking-[0.22em] uppercase text-white/40 font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Enquiry Type
          </label>
          <select
            value={form.type}
            onChange={e => setForm({ ...form, type: e.target.value })}
            className="contact-input"
          >
            <option>Room Reservation</option>
            <option>Event Planning</option>
            <option>Corporate Stay</option>
            <option>General Enquiry</option>
            <option>Loyalty Programme</option>
            <option>Dining Reservation</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="text-[9px] tracking-[0.22em] uppercase text-white/40 font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Message
          </label>
          <textarea
            required
            maxLength={2000}
            name="message"
            autoComplete="off"
            placeholder="Tell us how we can help…"
            value={form.message}
            onChange={e => setForm({ ...form, message: e.target.value })}
            className="contact-input min-h-[80px]"
          />
        </div>
        {error && (
          <p role="alert" className="text-[13px] text-red-400 font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={submitting || !form.firstName || !form.email || !form.message}
          className="self-start px-10 py-3.5 bg-gold text-navy text-[11px] tracking-[0.22em] uppercase font-semibold hover:bg-gold-light transition-colors disabled:opacity-50 cursor-pointer font-inter"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {submitting ? 'Sending…' : 'Send Message'}
        </button>
      </form>
    </FadeIn>
  )
}
