'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function RegisterPage() {
  const { user, loading, register } = useAuth()
  const router = useRouter()

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading && user) {
      router.replace('/account')
    }
  }, [loading, user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)
    const res = await register({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
      phone: form.phone || undefined,
    })
    setSubmitting(false)

    if (res.success) {
      router.replace('/account')
    } else {
      setError(res.error || 'Registration failed. Please try again.')
    }
  }

  if (loading || user) return null

  return (
    <div className="w-full max-w-sm">
      <div className="mb-10">
        <p
          className="text-[9px] tracking-[0.28em] uppercase text-gold mb-3 font-inter"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Create Account
        </p>
        <h1
          className="font-playfair text-[32px] font-light text-white leading-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Join Mina Hotels
        </h1>
        <div className="w-10 h-px bg-gold mt-4" />
        <p
          className="text-[13px] text-white/40 mt-3 leading-relaxed font-inter"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Create a free account to manage your bookings, order room service, and earn Mina Rewards points on every stay — automatically.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="flex items-start gap-2.5 p-3.5 bg-red-900/20 border border-red-500/25">
            <AlertCircle size={13} className="text-red-400 flex-shrink-0 mt-0.5" />
            <p
              className="text-[12px] text-red-300 leading-relaxed font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {error}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label
              className="text-[9px] tracking-[0.22em] uppercase text-white/40 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              First Name *
            </label>
            <input
              type="text"
              required
              placeholder="Emeka"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="contact-input"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              className="text-[9px] tracking-[0.22em] uppercase text-white/40 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Last Name *
            </label>
            <input
              type="text"
              required
              placeholder="Okafor"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="contact-input"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label
            className="text-[9px] tracking-[0.22em] uppercase text-white/40 font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Email Address *
          </label>
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
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
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="contact-input"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            className="text-[9px] tracking-[0.22em] uppercase text-white/40 font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Password *
          </label>
          <input
            type="password"
            required
            placeholder="Minimum 8 characters"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="contact-input"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            className="text-[9px] tracking-[0.22em] uppercase text-white/40 font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Confirm Password *
          </label>
          <input
            type="password"
            required
            placeholder="Repeat your password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            className="contact-input"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 bg-gold text-navy text-[11px] tracking-[0.22em] uppercase font-semibold hover:bg-gold-light transition-colors disabled:opacity-60 cursor-pointer font-inter mt-2"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {submitting ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-white/10 text-center">
        <p
          className="text-[12px] text-white/35 font-inter"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Already have an account?{' '}
          <Link href="/account/login" className="text-gold hover:text-gold-light transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
