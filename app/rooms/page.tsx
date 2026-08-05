import Link from 'next/link'
import BookRoomButton from '@/components/Bookroombutton'
import FadeIn from '@/components/FadeIn'
import BookingBar from '@/components/BookingBar'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rooms & Suites',
  description: '41 ensuite rooms across 6 categories — Standard, Deluxe, Royal, Executive, Exclusive Suite, and Luxury Suite. Book your stay at Mina Hotels, Port Harcourt.',
  keywords: ['Mina Hotels rooms', 'luxury suites Port Harcourt', 'hotel rooms Old GRA', 'executive suite Port Harcourt', 'boutique hotel rooms Nigeria'],
  alternates: { canonical: 'https://minahotels.com/rooms' },
  openGraph: {
    title: 'Rooms & Suites — Mina Hotels',
    description: 'Choose from 41 beautifully appointed rooms and suites at Mina Hotels, Old GRA, Port Harcourt.',
    images: [{ url: '/images/rooms/luxury-suite.jpg', width: 1200, height: 630, alt: 'Mina Hotels luxury suite' }],
  },
}

const CATEGORY_IMAGES: Record<string, string> = {
  standard: '/images/rooms/classic.jpg',
  deluxe: '/images/rooms/deluxe.jpg',
  royal: '/images/rooms/royal.jpg',
  executive: '/images/rooms/executive.jpg',
  'exclusive-suite': '/images/rooms/exclusive-suite.jpg',
  'luxury-suite': '/images/rooms/luxury-suite.jpg',
}

const CATEGORY_LABELS: Record<string, string> = {
  standard: 'Standard', deluxe: 'Deluxe', royal: 'Royal', executive: 'Executive',
  'exclusive-suite': 'Exclusive Suite', 'luxury-suite': 'Luxury Suite',
}

const CATEGORY_ORDER = ['standard', 'deluxe', 'royal', 'executive', 'exclusive-suite', 'luxury-suite']

interface ApiRoom {
  _id: string; category: string; name: string; pricePerNight: number;
  description: string; sizeM2?: number; bedType: string; maxOccupancy: number; amenities: string[];
  primaryImage?: string; images?: { url: string; isPrimary?: boolean }[];
}

function bedLabel(t: string) {
  const m: Record<string, string> = { single: 'Single Bed', double: 'Double Bed', queen: 'Queen Bed', king: 'King Bed', 'super-king': 'Super King Bed', twin: 'Twin Beds' }
  return m[t] || t
}

export const revalidate = 300

