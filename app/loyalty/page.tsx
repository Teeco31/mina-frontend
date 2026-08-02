'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import FadeIn from '@/components/FadeIn'
import { ArrowRight } from 'lucide-react'

const EARN_RATES = [
  { category: 'Standard Room',   pts: 100, redeem: 500  },
  { category: 'Deluxe Room',     pts: 150, redeem: 700  },
  { category: 'Royal Room',      pts: 175, redeem: 850  },
  { category: 'Executive Room',  pts: 200, redeem: 1000 },
  { category: 'Exclusive Suite', pts: 250, redeem: 1500 },
  { category: 'Luxury Suite',    pts: 300, redeem: 2500 },
]

function MemberCTA() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('mina_access_token'))
  }, [])

  if (isLoggedIn) {
    return (
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link
          href="/account/loyalty"
          className="inline-flex items-center gap-2 px-9 py-3.5 bg-gold text-navy text-[11px] tracking-[0.22em] uppercase font-semibold hover:bg-gold-light transition-colors no-underline font-inter"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          View My Rewards
          <ArrowRight size={13} strokeWidth={2} />
        </Link>
        <Link
          href="/account"
          className="text-[11px] tracking-[0.14em] uppercase text-white/50 hover:text-white transition-colors font-inter border-b border-white/20 pb-0.5"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          My Account
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <Link
        href="/account/register"
        className="inline-flex items-center gap-2 px-9 py-3.5 bg-gold text-navy text-[11px] tracking-[0.22em] uppercase font-semibold hover:bg-gold-light transition-colors no-underline font-inter"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        Create a Free Account
        <ArrowRight size={13} strokeWidth={2} />
      </Link>
      <Link
        href="/account/login"
        className="text-[11px] tracking-[0.14em] uppercase text-white/50 hover:text-white transition-colors font-inter border-b border-white/20 pb-0.5"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        Sign In
      </Link>
    </div>
  )
}

