// lib/api.ts
// All API calls go through here. Every function returns real data when the
// backend is reachable, or falls back to the static fallback data silently.

const API_BASE = process.env.NEXT_PUBLIC_API_URL
const TIMEOUT_MS = 20000

// ── Low-level fetch with timeout ─────────────────────────────────────────────
async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<{ data: T | null; error: string | null }> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }
    if (token) headers['Authorization'] = `Bearer ${token}`

    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
    })

    const json = await res.json()

    if (!res.ok) {
      return { data: null, error: json.message || `Error ${res.status}` }
    }

    return { data: json as T, error: null }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return { data: null, error: msg }
  } finally {
    clearTimeout(timer)
  }
}

// ── Auth token helpers (client-side only) ────────────────────────────────────
export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('mina_access_token')
}

export function setStoredTokens(access: string, refresh: string) {
  localStorage.setItem('mina_access_token', access)
  localStorage.setItem('mina_refresh_token', refresh)
}

export function clearStoredTokens() {
  localStorage.removeItem('mina_access_token')
  localStorage.removeItem('mina_refresh_token')
}

// ── Types ────────────────────────────────────────────────────────────────────
export interface Room {
  _id: string
  roomNumber: string
  floor: number
  category: 'standard' | 'deluxe' | 'royal' | 'executive' | 'exclusive-suite' | 'luxury-suite'
  name: string
  pricePerNight: number
  description: string
  sizeM2: number
  bedType: string
  maxOccupancy: number
  view: string
  amenities: string[]
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning' | 'out-of-order'
  images: { url: string; caption?: string; isPrimary?: boolean }[]
  totalBookings: number
  totalRevenue: number
  averageRating: number
}

export interface BookingPayload {
  roomId: string
  checkIn: string
  checkOut: string
  adults: number
  children?: number
  firstName: string
  lastName?: string
  email: string
  phone?: string
  specialRequests?: string
  source?: string
}

export interface BookingResponse {
  success: boolean
  message: string
  data: {
    reference: string
    status: string
    totalAmount: number
    checkIn: string
    checkOut: string
    numberOfNights: number
    guestDetails: { firstName: string; email: string }
    room: { name: string; roomNumber: string }
  }
}

export interface AvailabilityResult {
  success: boolean
  checkIn: string
  checkOut: string
  nights: number
  count: number
  data: (Room & { nights: number; totalBeforeTax: number; totalWithTax: number })[]
}

export interface EnquiryPayload {
  firstName: string
  lastName?: string
  email: string
  phone?: string
  type?: string
  message: string
}

export interface AuthResponse {
  success: boolean
  accessToken: string
  refreshToken: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    role: string
    loyaltyTier: string
    loyaltyPoints: number
  }
}

export interface DashboardData {
  rooms: {
    total: number
    available: number
    occupied: number
    cleaning: number
    maintenance: number
    occupancyRate: number
  }
  today: { arrivals: number; departures: number; inHouse: number }
  month: { revenue: number }
  pending: { bookings: number; enquiries: number }
  totalGuests: number
}

// ── PUBLIC API ────────────────────────────────────────────────────────────────

export async function checkAvailability(
  checkIn: string,
  checkOut: string,
  guests: number,
  category?: string
): Promise<AvailabilityResult | null> {
  const params = new URLSearchParams({ checkIn, checkOut, guests: String(guests) })
  if (category) params.set('category', category)
  const { data } = await apiFetch<AvailabilityResult>(`/bookings/availability?${params}`)
  return data
}

export interface InitiateBookingResult {
  success: boolean
  data?: {
    bookingId: string
    reference: string
    totalAmount: number
    paymentUrl: string
    paymentReference: string
    checkIn: string
    checkOut: string
    room: { name: string; roomNumber: string }
    guestDetails: { firstName: string; email: string }
  }
  error?: string
}

