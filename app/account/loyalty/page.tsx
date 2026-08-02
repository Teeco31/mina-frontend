'use client'

import { useEffect, useState } from 'react'
import { getMemberLoyalty, type LoyaltyData } from '@/lib/memberApi'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

const REDEMPTION_TIERS = [
  { label: 'Standard Room',   pts: 500 },
  { label: 'Deluxe Room',     pts: 700 },
  { label: 'Royal Room',      pts: 850 },
  { label: 'Executive Room',  pts: 1000 },
  { label: 'Exclusive Suite', pts: 1500 },
  { label: 'Luxury Suite',    pts: 2500 },
]

export default function LoyaltyPage() {
  const { user } = useAuth()
  const [loyalty, setLoyalty] = useState<LoyaltyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getMemberLoyalty().then(({ loyalty: l, error: e }) => {
      if (e) setError(e)
      setLoyalty(l)
      setLoading(false)
    })
  }, [])

  // Progress toward next Standard Room redemption (500 pts per cycle)
  const pointsInCycle = loyalty ? 500 - loyalty.pointsToNextFreeNight : 0
  const progressPct = loyalty ? Math.min(100, (pointsInCycle / 500) * 100) : 0

  // Next redeemable tier
  const nextTier = loyalty
    ? REDEMPTION_TIERS.find(t => t.pts > loyalty.loyaltyPoints) ?? null
    : null

  return (
    <div className="px-5 sm:px-8 md:px-10 py-10 max-w-2xl">
      <div className="mb-8">
        <p
          className="text-[9px] tracking-[0.26em] uppercase text-gray-400 mb-2 font-inter"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Programme
        </p>
        <h1
          className="font-playfair text-[28px] font-light text-navy"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Mina Rewards
        </h1>
        <div className="w-10 h-px bg-gold mt-3" />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <p
          className="text-[13px] text-red-500 font-inter"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {error}
        </p>
      ) : loyalty ? (
        <div className="space-y-6">
          {/* Member card */}
          <div className="border border-gray-100 bg-white p-6 space-y-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p
                  className="text-[9px] tracking-[0.18em] uppercase text-gray-400 mb-0.5 font-inter"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Member
                </p>
                <p
                  className="font-playfair text-[20px] font-light text-navy"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {user?.firstName} {user?.lastName}
                </p>
                {loyalty.rewardsNumber && (
                  <p
                    className="text-[11px] text-gray-400 font-mono mt-0.5 font-inter"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {loyalty.rewardsNumber}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p
                  className="text-[9px] tracking-[0.18em] uppercase text-gray-400 mb-0.5 font-inter"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Total Nights
                </p>
                <p
                  className="font-playfair text-[40px] font-light text-navy leading-none"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {loyalty.totalNights}
                </p>
              </div>
            </div>

            {/* Points */}
            <div className="border-t border-gray-100 pt-5 space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p
                    className="text-[9px] tracking-[0.18em] uppercase text-gray-400 mb-0.5 font-inter"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Points Balance
                  </p>
                  <p
                    className="font-playfair text-[44px] font-light text-navy leading-none"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {loyalty.loyaltyPoints.toLocaleString()}
                  </p>
                </div>
                {loyalty.freeNightsAvailable > 0 && (
                  <div className="text-right">
                    <p
                      className="text-[9px] tracking-[0.18em] uppercase text-gray-400 mb-0.5 font-inter"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Free Nights
                    </p>
                    <p
                      className="font-playfair text-[44px] font-light text-green-600 leading-none"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {loyalty.freeNightsAvailable}
                    </p>
                  </div>
                )}
              </div>

              {/* Progress bar toward next Standard Room redemption */}
              <div>
                <div className="flex justify-between text-[11px] text-gray-400 mb-1.5">
                  <span className="font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {nextTier
                      ? `Progress toward ${nextTier.label} redemption`
                      : 'Progress to next Standard Room'}
                  </span>
                  <span className="font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {loyalty.pointsToNextFreeNight} pts needed
                  </span>
                </div>
                <div className="h-1 bg-gray-100 overflow-hidden">
                  <div
                    className="h-full bg-gold transition-all duration-700"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <p
                  className="text-[11px] text-gray-400 mt-1.5 font-inter"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {pointsInCycle} / 500 points in current cycle
                </p>
              </div>
            </div>
          </div>

          {/* Redemption notice */}
          {loyalty.freeNightsAvailable > 0 && (
            <div className="border border-green-200 bg-green-50 p-5">
              <p
                className="text-[13px] text-green-700 font-semibold mb-1 font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                You have {loyalty.freeNightsAvailable} free night
                {loyalty.freeNightsAvailable > 1 ? 's' : ''} to redeem
              </p>
              <p
                className="text-[12px] text-green-600 leading-relaxed font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Call{' '}
                <a href="tel:+2349015525389" className="text-gold hover:text-gold-light transition-colors underline">
                  +234 901 552 5389
                </a>{' '}
                or email{' '}
                <a href="mailto:info@mina-hotels.com" className="text-gold hover:text-gold-light transition-colors underline">
                  info@mina-hotels.com
                </a>{' '}
                and quote your rewards number.
              </p>
            </div>
          )}

          {/* How it works */}
          <div className="border-t border-gray-100 pt-6 space-y-3">
            <p
              className="text-[9px] tracking-[0.18em] uppercase text-gray-400 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Earning &amp; Redemption
            </p>
            {[
              { label: 'Standard Room',   earn: '100 pts/night', redeem: '500 pts' },
              { label: 'Deluxe Room',     earn: '150 pts/night', redeem: '700 pts' },
              { label: 'Royal Room',      earn: '175 pts/night', redeem: '850 pts' },
              { label: 'Executive Room',  earn: '200 pts/night', redeem: '1,000 pts' },
              { label: 'Exclusive Suite', earn: '250 pts/night', redeem: '1,500 pts' },
              { label: 'Luxury Suite',    earn: '300 pts/night', redeem: '2,500 pts' },
            ].map((item) => (
              <div
                key={item.label}
                className="grid grid-cols-3 gap-4 text-[12px] py-2 border-b border-gray-50"
              >
                <span className="text-navy font-medium font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {item.label}
                </span>
                <span className="text-gold font-inter text-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {item.earn}
                </span>
                <span className="text-gray-500 font-inter text-right" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {item.redeem} to redeem
                </span>
              </div>
            ))}
            <div className="flex justify-between gap-6 text-[12px] py-2 border-b border-gray-50">
              <span className="text-gray-400 font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                Free night value
              </span>
              <span className="text-navy text-right font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                Average of your qualifying nights
              </span>
            </div>
            <div className="flex justify-between gap-6 text-[12px] py-2 border-b border-gray-50">
              <span className="text-gray-400 font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                Blackout dates
              </span>
              <span className="text-navy text-right font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                None — subject to availability
              </span>
            </div>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/loyalty/terms"
              className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-2 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Programme Terms &amp; Conditions
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  )
}