export default function LoyaltyPage() {
  return (
    <main>
      {/* Hero */}
      <section
        className="relative flex items-center justify-center text-center overflow-hidden"
        style={{ height: 'clamp(380px, 50vw, 560px)' }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1800&auto=format&fit=crop&q=85')" }}
        />
        <div className="absolute inset-0 bg-navy/72" />
        <div className="relative z-10 px-5 pt-20">
          <p
            className="text-[10px] tracking-[0.3em] uppercase text-gold mb-4 font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Rewards
          </p>
          <h1
            className="font-playfair text-white font-light leading-[1.05] mb-4"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(44px, 7vw, 88px)' }}
          >
            Mina <em className="italic text-gold">Rewards</em>
          </h1>
          <div className="w-16 h-0.5 bg-gold mx-auto mb-6" />
          <p
            className="text-[14px] sm:text-[15px] leading-[1.85] text-white/55 max-w-lg mx-auto font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Every night you stay earns reward points. Included with every Mina Hotels member account — no separate sign-up required.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="px-5 sm:px-8 md:px-12 lg:px-16 py-16 md:py-24 bg-warm-white">
        <FadeIn>
          <div className="text-center mb-14">
            <span
              className="block text-[10px] tracking-[0.28em] uppercase text-gold mb-4 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              How It Works
            </span>
            <h2
              className="font-playfair font-light text-navy"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(30px, 4vw, 52px)' }}
            >
              Simple, Honest, <em className="italic text-gold">Rewarding</em>
            </h2>
            <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
          {[
            { num: '100–300', unit: 'points', label: 'per night', desc: 'Earn between 100 and 300 reward points per night based on your room category — from Standard Room to Luxury Suite.' },
            { num: 'From 500', unit: 'points', label: 'to redeem', desc: 'Standard Room redemptions start at 500 points. Higher room categories offer greater value for bigger earners.' },
            { num: '6', unit: 'room types', label: 'to earn & redeem', desc: 'Every room category has its own earn rate and redemption threshold, from Standard Room to Luxury Suite.' },
          ].map(item => (
            <FadeIn key={item.num}>
              <div className="text-center p-8 border border-gray-100 bg-cream hover:shadow-lg transition-shadow duration-500">
                <p
                  className="font-playfair font-light text-navy leading-none mb-1"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px' }}
                >
                  {item.num}
                </p>
                <p
                  className="text-[11px] tracking-[0.14em] uppercase text-gold mb-1 font-inter"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {item.unit}
                </p>
                <p
                  className="text-[12px] text-gray-400 mb-4 font-inter"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {item.label}
                </p>
                <div className="w-8 h-px bg-gold/40 mx-auto mb-4" />
                <p
                  className="text-[13px] leading-[1.7] text-gray-500 font-inter"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {item.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Member Benefits */}
        <FadeIn>
          <div className="max-w-3xl mx-auto">
            <h3
              className="font-playfair text-[26px] font-light text-navy mb-6 text-center"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Member Benefits
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Earn Points Every Stay', desc: 'Earn 100–300 points per night based on your room category — credited automatically at checkout.' },
                { title: 'Free Night Redemption', desc: "Redeem from 500 points for a Standard Room to 2,500 points for a Luxury Suite. The free night's value reflects your accumulated stay rate." },
                { title: 'Late Check-out', desc: 'Members enjoy late check-out subject to availability — just ask at reception.' },
                { title: 'Express Check-out', desc: 'Skip the queue. Members can settle their bill and check out without waiting.' },
                { title: 'Quick Reservations', desc: 'Your preferences are saved. Future bookings are faster with your details on file.' },
                { title: 'No Blackout Dates', desc: 'Redeem your free nights anytime — pending room availability, nothing else.' },
              ].map(b => (
                <div key={b.title} className="flex gap-3 p-4 border border-gray-100 bg-white hover:border-l-4 hover:border-l-gold transition-all duration-300">
                  <div className="w-5 h-px bg-gold flex-shrink-0 mt-2.5" />
                  <div>
                    <p
                      className="text-[13px] font-semibold text-navy mb-0.5 font-inter"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {b.title}
                    </p>
                    <p
                      className="text-[12px] leading-[1.65] text-gray-500 font-inter"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {b.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Earn & Redemption Rates */}
      <section className="px-5 sm:px-8 md:px-12 lg:px-16 py-16 md:py-20 bg-cream">
        <FadeIn>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <span
                className="block text-[10px] tracking-[0.28em] uppercase text-gold mb-4 font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Points Structure
              </span>
              <h2
                className="font-playfair font-light text-navy"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(26px, 3.5vw, 42px)' }}
              >
                Earn Rates &amp; <em className="italic text-gold">Redemption</em>
              </h2>
              <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-[13px] font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                <thead>
                  <tr className="bg-navy">
                    <th className="px-5 py-3.5 text-left text-[9px] tracking-[0.22em] uppercase text-white/60 font-semibold">
                      Room Category
                    </th>
                    <th className="px-5 py-3.5 text-center text-[9px] tracking-[0.22em] uppercase text-white/60 font-semibold">
                      Earn per Night
                    </th>
                    <th className="px-5 py-3.5 text-center text-[9px] tracking-[0.22em] uppercase text-white/60 font-semibold">
                      Redeem a Free Night
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {EARN_RATES.map((row, i) => (
                    <tr key={row.category} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}>
                      <td className="px-5 py-3.5 text-navy font-medium border-b border-gray-100">
                        {row.category}
                      </td>
                      <td className="px-5 py-3.5 text-center border-b border-gray-100">
                        <span className="font-semibold text-gold">{row.pts.toLocaleString()}</span>
                        <span className="text-gray-400 ml-1">pts</span>
                      </td>
                      <td className="px-5 py-3.5 text-center border-b border-gray-100">
                        <span className="font-semibold text-navy">{row.redeem.toLocaleString()}</span>
                        <span className="text-gray-400 ml-1">pts</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p
              className="text-[11px] text-gray-400 mt-4 text-center font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Points are credited after checkout. Redemption subject to availability.{' '}
              <Link href="/loyalty/terms" className="text-gold hover:text-gold-light transition-colors underline underline-offset-2">
                Full Terms &amp; Conditions
              </Link>
            </p>
          </div>
        </FadeIn>
      </section>

      {/* Member CTA */}
      <section className="px-5 sm:px-8 md:px-12 lg:px-16 py-16 md:py-24 bg-navy">
        <FadeIn>
          <div className="max-w-2xl mx-auto text-center">
            <span
              className="block text-[10px] tracking-[0.28em] uppercase text-gold mb-5 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Mina Rewards
            </span>
            <h2
              className="font-playfair font-light text-white mb-4"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(30px, 4vw, 52px)' }}
            >
              Rewards on Every <em className="italic text-gold">Stay</em>
            </h2>
            <div className="w-16 h-0.5 bg-gold mx-auto mb-7" />
            <p
              className="text-[14px] sm:text-[15px] leading-[1.85] text-white/55 mb-10 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Mina Rewards is included with every Mina Hotels member account — no separate enrolment required.
              Create a free account and your points start accumulating from your very first night.
            </p>

            <MemberCTA />

            <p
              className="text-[11px] text-white/25 mt-8 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Already a member? Your rewards are active.{' '}
              <Link href="/account/loyalty" className="text-white/45 hover:text-gold transition-colors">
                View your balance →
              </Link>
            </p>
          </div>
        </FadeIn>
      </section>

      {/* Ready to Redeem */}
      <section className="px-5 sm:px-8 md:px-12 lg:px-16 py-16 md:py-20 bg-cream">
        <FadeIn>
          <div className="max-w-2xl mx-auto text-center">
            <h2
              className="font-playfair font-light text-navy mb-4"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 46px)' }}
            >
              Ready to Redeem?
            </h2>
            <div className="w-16 h-0.5 bg-gold mx-auto mb-6" />
            <p
              className="text-[14px] sm:text-[15px] leading-[1.85] text-gray-600 mb-8 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Once you have enough points for your chosen room category — from 500 for a Standard Room — call or email us to book your free night.
              Quote your Rewards number and we'll take care of the rest.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+2349015525389"
                className="inline-block px-9 py-3.5 bg-gold text-navy text-[11px] tracking-[0.22em] uppercase font-semibold hover:bg-gold-light transition-colors no-underline font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Call to Redeem
              </a>
              <a
                href="mailto:info@mina-hotels.com?subject=Mina Rewards Redemption"
                className="inline-block px-9 py-3.5 border border-gold text-gold text-[11px] tracking-[0.22em] uppercase font-semibold hover:bg-gold hover:text-navy transition-all no-underline font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Email to Redeem
              </a>
            </div>
            <p
              className="text-[12px] text-gray-400 mt-6 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Terms &amp; Conditions apply.{' '}
              <Link
                href="/loyalty/terms"
                className="text-gold hover:text-gold-light transition-colors underline underline-offset-2"
              >
                Read the programme rules
              </Link>
            </p>
          </div>
        </FadeIn>
      </section>
    </main>
  )
}
