'use client'
import { useState } from 'react'
import { Check } from 'lucide-react'
import FadeIn from './FadeIn'
import { submitEnquiry } from '@/lib/api'

export default function HomeContactForm() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', type: 'Room Reservation', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!form.firstName || !form.email || !form.message) return
    setSubmitting(true)
    await submitEnquiry({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      type: form.type.toLowerCase().replace(/\s+/g, '-'),
      message: form.message,
    })
    // Always show success — whether API worked or not
    setSubmitting(false)
    setSubmitted(true)
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
      <div className="flex flex-col gap-5">
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
            placeholder="Tell us how we can help…"
            value={form.message}
            onChange={e => setForm({ ...form, message: e.target.value })}
            className="contact-input min-h-[80px]"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={submitting || !form.firstName || !form.email || !form.message}
          className="self-start px-10 py-3.5 bg-gold text-navy text-[11px] tracking-[0.22em] uppercase font-semibold hover:bg-gold-light transition-colors disabled:opacity-50 cursor-pointer font-inter"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {submitting ? 'Sending…' : 'Send Message'}
        </button>
      </div>
    </FadeIn>
  )
}
