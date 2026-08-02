'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import {
  getMemberBookings, getMemberOrders, getMemberLoyalty,
  formatNGN, formatDateShort,
  type MemberBooking, type FoodOrder, type LoyaltyData,
} from '@/lib/memberApi'

const STATUS_LABEL: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  'checked-in': 'Checked In',
  'checked-out': 'Checked Out',
  cancelled: 'Cancelled',
  'no-show': 'No Show',
}

const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready: 'Ready',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

function statusColor(status: string): string {
  if (status === 'checked-in' || status === 'confirmed' || status === 'delivered' || status === 'ready') return 'text-gold'
  if (status === 'cancelled' || status === 'no-show') return 'text-red-400'
  return 'text-gray-400'
}

export default function AccountOverview() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<MemberBooking[]>([])
  const [orders, setOrders] = useState<FoodOrder[]>([])
  const [loyalty, setLoyalty] = useState<LoyaltyData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getMemberBookings(), getMemberOrders(), getMemberLoyalty()]).then(
      ([b, o, l]) => {
        setBookings(b.bookings)
        setOrders(o.orders)
        setLoyalty(l.loyalty)
        setLoading(false)
      }
    )
  }, [])

  const activeBooking = bookings.find((b) => b.status === 'checked-in')
  const recentBookings = bookings.slice(0, 2)
  const recentOrders = orders.slice(0, 3)
  const progressPct = loyalty
    ? Math.min(100, ((1000 - loyalty.pointsToNextFreeNight) / 1000) * 100)
    : 0

  return (
    <div className="px-5 sm:px-8 md:px-10 py-10 max-w-3xl">
      {/* Guest name */}
      <div className="mb-10">
        <p
          className="text-[9px] tracking-[0.26em] uppercase text-gray-400 mb-2 font-inter"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Guest Folio
        </p>
        <h1
          className="font-playfair text-[34px] sm:text-[40px] font-light text-navy leading-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {user?.firstName} {user?.lastName}
        </h1>
        {user?.rewardsNumber && (
          <p
            className="text-[11px] text-gray-400 font-mono mt-1 font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {user.rewardsNumber}
          </p>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-10">
          {/* Active stay */}
          {activeBooking && (
            <section>
              <p
                className="text-[9px] tracking-[0.22em] uppercase text-gray-400 mb-3 font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Current Stay
              </p>
              <div className="border-l-2 border-gold pl-5 py-1">
                <p
                  className="font-playfair text-[18px] font-light text-navy"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Room {activeBooking.room?.roomNumber} — {activeBooking.room?.name}
                </p>
                <div
                  className="mt-1.5 flex flex-wrap gap-x-6 gap-y-1 text-[12px] text-gray-500 font-inter"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <span>
                    Check-out:{' '}
                    <span className="text-navy">{formatDateShort(activeBooking.checkOut)}</span>
                  </span>
                  <span>
                    {activeBooking.numberOfNights} night
                    {activeBooking.numberOfNights !== 1 ? 's' : ''}
                  </span>
                  <span className="text-gold">{STATUS_LABEL[activeBooking.status]}</span>
                </div>
              </div>
            </section>
          )}

          {/* Points balance */}
          {loyalty && (
            <section>
              <p
                className="text-[9px] tracking-[0.22em] uppercase text-gray-400 mb-3 font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Loyalty Points
              </p>
              <div className="border border-gray-100 p-5 bg-white">
                <div className="flex items-end justify-between gap-4 flex-wrap mb-4">
                  <div>
                    <p
                      className="font-playfair text-[42px] font-light text-navy leading-none"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {loyalty.loyaltyPoints.toLocaleString()}
                    </p>
                    <p
                      className="text-[11px] text-gray-400 mt-0.5 font-inter"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      points balance
                    </p>
                  </div>
                  {loyalty.freeNightsAvailable > 0 && (
                    <div className="text-right">
                      <p
                        className="font-playfair text-[32px] font-light text-green-600 leading-none"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {loyalty.freeNightsAvailable}
                      </p>
                      <p
                        className="text-[11px] text-gray-400 mt-0.5 font-inter"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        free night{loyalty.freeNightsAvailable > 1 ? 's' : ''} earned
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-gray-400 mb-1.5">
                    <span
                      className="font-inter"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Progress to next free night
                    </span>
                    <span
                      className="font-inter"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {loyalty.pointsToNextFreeNight} pts needed
                    </span>
                  </div>
                  <div className="h-1 bg-gray-100 overflow-hidden">
                    <div
                      className="h-full bg-gold transition-all duration-700"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-2 text-right">
                <Link
                  href="/account/loyalty"
                  className="text-[11px] text-gray-400 hover:text-gold transition-colors font-inter"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  View full details →
                </Link>
              </div>
            </section>
          )}

          {/* Recent orders */}
          <section>
            <div className="flex items-baseline justify-between mb-3">
              <p
                className="text-[9px] tracking-[0.22em] uppercase text-gray-400 font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Recent Orders
              </p>
              <Link
                href="/account/orders"
                className="text-[11px] text-gray-400 hover:text-gold transition-colors font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                All orders →
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <p
                className="text-[13px] text-gray-400 py-4 font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                No orders yet.
              </p>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <div
                    key={order.reference}
                    className="py-3 flex items-baseline justify-between gap-4"
                  >
                    <div>
                      <p
                        className="text-[13px] text-navy font-inter"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {order.reference}
                      </p>
                      <p
                        className="text-[11px] text-gray-400 mt-0.5 font-inter"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''} ·{' '}
                        {formatNGN(order.totalAmount)}
                      </p>
                    </div>
                    <span
                      className={`text-[11px] font-inter flex-shrink-0 ${statusColor(order.status)}`}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {ORDER_STATUS_LABEL[order.status]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Recent bookings */}
          <section>
            <div className="flex items-baseline justify-between mb-3">
              <p
                className="text-[9px] tracking-[0.22em] uppercase text-gray-400 font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Recent Bookings
              </p>
              <Link
                href="/account/bookings"
                className="text-[11px] text-gray-400 hover:text-gold transition-colors font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                All bookings →
              </Link>
            </div>

            {recentBookings.length === 0 ? (
              <div>
                <p
                  className="text-[13px] text-gray-400 py-4 font-inter"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  No bookings on record.{' '}
                  <Link href="/rooms" className="text-gold hover:text-gold-light transition-colors">
                    Ready to plan your stay?
                  </Link>
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.reference}
                    className="py-3 flex items-baseline justify-between gap-4"
                  >
                    <div>
                      <p
                        className="text-[13px] text-navy font-inter"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {booking.reference}
                      </p>
                      <p
                        className="text-[11px] text-gray-400 mt-0.5 font-inter"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {booking.room?.name} · {booking.numberOfNights} night
                        {booking.numberOfNights !== 1 ? 's' : ''} ·{' '}
                        {formatNGN(booking.totalAmount)}
                      </p>
                    </div>
                    <span
                      className={`text-[11px] font-inter flex-shrink-0 ${statusColor(booking.status)}`}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {STATUS_LABEL[booking.status]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