export async function initiateBooking(
  payload: BookingPayload
): Promise<InitiateBookingResult> {
  const { data, error } = await apiFetch<{ success: boolean; data: InitiateBookingResult['data'] }>('/bookings', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  if (error || !data?.success) return { success: false, error: error || 'Failed to create booking' }
  return { success: true, data: data.data }
}

// Alias so any existing code importing createBooking still works
export const createBooking = initiateBooking

export async function verifyBookingPayment(reference: string): Promise<{
  success: boolean
  alreadyVerified?: boolean
  data?: {
    reference: string
    status: string
    paymentStatus: string
    totalAmount: number
    checkIn: string
    checkOut: string
    room: { name: string; roomNumber: string }
    guestDetails: { firstName: string; email: string }
  }
  message?: string
  error?: string
}> {
  const { data, error } = await apiFetch<{
    success: boolean
    alreadyVerified?: boolean
    message?: string
    data: {
      reference: string
      status: string
      paymentStatus: string
      totalAmount: number
      checkIn: string
      checkOut: string
      room: { name: string; roomNumber: string }
      guestDetails: { firstName: string; email: string }
    }
  }>(`/bookings/verify-payment?reference=${encodeURIComponent(reference)}`)
  if (error || !data?.success) return { success: false, error: error || 'Verification failed' }
  return { success: true, alreadyVerified: data.alreadyVerified, data: data.data, message: data.message }
}

export async function lookupBooking(reference: string) {
  const { data } = await apiFetch<{ success: boolean; data: unknown }>(`/bookings/reference/${reference}`)
  return data?.data || null
}

export async function fetchRooms(): Promise<Room[]> {
  const { data } = await apiFetch<{ data: Room[] }>('/rooms?isActive=true')
  return data?.data || []
}

export async function submitEnquiry(
  payload: EnquiryPayload
): Promise<{ success: boolean; error?: string }> {
  const { data, error } = await apiFetch<{ success: boolean; message: string }>('/enquiries', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  if (error || !data?.success) return { success: false, error: error || 'Failed to send enquiry' }
  return { success: true }
}

export interface Review {
  _id: string
  guestName: string
  overallRating: number
  title?: string
  body: string
  roomCategory?: string
  managementResponse?: { body: string; respondedAt?: string }
  createdAt: string
}

export async function fetchPublicReviews(): Promise<Review[]> {
  const { data } = await apiFetch<{ data: Review[] }>('/reviews?status=approved&limit=12&sort=-createdAt')
  return data?.data || []
}

// ── AUTH ──────────────────────────────────────────────────────────────────────

export async function login(
  email: string,
  password: string
): Promise<{ success: boolean; user?: AuthResponse['user']; error?: string }> {
  const { data, error } = await apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  if (error || !data?.success) return { success: false, error: error || 'Login failed' }
  setStoredTokens(data.accessToken, data.refreshToken)
  return { success: true, user: data.user }
}

export async function logout() {
  const token = getStoredToken()
  if (token) await apiFetch('/auth/logout', { method: 'POST' }, token)
  clearStoredTokens()
}

// ── ADMIN API (all require token) ─────────────────────────────────────────────

export async function adminFetch<T>(path: string, options: RequestInit = {}) {
  const token = getStoredToken()
  return apiFetch<T>(path, options, token || undefined)
}

export async function fetchDashboard(): Promise<DashboardData | null> {
  const { data } = await adminFetch<{ data: DashboardData }>('/analytics/dashboard')
  return data?.data || null
}

export async function fetchAllBookings(params: Record<string, string> = {}) {
  const q = new URLSearchParams(params).toString()
  const { data } = await adminFetch<{ data: unknown[]; total: number; pages: number }>(
    `/bookings${q ? `?${q}` : ''}`
  )
  return data || { data: [], total: 0, pages: 1 }
}

export async function fetchAllRooms() {
  const { data } = await adminFetch<{ data: Room[] }>('/rooms?isActive=all')
  return data?.data || []
}

export async function updateRoomStatus(id: string, status: string, note?: string) {
  const { data, error } = await adminFetch<{ success: boolean; data: Room }>(
    `/rooms/${id}/status`,
    { method: 'PATCH', body: JSON.stringify({ status, note }) }
  )
  return { success: !!data?.success, room: data?.data, error }
}

export async function confirmBooking(id: string) {
  const { data, error } = await adminFetch(`/bookings/${id}/confirm`, { method: 'PATCH' })
  return { success: !error, data, error }
}

export async function checkInBooking(id: string) {
  const { data, error } = await adminFetch(`/bookings/${id}/check-in`, { method: 'PATCH' })
  return { success: !error, data, error }
}

export async function checkOutBooking(id: string) {
  const { data, error } = await adminFetch(`/bookings/${id}/check-out`, { method: 'PATCH' })
  return { success: !error, data, error }
}

export async function cancelBooking(id: string, reason: string) {
  const { data, error } = await adminFetch(`/bookings/${id}/cancel`, {
    method: 'PATCH',
    body: JSON.stringify({ reason }),
  })
  return { success: !error, data, error }
}

export async function recordPayment(id: string, amount: number, method: string, reference?: string) {
  const { data, error } = await adminFetch(`/bookings/${id}/payment`, {
    method: 'POST',
    body: JSON.stringify({ amount, method, reference }),
  })
  return { success: !error, data, error }
}

export async function fetchAllEnquiries(params: Record<string, string> = {}) {
  const q = new URLSearchParams(params).toString()
  const { data } = await adminFetch<{ data: unknown[]; total: number }>(`/enquiries${q ? `?${q}` : ''}`)
  return data || { data: [], total: 0 }
}

export async function updateEnquiry(id: string, updates: Record<string, unknown>) {
  const { data, error } = await adminFetch(`/enquiries/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  })
  return { success: !error, data, error }
}

export async function fetchAllUsers(params: Record<string, string> = {}) {
  const q = new URLSearchParams(params).toString()
  const { data } = await adminFetch<{ data: unknown[]; total: number }>(`/users${q ? `?${q}` : ''}`)
  return data || { data: [], total: 0 }
}

export async function fetchRevenueReport(year?: number) {
  const { data } = await adminFetch<{ data: unknown }>(`/analytics/revenue${year ? `?year=${year}` : ''}`)
  return data?.data || null
}

export async function fetchOccupancyReport(year?: number) {
  const { data } = await adminFetch<{ data: unknown }>(`/analytics/occupancy${year ? `?year=${year}` : ''}`)
  return data?.data || null
}

export async function fetchTodayActivity() {
  const { data } = await adminFetch<{ data: unknown }>('/bookings/today')
  return data?.data || null
}

export async function fetchAllReviews(params: Record<string, string> = {}) {
  const q = new URLSearchParams(params).toString()
  const { data } = await adminFetch<{ data: unknown[]; total: number }>(`/reviews${q ? `?${q}` : ''}`)
  return data || { data: [], total: 0 }
}

export async function updateReviewStatus(id: string, status: string, responseBody?: string) {
  const { data, error } = await adminFetch(`/reviews/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, responseBody }),
  })
  return { success: !error, data, error }
}