async function fetchAllRooms(): Promise<ApiRoom[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/rooms?isActive=true`, {
      next: { revalidate: 300 },
    })
    if (!res.ok) throw new Error('non-ok')
    const json = await res.json()
    return json.data || []
  } catch {
    return []
  }
}

export default async function RoomsPage() {
  const allRooms = await fetchAllRooms()

  const byCategory: Record<string, ApiRoom> = {}
  allRooms.forEach(r => { if (!byCategory[r.category]) byCategory[r.category] = r })

  const categories = CATEGORY_ORDER
    .filter(id => byCategory[id])
    .map(id => {
      const room = byCategory[id]
      return {
        id,
        apiId: room._id,
        img: room.primaryImage || room.images?.[0]?.url || CATEGORY_IMAGES[id] || '',
        category: CATEGORY_LABELS[id] || id,
        name: room.name,
        price: `₦${room.pricePerNight.toLocaleString()}`,
        priceNum: room.pricePerNight,
        size: room.sizeM2 ? `${room.sizeM2}m²` : '',
        bed: bedLabel(room.bedType),
        capacity: `${room.maxOccupancy} ${room.maxOccupancy === 1 ? 'Guest' : 'Guests'}`,
        desc: room.description,
        features: room.amenities || [],
      }
    })

  return (
    <main>
      {/* Hero */}
      <section
        className="relative flex items-end overflow-hidden"
        style={{ height: 'clamp(380px, 55vw, 580px)' }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1800&auto=format&fit=crop&q=85')" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(10,22,40,0.25) 0%, rgba(10,22,40,0.88) 100%)' }}
        />
        <div className="relative z-10 px-5 sm:px-8 md:px-12 pb-14 md:pb-22 pt-24">
          <p
            className="text-[10px] tracking-[0.3em] uppercase text-gold mb-3 font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Accommodation
          </p>
          <h1
            className="font-playfair text-white font-light leading-[1.05]"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(40px, 8vw, 88px)' }}
          >
            Rooms &amp;<br /><em className="italic">Suites</em>
          </h1>
        </div>
      </section>

      <BookingBar />

      {/* Intro */}
      <section className="px-5 sm:px-8 md:px-12 lg:px-16 py-12 md:py-16 bg-warm-white">
        <FadeIn>
          <p
            className="text-[14px] sm:text-[15px] leading-[1.85] text-gray-600 max-w-2xl font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Our forty one spacious ensuite rooms are elegantly furnished to suit every taste. Each room comes with air conditioning, refrigerator, satellite TV, and free Wi-Fi as standard — across all six categories.
          </p>
        </FadeIn>
      </section>

      {/* Room listings */}
      {categories.length === 0 && (
        <section className="px-5 sm:px-8 md:px-12 py-16 text-center bg-warm-white">
          <p className="text-[14px] text-gray-500 mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            No rooms available at the moment. Please contact us directly.
          </p>
          <a href="tel:+2348056155303" className="text-[#C9A84C] text-sm underline" style={{ fontFamily: "'Inter', sans-serif" }}>
            Call +234 805 615 5303
          </a>
        </section>
      )}
      {categories.map((room, i) => (
        <section
          key={room.id}
          id={room.id}
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ minHeight: 'clamp(400px, 60vw, 560px)', background: i % 2 === 0 ? '#FAFAFA' : '#F5F0E8' }}
        >
          {i % 2 === 0 ? (
            <>
              <div className="relative overflow-hidden group" style={{ minHeight: '280px' }}>
                <img
                  src={room.img}
                  alt={room.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <RoomContent room={room} />
            </>
          ) : (
            <>
              <div className="md:order-2 relative overflow-hidden group" style={{ minHeight: '280px' }}>
                <img
                  src={room.img}
                  alt={room.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="md:order-1"><RoomContent room={room} /></div>
            </>
          )}
        </section>
      ))}

      {/* CTA */}
      <section className="py-20 md:py-28 px-5 sm:px-8 md:px-12 text-center bg-navy">
        <FadeIn>
          <span
            className="block text-[10px] tracking-[0.28em] uppercase text-gold mb-4 font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Ready to Stay?
          </span>
          <h2
            className="font-playfair font-light text-white mb-4"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 5vw, 58px)' }}
          >
            Begin Your <em className="italic text-gold">Reservation</em>
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mb-6" />
          <p
            className="text-[14px] sm:text-[15px] leading-[1.85] text-white/50 max-w-lg mx-auto mb-8 font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Contact our team to check availability or arrange your ideal stay.
          </p>
          <div className="flex flex-col xs:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-block px-9 py-3.5 bg-gold text-navy text-[11px] tracking-[0.22em] uppercase font-semibold hover:bg-gold-light transition-colors no-underline font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Enquire Now
            </Link>
            <Link
              href="/contact"
              className="inline-block px-9 py-3.5 border border-white/30 text-white text-[11px] tracking-[0.22em] uppercase hover:border-gold hover:text-gold transition-all no-underline font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Send a Message
            </Link>
          </div>
        </FadeIn>
      </section>
    </main>
  )
}

type RoomDisplay = {
  id: string; apiId: string; img: string; category: string; name: string;
  price: string; priceNum: number; size: string; bed: string; capacity: string;
  desc: string; features: string[]
}

function RoomContent({ room }: { room: RoomDisplay }) {
  return (
    <FadeIn>
      <div className="flex flex-col justify-center py-12 sm:py-16 px-6 sm:px-10 md:px-[60px]">
        <span
          className="text-[10px] tracking-[0.3em] uppercase text-gold mb-3 font-inter"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {room.category}
        </span>
        <h2
          className="font-playfair font-light text-navy leading-[1.1] mb-4"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 52px)' }}
        >
          {room.name}
        </h2>
        <div className="w-16 h-0.5 bg-gold mb-6" />
        <p
          className="text-[13px] sm:text-[14px] leading-[1.85] text-gray-500 mb-6 max-w-[440px] font-inter"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {room.desc}
        </p>

        {/* Specs row */}
        <div className="flex gap-7 mb-6 pb-6 border-b border-gray-200 flex-wrap">
          {[
            { label: 'Size', val: room.size },
            { label: 'Bed', val: room.bed },
            { label: 'Capacity', val: room.capacity },
          ].map(s => (
            <div key={s.label}>
              <p
                className="text-[9px] tracking-[0.18em] uppercase text-gray-400 mb-0.5 font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {s.label}
              </p>
              <p
                className="text-[12px] sm:text-[13px] text-navy font-semibold font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {s.val}
              </p>
            </div>
          ))}
        </div>

        {/* Amenities with lucide-style dash */}
        <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 mb-8">
          {room.features.map(f => (
            <div key={f} className="flex items-center gap-2">
              <span className="w-4 h-px flex-shrink-0 bg-gold inline-block" />
              <span
                className="text-[11px] sm:text-[12px] text-gray-500 font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {f}
              </span>
            </div>
          ))}
        </div>

        {/* Price + Book */}
        <div className="flex flex-col xs:flex-row items-start xs:items-center gap-5">
          <div>
            <p
              className="text-[9px] tracking-[0.18em] uppercase text-gray-400 mb-0.5 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              From
            </p>
            <p
              className="font-playfair text-[30px] sm:text-[34px] font-light text-gold leading-none"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {room.price}
              <span className="text-[13px] text-gray-400 ml-1.5 font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                / night
              </span>
            </p>
          </div>
          <BookRoomButton room={{
            _id: room.apiId,
            id: room.apiId,
            category: room.category,
            name: room.name,
            pricePerNight: room.priceNum,
            price: room.price,
            img: room.img,
            description: room.desc,
            bedType: room.bed.toLowerCase().replace(' bed', '').replace(' ', '-'),
            maxOccupancy: room.priceNum > 0 ? parseInt(room.capacity) : 2,
            amenities: room.features,
            status: 'available' as const,
          }} />
        </div>
      </div>
    </FadeIn>
  )
}
