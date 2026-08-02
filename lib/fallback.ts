// lib/fallback.ts

export interface FallbackRoom {
  id: string
  _id: string
  category: string
  name: string
  pricePerNight: number
  price: string
  img: string
  description: string
  sizeM2?: number
  bedType: string
  maxOccupancy: number
  view?: string
  amenities: string[]
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning' | 'out-of-order'
}