'use client'

import { useEffect, useState } from 'react'
import { X, Plus, Minus, ShoppingBag, AlertCircle, Check } from 'lucide-react'
import {
  getMenu, placeOrder, getMemberBookings,
  formatNGN,
  type MenuItem, type CartItem, type MemberBooking,
} from '@/lib/memberApi'

const CATEGORY_LABELS: Record<string, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  drinks: 'Drinks',
  snacks: 'Snacks',
  desserts: 'Desserts',
}

export default function MenuPage() {
  const [menu, setMenu] = useState<Record<string, MenuItem[]>>({})
  const [activeCategory, setActiveCategory] = useState<string>('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [activeBooking, setActiveBooking] = useState<MemberBooking | null>(null)
  const [loading, setLoading] = useState(true)
  const [placing, setPlacing] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [orderError, setOrderError] = useState('')
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('room-charge')

  useEffect(() => {
    Promise.all([getMenu(), getMemberBookings()]).then(([m, b]) => {
      setMenu(m.menu)
      const first = Object.keys(m.menu)[0] || ''
      setActiveCategory(first)
      const active = b.bookings.find((bk) => bk.status === 'checked-in') || null
      setActiveBooking(active)
      setLoading(false)
    })
  }, [])

  const categories = Object.keys(menu)
  const items = activeCategory ? menu[activeCategory] || [] : []

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItemId === item._id)
      if (existing) {
        return prev.map((c) =>
          c.menuItemId === item._id ? { ...c, quantity: c.quantity + 1 } : c
        )
      }
      return [
        ...prev,
        { menuItemId: item._id, name: item.name, price: item.price, quantity: 1, specialNote: '' },
      ]
    })
    setCartOpen(true)
  }

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => (c.menuItemId === id ? { ...c, quantity: c.quantity + delta } : c))
        .filter((c) => c.quantity > 0)
    )
  }

  const updateNote = (id: string, note: string) => {
    setCart((prev) =>
      prev.map((c) => (c.menuItemId === id ? { ...c, specialNote: note } : c))
    )
  }

  const cartSubtotal = cart.reduce((sum, c) => sum + c.price * c.quantity, 0)
  const cartTax = cartSubtotal * 0.075
  const cartTotal = cartSubtotal + cartTax
  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0)

  const handlePlaceOrder = async () => {
    if (!activeBooking) return
    setPlacing(true)
    setOrderError('')
    const { error } = await placeOrder({
      items: cart.map(({ menuItemId, quantity, specialNote }) => ({
        menuItemId,
        quantity,
        specialNote,
      })),
      specialInstructions,
      paymentMethod,
    })
    setPlacing(false)
    if (error) {
      setOrderError(error)
    } else {
      setOrderSuccess(true)
      setCart([])
      setSpecialInstructions('')
      setTimeout(() => {
        setCartOpen(false)
        setOrderSuccess(false)
      }, 2500)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 sm:px-8 md:px-10 py-8 border-b border-gray-100">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p
              className="text-[9px] tracking-[0.26em] uppercase text-gray-400 mb-1.5 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              In-Room Dining
            </p>
            <h1
              className="font-playfair text-[28px] font-light text-navy"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Food & Drinks
            </h1>
            <div className="w-10 h-px bg-gold mt-2" />
          </div>

          {cart.length > 0 && (
            <button
              onClick={() => setCartOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gold text-navy text-[11px] tracking-[0.12em] uppercase font-semibold hover:bg-gold-light transition-colors font-inter flex-shrink-0"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <ShoppingBag size={14} />
              <span>Order ({cartCount})</span>
            </button>
          )}
        </div>

        {!loading && !activeBooking && (
          <div className="mt-4 flex items-start gap-2.5 p-3.5 bg-amber-50 border border-amber-200">
            <AlertCircle size={13} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <p
              className="text-[12px] text-amber-700 leading-relaxed font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              In-room ordering is available when you have an active stay. You can still browse the menu.
            </p>
          </div>
        )}
      </div>

      {/* Category tabs */}
      {!loading && categories.length > 0 && (
        <div className="flex border-b border-gray-100 overflow-x-auto flex-shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-3 text-[11px] tracking-[0.1em] uppercase whitespace-nowrap border-b-2 transition-all -mb-px font-inter ${
                activeCategory === cat
                  ? 'border-gold text-navy'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {CATEGORY_LABELS[cat] || cat}
            </button>
          ))}
        </div>
      )}

      {/* Menu items */}
      <div className="flex-1 overflow-y-auto px-5 sm:px-8 md:px-10 py-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p
            className="text-[13px] text-gray-400 py-6 font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            No items available in this category.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
            {items.map((item) => {
              const inCart = cart.find((c) => c.menuItemId === item._id)
              return (
                <div
                  key={item._id}
                  className="border border-gray-100 bg-white p-4 flex gap-3 hover:border-gray-200 transition-colors"
                >
                  {item.image && (
                    <div className="w-16 h-16 flex-shrink-0 overflow-hidden bg-gray-50">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className="font-playfair text-[15px] font-normal text-navy leading-tight"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {item.name}
                      </p>
                      <p
                        className="text-[13px] text-navy font-semibold font-inter flex-shrink-0"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {formatNGN(item.price)}
                      </p>
                    </div>
                    {item.description && (
                      <p
                        className="text-[11px] text-gray-400 mt-0.5 leading-relaxed font-inter line-clamp-2"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {item.description}
                      </p>
                    )}
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-1">
                        {item.dietaryTags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] tracking-[0.08em] uppercase text-gray-400 border border-gray-200 px-1.5 py-0.5 font-inter"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            {tag}
                          </span>
                        ))}
                        {item.preparationTime && (
                          <span
                            className="text-[9px] text-gray-300 font-inter"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            ~{item.preparationTime}min
                          </span>
                        )}
                      </div>
                      {activeBooking && (
                        <button
                          onClick={() => addToCart(item)}
                          className="flex items-center gap-1.5 text-[10px] tracking-[0.1em] uppercase text-gold border border-gold/40 px-2.5 py-1.5 hover:bg-gold hover:text-navy transition-all font-inter flex-shrink-0"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          {inCart ? (
                            <>
                              <Plus size={10} />
                              <span>Add ({inCart.quantity})</span>
                            </>
                          ) : (
                            <>
                              <Plus size={10} />
                              <span>Add</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Cart drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/40"
            onClick={() => setCartOpen(false)}
          />
          <div
            className="w-80 flex flex-col overflow-hidden"
            style={{ background: '#0A1628' }}
          >
            {/* Cart header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 flex-shrink-0">
              <p
                className="font-playfair text-[16px] font-light text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Your Order
              </p>
              <button
                onClick={() => setCartOpen(false)}
                className="text-white/40 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {orderSuccess ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-6 gap-4">
                <div className="w-12 h-12 bg-gold flex items-center justify-center">
                  <Check size={20} className="text-navy" />
                </div>
                <p
                  className="font-playfair text-[20px] font-light text-white"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Order placed
                </p>
                <p
                  className="text-[12px] text-white/50 font-inter leading-relaxed"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  We've received your order. Track it in My Orders.
                </p>
              </div>
            ) : (
              <>
                {/* Cart items */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
                  {cart.length === 0 ? (
                    <p
                      className="text-[12px] text-white/40 font-inter"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      No items yet. Add from the menu.
                    </p>
                  ) : (
                    cart.map((item) => (
                      <div key={item.menuItemId} className="space-y-2">
                        <div className="flex items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-[13px] text-white font-inter"
                              style={{ fontFamily: "'Inter', sans-serif" }}
                            >
                              {item.name}
                            </p>
                            <p
                              className="text-[11px] text-white/40 font-inter"
                              style={{ fontFamily: "'Inter', sans-serif" }}
                            >
                              {formatNGN(item.price)} each
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              onClick={() => updateQty(item.menuItemId, -1)}
                              className="w-6 h-6 flex items-center justify-center border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors"
                            >
                              <Minus size={10} />
                            </button>
                            <span
                              className="text-[13px] text-white w-4 text-center font-inter"
                              style={{ fontFamily: "'Inter', sans-serif" }}
                            >
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQty(item.menuItemId, 1)}
                              className="w-6 h-6 flex items-center justify-center border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors"
                            >
                              <Plus size={10} />
                            </button>
                          </div>
                        </div>
                        <input
                          type="text"
                          placeholder="Special note (optional)"
                          value={item.specialNote}
                          onChange={(e) => updateNote(item.menuItemId, e.target.value)}
                          className="w-full bg-transparent border-b border-white/15 text-white/70 text-[11px] py-1 outline-none focus:border-gold transition-colors font-inter placeholder:text-white/25"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        />
                      </div>
                    ))
                  )}

                  {cart.length > 0 && (
                    <>
                      <div className="border-t border-white/10 pt-4 space-y-2">
                        <div className="flex flex-col gap-1.5">
                          <label
                            className="text-[9px] tracking-[0.2em] uppercase text-white/40 font-inter"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            Special Instructions
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Allergies, dietary needs…"
                            value={specialInstructions}
                            onChange={(e) => setSpecialInstructions(e.target.value)}
                            className="w-full bg-transparent border-b border-white/15 text-white/70 text-[12px] py-1 outline-none focus:border-gold resize-none transition-colors font-inter placeholder:text-white/25"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          />
                        </div>
                        <div className="flex flex-col gap-1.5 pt-2">
                          <label
                            className="text-[9px] tracking-[0.2em] uppercase text-white/40 font-inter"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            Payment Method
                          </label>
                          <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="bg-transparent border-b border-white/15 text-white text-[12px] py-1 outline-none focus:border-gold transition-colors font-inter"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            <option value="room-charge" style={{ background: '#0A1628' }}>
                              Charge to room
                            </option>
                            <option value="cash" style={{ background: '#0A1628' }}>
                              Cash on delivery
                            </option>
                            <option value="card" style={{ background: '#0A1628' }}>
                              Card on delivery
                            </option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Cart footer */}
                {cart.length > 0 && (
                  <div className="flex-shrink-0 px-5 py-4 border-t border-white/10 space-y-3">
                    <div className="space-y-1 text-[12px]">
                      <div className="flex justify-between text-white/50">
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
                          {formatNGN(cartSubtotal)}
                        </span>
                      </div>
                      <div className="flex justify-between text-white/50">
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
                          {formatNGN(cartTax)}
                        </span>
                      </div>
                      <div className="flex justify-between text-white font-semibold pt-1 border-t border-white/10">
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
                          {formatNGN(cartTotal)}
                        </span>
                      </div>
                    </div>

                    {orderError && (
                      <div className="flex items-start gap-2 p-2.5 bg-red-900/20 border border-red-500/25">
                        <AlertCircle size={12} className="text-red-400 flex-shrink-0 mt-0.5" />
                        <p
                          className="text-[11px] text-red-300 font-inter"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          {orderError}
                        </p>
                      </div>
                    )}

                    <button
                      onClick={handlePlaceOrder}
                      disabled={placing || !activeBooking}
                      className="w-full py-3 bg-gold text-navy text-[11px] tracking-[0.18em] uppercase font-semibold hover:bg-gold-light transition-colors disabled:opacity-50 font-inter"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {placing ? 'Placing order…' : 'Place Order'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