// ── Loyalty Programme ─────────────────────────────────────────────────────────
export async function enrollInLoyalty(data: {
  firstName: string
  lastName?: string
  email: string
  phone?: string
}): Promise<{ success: boolean; rewardsNumber?: string; firstName?: string; alreadyEnrolled?: boolean; error?: string }> {
  const { data: res, error } = await apiFetch<{
    success: boolean; rewardsNumber: string; firstName: string
    alreadyEnrolled?: boolean; message: string
  }>('/auth/loyalty/enroll', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  if (error || !res?.success) return { success: false, error: error || 'Enrolment failed' }
  return { success: true, rewardsNumber: res.rewardsNumber, firstName: res.firstName, alreadyEnrolled: res.alreadyEnrolled }
}

export async function lookupRewardsBalance(identifier: string): Promise<{
  success: boolean
  data?: {
    firstName: string; lastName: string; rewardsNumber: string
    loyaltyPoints: number; totalNights: number
    freeNightsAvailable: number; pointsToNextFreeNight: number
  }
  error?: string
}> {
  const { data: res, error } = await apiFetch<{
    success: boolean
    data: {
      firstName: string; lastName: string; rewardsNumber: string
      loyaltyPoints: number; totalNights: number
      freeNightsAvailable: number; pointsToNextFreeNight: number
    }
  }>(`/auth/loyalty/lookup?identifier=${encodeURIComponent(identifier)}`)
  if (error || !res?.success) return { success: false, error: error || 'Not found' }
  return { success: true, data: res.data }
}

// ── BLOG / MINA UPDATES ───────────────────────────────────────────────────────

export interface PublicBlogPost {
  _id: string
  title: string
  slug: string
  excerpt?: string
  coverImage?: string
  category?: string
  tags: string[]
  status: string
  views: number
  likes: number
  publishedAt?: string
  createdAt: string
  readTime?: number
  author?: { firstName: string; lastName: string; role?: string }
  comments?: { name: string; content: string; createdAt: string; isApproved: boolean }[]
  seo?: { metaTitle?: string; metaDescription?: string; keywords?: string[] }
  content?: string
}

export async function fetchBlogPosts(params: Record<string, string> = {}): Promise<{
  data: PublicBlogPost[]
  total: number
  pages: number
  page: number
}> {
  const q = new URLSearchParams(params).toString()
  const { data } = await apiFetch<{ data: PublicBlogPost[]; total: number; pages: number; page: number }>(
    `/blog${q ? `?${q}` : ''}`,
    { cache: 'no-store' }
  )
  console.log('Fetched blog posts with params:', params)
  return data || { data: [], total: 0, pages: 1, page: 1 }
}

export async function fetchBlogPostBySlug(slug: string): Promise<PublicBlogPost | null> {
  const { data } = await apiFetch<{ data: PublicBlogPost }>(`/blog/${slug}`)
  return data?.data || null
}

export async function likePost(id: string): Promise<number> {
  const { data } = await apiFetch<{ data: { likes: number } }>(`/blog/${id}/like`, { method: 'POST' })
  return data?.data?.likes || 0
}

export async function submitComment(
  id: string,
  payload: { name: string; email: string; content: string }
): Promise<{ success: boolean; error?: string }> {
  const { data, error } = await apiFetch<{ success: boolean; message: string }>(`/blog/${id}/comment`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  if (error || !data?.success) return { success: false, error: error || 'Failed to submit comment' }
  return { success: true }
}