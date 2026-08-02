'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

function LoginForm() {
  const { user, loading, login } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/account'

  const [form, setForm] = useState({ email: '', password: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading && user) {
      router.replace(redirect)
    }
  }, [loading, user, router, redirect])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const res = await login(form.email, form.password)
    setSubmitting(false)
    if (res.success) {
      router.replace(redirect)
    } else {
      setError(res.error || 'Invalid email or password.')
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
          Guest Sign In
        </p>
        <h1
          className="font-playfair text-[32px] font-light text-white leading-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Welcome back
        </h1>
        <div className="w-10 h-px bg-gold mt-4" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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

        <div className="space-y-5">
          <div className="flex flex-col gap-2">
            <label
              className="text-[9px] tracking-[0.22em] uppercase text-white/40 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Email Address
            </label>
            <input
              type="email"
              required
              autoComplete="email"
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
              Password
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="contact-input"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 bg-gold text-navy text-[11px] tracking-[0.22em] uppercase font-semibold hover:bg-gold-light transition-colors disabled:opacity-60 cursor-pointer font-inter"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {submitting ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-white/10 text-center space-y-3">
        <p
          className="text-[12px] text-white/35 font-inter"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          New to Mina Hotels?{' '}
          <Link
            href="/account/register"
            className="text-gold hover:text-gold-light transition-colors"
          >
            Create an account
          </Link>
        </p>
        <p
          className="text-[12px] text-white/35 font-inter"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <Link href="/" className="text-white/40 hover:text-white/70 transition-colors">
            ← Return to hotel
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}
