import Link from 'next/link'
import FadeIn from './FadeIn'

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

interface ApiRoom { _id: string; category: string; name: string; pricePerNight: number; description: string; primaryImage?: string; images?: { url: string; isPrimary?: boolean }[] }

async function fetchPreviewRooms(): Promise<ApiRoom[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/rooms?isActive=true`,
      { next: { revalidate: 300 } }
    )
    if (!res.ok) throw new Error('non-ok')
    const json = await res.json()
    return json.data || []
  } catch {
    return []
  }
}

export default async function HomeRoomsSection() {
  const apiRooms = await fetchPreviewRooms()

  const byCategory: Record<string, ApiRoom> = {}
  apiRooms.forEach(r => { if (!byCategory[r.category]) byCategory[r.category] = r })

  // Exactly 3 cards — hardcoded so new categories never auto-appear here
  const PREVIEW_ORDER = ['standard', 'deluxe', 'royal']
  const previewCards = PREVIEW_ORDER
    .filter(cat => byCategory[cat])
    .map(cat => {
      const r = byCategory[cat]
      return {
        id: cat,
        tag: CATEGORY_LABELS[cat] || cat,
        name: r.name,
        price: `₦${r.pricePerNight.toLocaleString()}`,
        img: r.primaryImage || r.images?.[0]?.url || CATEGORY_IMAGES[cat] || '',
      }
    })

  const suite = byCategory['luxury-suite']
  const suiteData = suite ? {
    name: suite.name,
    price: `₦${suite.pricePerNight.toLocaleString()}`,
    desc: suite.description,
    img: suite.primaryImage || suite.images?.[0]?.url || CATEGORY_IMAGES['luxury-suite'] || '',
  } : null

  if (previewCards.length === 0 && !suiteData) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
          No rooms available at the moment. Please contact us directly.
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Preview cards — zoom on hover, price in gold, Book Now slides in */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
        {previewCards.map(room => (
          <FadeIn key={room.id}>
            <div
              className="room-card relative overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-shadow duration-500"
              style={{ height: '340px' }}
            >
              <img
                src={room.img}
                alt={room.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              {/* Dark gradient */}
              <div
                className="absolute inset-0 flex flex-col justify-end p-6 transition-all duration-300"
                style={{ background: 'linear-gradient(to top, rgba(10,22,40,0.95) 0%, transparent 55%)' }}
              >
                <span
                  className="text-[9px] tracking-[0.26em] uppercase mb-1.5 text-gold font-inter"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {room.tag}
                </span>
                <h3
                  className="text-[24px] font-light text-white leading-[1.2] mb-3 font-playfair"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {room.name}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="text-[13px] text-white/65 font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <strong
                      className="text-[20px] font-playfair font-light text-gold"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {room.price}
                    </strong>{' '}
                    / night
                  </div>
                  <Link
                    href={`/rooms#${room.id}`}
                    className="room-book-btn text-[9px] tracking-[0.2em] uppercase no-underline pb-0.5 border-b border-gold/50 text-gold hover:border-gold transition-colors font-inter"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      {/* Featured luxury suite — full width */}
      {suiteData && (
        <FadeIn delay="0.15s">
          <div
            className="relative overflow-hidden cursor-pointer group mt-1 shadow-lg"
            style={{ height: 'clamp(320px, 40vw, 500px)' }}
          >
            <img
              src={suiteData.img}
              alt={suiteData.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div
              className="absolute inset-0 flex items-end sm:items-center p-6 sm:px-14 md:px-18"
              style={{ background: 'linear-gradient(to top, rgba(10,22,40,0.92) 0%, transparent 60%)' }}
            >
              <div className="max-w-[480px]">
                <span
                  className="block text-[9px] tracking-[0.3em] uppercase mb-3 text-gold font-inter"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Our Finest
                </span>
                <h2
                  className="font-playfair font-light text-white leading-[1.1] mb-3"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 5vw, 52px)' }}
                >
                  {suiteData.name}
                </h2>
                <p
                  className="text-[13px] sm:text-[14px] leading-[1.75] text-white/65 mb-4 hidden sm:block font-inter"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {suiteData.desc}
                </p>
                <p className="text-white/55 text-[13px] mb-5 font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                  From{' '}
                  <span
                    className="font-playfair text-[24px] text-gold font-light"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {suiteData.price}
                  </span>
                  {' '}/ night
                </p>
                <Link
                  href="/rooms#luxury-suite"
                  className="inline-block px-7 sm:px-9 py-3 sm:py-3.5 bg-gold text-navy text-[11px] tracking-[0.22em] uppercase font-semibold hover:bg-gold-light transition-colors no-underline font-inter"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Reserve This Suite
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      )}

      {/* View all rooms CTA */}
      <FadeIn delay="0.1s">
        <div className="flex justify-center mt-10">
          <Link
            href="/rooms"
            className="inline-block px-10 py-3.5 border border-gold/50 text-gold text-[11px] tracking-[0.22em] uppercase font-semibold hover:bg-gold hover:text-navy transition-colors no-underline font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            View All Rooms
          </Link>
        </div>
      </FadeIn>
    </>
  )
}
