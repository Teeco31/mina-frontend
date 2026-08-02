'use client'

import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { getMemberOrders, cancelMemberOrder, formatNGN, formatDate, type FoodOrder } from '@/lib/memberApi'

const STEPS = ['pending', 'confirmed', 'preparing', 'ready', 'delivered'] as const
const STEP_LABELS: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready: 'Ready',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

function StatusPipeline({ status }: { status: string }) {
  if (status === 'cancelled') {
    return (
      <span
        className="text-[11px] text-red-400 font-inter"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        Cancelled
      </span>
    )
  }

  const currentIdx = STEPS.indexOf(status as (typeof STEPS)[number])

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {STEPS.map((step, idx) => {
        const isPast = idx < currentIdx
        const isCurrent = idx === currentIdx
        const isFuture = idx > currentIdx
        return (
          <div key={step} className="flex items-center gap-1">
            <span
              className={`text-[10px] tracking-[0.04em] font-inter ${
                isCurrent
                  ? 'text-gold font-semibold'
                  : isPast
                  ? 'text-gray-400'
                  : 'text-gray-200'
              }`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {STEP_LABELS[step]}
            </span>
            {idx < STEPS.length - 1 && (
              <span
                className={`w-4 h-px ${isPast || isCurrent ? 'bg-gold/40' : 'bg-gray-200'}`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

function OrderRow({
  order,
  onCancel,
}: {
  order: FoodOrder
  onCancel: (reference: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  const handleCancel = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('Cancel this order?')) return
    setCancelling(true)
    await onCancel(order.reference)
    setCancelling(false)
  }

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        className="w-full text-left py-4 flex items-start justify-between gap-4"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-4 flex-wrap">
            <span
              className="text-[13px] font-medium text-navy font-mono font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {order.reference}
            </span>
            {order.roomNumber && (
              <span
                className="text-[11px] text-gray-400 font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Room {order.roomNumber}
              </span>
            )}
            <span
              className="text-[11px] text-gray-400 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {new Date(order.placedAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
          <div className="mt-1.5 flex items-center gap-2 flex-wrap">
            <StatusPipeline status={order.status} />
          </div>
          <p
            className="mt-1.5 text-[11px] text-gray-400 font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {order.items.length} item{order.items.length !== 1 ? 's' : ''} ·{' '}
            {formatNGN(order.totalAmount)}
          </p>
        </div>
        <span className="text-gray-300 flex-shrink-0 mt-0.5">
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </span>
      </button>

      {expanded && (
        <div className="pb-5 space-y-4">
          <div className="h-px bg-gray-50" />

          <div className="space-y-2">
            <p
              className="text-[9px] tracking-[0.18em] uppercase text-gray-400 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Items
            </p>
            {order.items.map((item, i) => (
              <div
                key={i}
                className="flex justify-between gap-4 text-[12px]"
              >
                <div>
                  <span
                    className="text-navy font-inter"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {item.name} × {item.quantity}
                  </span>
                  {item.specialNote && (
                    <p
                      className="text-[11px] text-gray-400 italic font-inter"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {item.specialNote}
                    </p>
                  )}
                </div>
                <span
                  className="text-gray-500 flex-shrink-0 font-inter"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {formatNGN(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-50 pt-3 space-y-1 text-[12px]">
            <div className="flex justify-between text-gray-400">
              <span
                className="font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Subtotal
              </span>
              <span
                className="font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {formatNGN(order.subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span
                className="font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                VAT (7.5%)
              </span>
              <span
                className="font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {formatNGN(order.taxAmount)}
              </span>
            </div>
            <div className="flex justify-between text-navy font-semibold pt-1 border-t border-gray-100">
              <span
                className="font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Total
              </span>
              <span
                className="font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {formatNGN(order.totalAmount)}
              </span>
            </div>
          </div>

          {order.specialInstructions && (
            <p
              className="text-[12px] text-gray-400 italic font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              "{order.specialInstructions}"
            </p>
          )}

          {order.status === 'pending' && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="text-[11px] text-red-400 hover:text-red-500 transition-colors font-inter disabled:opacity-50"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {cancelling ? 'Cancelling…' : 'Cancel order'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<FoodOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getMemberOrders().then(({ orders: o, error: e }) => {
      if (e) setError(e)
      setOrders(o)
      setLoading(false)
    })
  }, [])

  const handleCancel = async (reference: string) => {
    const { order } = await cancelMemberOrder(reference)
    if (order) {
      setOrders((prev) => prev.map((o) => (o.reference === reference ? order : o)))
    }
  }

  return (
    <div className="px-5 sm:px-8 md:px-10 py-10 max-w-3xl">
      <div className="mb-8">
        <p
          className="text-[9px] tracking-[0.26em] uppercase text-gray-400 mb-2 font-inter"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Room Service
        </p>
        <h1
          className="font-playfair text-[28px] font-light text-navy"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          My Orders
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
      ) : orders.length === 0 ? (
        <p
          className="text-[14px] text-gray-400 py-6 font-inter"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          No orders yet. Browse the menu to place your first in-room order.
        </p>
      ) : (
        <div>
          {orders.map((order) => (
            <OrderRow key={order.reference} order={order} onCancel={handleCancel} />
          ))}
        </div>
      )}
    </div>
  )
}
