// lib/memberApi.ts — Member portal API client
// Follows same fetch pattern as lib/api.ts

import { getStoredToken } from './api'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'
const TIMEOUT_MS = 8000

async function memberFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error: string | null }> {
  const token = getStoredToken()
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers as Record<string, string>),
      },
      signal: controller.signal,
    })
    const json = await res.json()
    if (!res.ok) return { data: null, error: json.message || `Error ${res.status}` }
    return { data: json as T, error: null }
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : 'Network error' }
  } finally {
    clearTimeout(timer)
  }
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface MemberUser {
  id: string
  _id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatar?: string
  role: string
  loyaltyPoints: number
  totalNights: number
  rewardsNumber?: string
  loyaltyEnrolled: boolean
  freeNightsAvailable: number
  createdAt: string
}

export interface MemberBooking {
  _id: string
  reference: string
  room: { _id: string; roomNumber: string; name: string; category: string }
  roomCategory: string
  guestDetails: { firstName: string; lastName: string; email: string; phone?: string }
  checkIn: string
  checkOut: string
  numberOfNights: number
  adults: number
  children: number
  pricePerNight: number
  subtotal: number
  taxAmount: number
  totalAmount: number
  amountPaid: number
  status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled' | 'no-show'
  paymentStatus: 'pending' | 'partial' | 'paid' | 'refunded' | 'failed'
  paymentMethod?: string
  specialRequests?: string
  addons: { name: string; quantity: number; unitPrice: number; total: number }[]
  loyaltyPointsEarned: number
  createdAt: string
}

export interface MenuItem {
  _id: string
  name: string
  description?: string
  category: 'breakfast' | 'lunch' | 'dinner' | 'drinks' | 'snacks' | 'desserts'
  price: number
  image?: string
  isAvailable: boolean
  dietaryTags: string[]
  preparationTime?: number
}

export interface CartItem {
  menuItemId: string
  name: string
  price: number
  quantity: number
  specialNote: string
}

export interface FoodOrder {
  _id: string
  reference: string
  roomNumber?: string
  items: {
    menuItem: string
    name: string
    price: number
    quantity: number
    specialNote: string
  }[]
  subtotal: number
  taxAmount: number
  totalAmount: number
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
  paymentMethod: string
  paymentStatus: string
  specialInstructions?: string
  placedAt: string
  createdAt: string
}

export interface TableReservation {
  _id: string
  reference: string
  date: string
  time: string
  partySize: number
  occasion: string
  specialRequests?: string
  status: 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled'
  createdAt: string
}

export interface LoyaltyData {
  loyaltyPoints: number
  totalNights: number
  rewardsNumber?: string
  freeNightsAvailable: number
  pointsToNextFreeNight: number
  loyaltyEnrolled: boolean
}

// ── Profile ───────────────────────────────────────────────────────────────────

export async function getMemberProfile() {
  const { data, error } = await memberFetch<{ success: boolean; data: MemberUser }>('/member/profile')
  return { user: data?.data || null, error }
}

export async function updateMemberProfile(updates: { firstName?: string; lastName?: string; phone?: string; avatar?: string }) {
  const { data, error } = await memberFetch<{ success: boolean; data: MemberUser }>('/member/profile', {
    method: 'PATCH',
    body: JSON.stringify(updates),
  })
  return { user: data?.data || null, error }
}

export async function changeMemberPassword(currentPassword: string, newPassword: string) {
  const { data, error } = await memberFetch<{ success: boolean; message: string }>('/member/password', {
    method: 'PATCH',
    body: JSON.stringify({ currentPassword, newPassword }),
  })
  return { success: !!data?.success, error }
}

// ── Bookings ──────────────────────────────────────────────────────────────────

export async function getMemberBookings() {
  const { data, error } = await memberFetch<{ success: boolean; data: MemberBooking[] }>('/member/bookings')
  return { bookings: data?.data || [], error }
}

export async function getMemberBookingByRef(reference: string) {
  const { data, error } = await memberFetch<{ success: boolean; data: MemberBooking }>(`/member/bookings/${reference}`)
  return { booking: data?.data || null, error }
}

// ── Menu + Orders ─────────────────────────────────────────────────────────────

export async function getMenu() {
  const { data, error } = await memberFetch<{ success: boolean; data: Record<string, MenuItem[]> }>('/menu')
  return { menu: data?.data || {}, error }
}

export async function placeOrder(payload: {
  items: { menuItemId: string; quantity: number; specialNote?: string }[]
  specialInstructions?: string
  paymentMethod?: string
}) {
  const { data, error } = await memberFetch<{ success: boolean; data: FoodOrder }>('/member/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return { order: data?.data || null, error }
}

export async function getMemberOrders() {
  const { data, error } = await memberFetch<{ success: boolean; data: FoodOrder[] }>('/member/orders')
  return { orders: data?.data || [], error }
}

export async function getMemberOrderByRef(reference: string) {
  const { data, error } = await memberFetch<{ success: boolean; data: FoodOrder }>(`/member/orders/${reference}`)
  return { order: data?.data || null, error }
}

export async function cancelMemberOrder(reference: string) {
  const { data, error } = await memberFetch<{ success: boolean; data: FoodOrder }>(`/member/orders/${reference}/cancel`, {
    method: 'PATCH',
  })
  return { order: data?.data || null, error }
}

// ── Reservations ──────────────────────────────────────────────────────────────

export async function createTableReservation(payload: {
  date: string
  time: string
  partySize: number
  occasion?: string
  specialRequests?: string
}) {
  const { data, error } = await memberFetch<{ success: boolean; data: TableReservation }>('/member/reservations', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return { reservation: data?.data || null, error }
}

export async function getMemberReservations() {
  const { data, error } = await memberFetch<{ success: boolean; data: TableReservation[] }>('/member/reservations')
  return { reservations: data?.data || [], error }
}

export async function cancelTableReservation(reference: string) {
  const { data, error } = await memberFetch<{ success: boolean; data: TableReservation }>(`/member/reservations/${reference}`, {
    method: 'DELETE',
  })
  return { success: !!data?.success, error }
}

// ── Loyalty ───────────────────────────────────────────────────────────────────

export async function getMemberLoyalty() {
  const { data, error } = await memberFetch<{ success: boolean; data: LoyaltyData }>('/member/loyalty')
  return { loyalty: data?.data || null, error }
}

// ── Auth helpers (used by AuthContext) ────────────────────────────────────────

export async function registerMember(payload: {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
}) {
  const { data, error } = await memberFetch<{
    success: boolean
    accessToken: string
    refreshToken: string
    user: MemberUser
  }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ ...payload, role: 'guest' }),
  })
  return { data: data || null, error }
}

export async function getMe() {
  const { data, error } = await memberFetch<{ success: boolean; data: MemberUser }>('/auth/me')
  return { user: data?.data || null, error }
}

// ── Formatters ────────────────────────────────────────────────────────────────

export function formatNGN(amount: number): string {
  return `₦${amount.toLocaleString('en-NG')}`
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatDateShort(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
