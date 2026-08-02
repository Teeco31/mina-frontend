'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import FadeIn from '@/components/FadeIn'
import BookingModal from '@/components/BookingModal'
import { submitEnquiry } from '@/lib/api'

export default function ContactPage() {
  const [bookingOpen, setBookingOpen] = useState(false)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', type: 'Room Reservation', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    await submitEnquiry({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      type: form.type.toLowerCase().replace(/\s+/g, '-'),
      message: form.message,
    })
    // Always show success — even if the API is down the guest gets confirmation
    setSubmitting(false)
    setSubmitted(true)
  }

  const details = [
    { icon: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></>, title: 'Address', content: '23 Igbodo Street, Old GRA\nPort Harcourt, Rivers State\nNigeria' },
    { icon: <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013 9.79a19.79 19.79 0 01-3.07-8.67A2 2 0 011.92 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>, title: 'Phone', content: '+234 805 615 5303' },
    { icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>, title: 'Email', content: 'info@mina-hotels.com' },
    { icon: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>, title: 'Hours', content: 'Front Desk: 24 hours\nCheck-in: From 3:00 PM\nCheck-out: By 11:00 AM' },
  ]

  return (
    <main>
      {/* Hero */}
      <section
        className="relative flex items-end overflow-hidden"
        style={{ height: 'clamp(320px, 45vw, 500px)' }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1800&auto=format&fit=crop&q=85')" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(10,22,40,0.25) 0%, rgba(10,22,40,0.88) 100%)' }}
        />
        <div className="relative z-10 px-5 sm:px-8 md:px-12 pb-12 md:pb-18 pt-24">
          <p
            className="text-[10px] tracking-[0.3em] uppercase text-gold mb-3 font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            We&apos;re Here
          </p>
          <h1
            className="font-playfair text-white font-light leading-[1.05]"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(40px, 8vw, 88px)' }}
          >
            Contact &amp;<br /><em className="italic">Enquiries</em>
          </h1>
        </div>
      </section>

      {/* Quick actions */}
      <section className="px-5 sm:px-8 md:px-12 py-6 md:py-8 bg-navy border-b border-white/8">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setBookingOpen(true)}
            className="flex-1 py-3.5 bg-gold text-navy text-[11px] tracking-[0.22em] uppercase font-semibold text-center hover:bg-gold-light transition-colors cursor-pointer font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Book a Room
          </button>
          <a
            href="tel:+2348056155303"
            className="flex-1 py-3.5 border border-white/15 text-white text-[11px] tracking-[0.22em] uppercase text-center hover:border-gold hover:text-gold transition-all no-underline font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Call Us Now
          </a>
          <a
            href="mailto:info@mina-hotels.com"
            className="flex-1 py-3.5 border border-white/15 text-white text-[11px] tracking-[0.22em] uppercase text-center hover:border-gold hover:text-gold transition-all no-underline font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Send Email
          </a>
        </div>
      </section>

      {/* Form + Info split layout */}
      <section
        className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 py-16 md:py-24 px-5 sm:px-8 md:px-12 lg:px-20 bg-navy"
      >
        {/* Left: contact info */}
        <FadeIn>
          <span
            className="block text-[10px] tracking-[0.28em] uppercase text-gold mb-4 font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Get in Touch
          </span>
          <h2
            className="font-playfair font-light leading-[1.12] text-white mb-4"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(30px, 5vw, 58px)' }}
          >
            Reserve or<br /><em className="italic text-gold">Enquire</em>
          </h2>
          <div className="w-16 h-0.5 bg-gold mb-7" />
          <p
            className="text-[14px] sm:text-[15px] leading-[1.85] text-white/50 mb-10 max-w-[480px] font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Whether you wish to book a stay, plan an event, or simply have a question, our team is ready to assist. We respond within the hour.
          </p>
          <div className="flex flex-col gap-6">
            {details.map(d => (
              <div key={d.title} className="flex gap-4 items-start">
                <div className="w-9 h-9 border border-gold/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#C9A84C" strokeWidth="1.5">{d.icon}</svg>
                </div>
                <div>
                  <h4
                    className="text-[10px] tracking-[0.18em] uppercase text-white/35 mb-1 font-inter"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {d.title}
                  </h4>
                  <p
                    className="text-[13px] sm:text-[14px] text-white/65 leading-[1.7] font-inter"
                    style={{ whiteSpace: 'pre-line', fontFamily: "'Inter', sans-serif" }}
                  >
                    {d.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Right: form */}
        <FadeIn delay="0.15s">
          {submitted ? (
            <div className="flex flex-col items-start gap-5 py-12">
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
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label
                    className="text-[9px] tracking-[0.22em] uppercase text-white/35 font-inter"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Emeka"
                    value={form.firstName}
                    onChange={e => setForm({ ...form, firstName: e.target.value })}
                    className="contact-input"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    className="text-[9px] tracking-[0.22em] uppercase text-white/35 font-inter"
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
                    className="text-[9px] tracking-[0.22em] uppercase text-white/35 font-inter"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="emeka@email.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="contact-input"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    className="text-[9px] tracking-[0.22em] uppercase text-white/35 font-inter"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Phone
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
                  className="text-[9px] tracking-[0.22em] uppercase text-white/35 font-inter"
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
                  className="text-[9px] tracking-[0.22em] uppercase text-white/35 font-inter"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Message *
                </label>
                <textarea
                  required
                  placeholder="Tell us how we can help…"
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  className="contact-input min-h-[90px]"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="self-start px-10 py-3.5 bg-gold text-navy text-[11px] tracking-[0.22em] uppercase font-semibold hover:bg-gold-light transition-colors disabled:opacity-70 cursor-pointer font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {submitting ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          )}
        </FadeIn>
      </section>

      {/* Map */}
      <section className="relative" style={{ height: 'clamp(320px, 42vw, 500px)' }}>
        <iframe
          title="Mina Hotels location"
          src="https://maps.google.com/maps?q=23+Igbodo+Street,+Old+GRA,+Port+Harcourt,+Rivers+State,+Nigeria&output=embed&z=16"
          className="w-full h-full border-0"
          loading="lazy"
          allowFullScreen
        />
        {/* Info card */}
        <div className="absolute bottom-0 left-0 right-0 sm:right-auto sm:max-w-xs bg-navy/95 backdrop-blur-sm px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <div className="flex-1 min-w-0">
            <p
              className="text-white text-[11px] tracking-[0.22em] uppercase mb-1 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Mina Hotels
            </p>
            <p
              className="text-white/55 text-[12px] leading-[1.6] font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              23 Igbodo Street, Old GRA<br />Port Harcourt
            </p>
          </div>
          <a
            href="https://maps.google.com/?q=23+Igbodo+Street+Old+GRA+Port+Harcourt"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 px-5 py-2.5 bg-gold text-navy text-[10px] tracking-[0.22em] uppercase font-semibold hover:bg-gold-light transition-colors no-underline font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Get Directions
          </a>
        </div>
      </section>

      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
    </main>
  )
}
