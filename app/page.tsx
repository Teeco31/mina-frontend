import HomeContactForm from '@/components/HomeContactForm'
import HomeRoomsSection from '@/components/HomeRoomsSection'
import HomeReviewsSection from '@/components/HomeReviewsSection'
import Link from 'next/link'
import BookingBar from '@/components/BookingBar'
import FadeIn from '@/components/FadeIn'
import HeroSection from '@/components/HeroSection'

export default async function HomePage() {
  const amenities = [
    { icon: <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>, title: '24h Front Desk', desc: 'Our reception team is available around the clock for any request or assistance.' },
    { icon: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></>, title: 'Concierge', desc: 'From restaurant reservations to city tours, our team anticipates your every need.' },
    { icon: <><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></>, title: 'Business Centre', desc: 'Fully equipped workspace with printing, conferencing, and high-speed internet.' },
    { icon: <><path d="M5 12.55a11 11 0 0114.08 0" /><path d="M1.42 9a16 16 0 0121.16 0" /><path d="M8.53 16.11a6 6 0 016.95 0" /><circle cx="12" cy="20" r="1" /></>, title: 'Free Wi-Fi', desc: 'Complimentary high-speed internet throughout all rooms and common areas.' },
    { icon: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />, title: 'Fitness Centre', desc: 'Keep your routine with our well-equipped gym open to all guests.' },
    { icon: <><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></>, title: 'Shuttle Service', desc: 'Airport and city transfers arranged on request.' },
    { icon: <><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /></>, title: 'Dry Cleaning', desc: 'Express laundry and dry cleaning services available for a prompt turnaround.' },
    { icon: <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></>, title: 'Secure Parking', desc: 'Private on-site parking available to all guests at no additional charge.' },
  ]

  const galleryImages = [
    { src: '/images/gallery/exterior.jpg', alt: 'Hotel exterior' },
    { src: '/images/gallery/room.jpg', alt: 'Bedroom' },
    { src: '/images/gallery/room1.jpg', alt: 'Dining' },
    { src: '/images/gallery/room.png', alt: 'Spa' },
    { src: '/images/gallery/winebar.jpg', alt: 'Bar lounge' },
    { src: '/images/gallery/gym.jpg', alt: 'gym' },
    { src: '/images/gallery/onebar.jpg', alt: 'Gym' },
    { src: '/images/gallery/room2.jpg', alt: 'Exterior' },
    { src: '/images/gallery/couch.jpg', alt: 'Pool' },
    { src: '/images/gallery/bar.png', alt: 'Restaurant' },
    { src: '/images/gallery/onebar1.jpg', alt: 'Restaurant' },
  ]

  return (
    <main>
      {/* ── HERO (client component with GSAP) ── */}
      <HeroSection />

      {/* ── BOOKING BAR ── */}
      <BookingBar />

      {/* ── ABOUT ── */}
      <section id="about" className="px-5 sm:px-8 md:px-12 lg:px-16 py-20 md:py-28 bg-warm-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-24 items-center max-w-[1400px] mx-auto">
          <FadeIn>
            <div className="relative">
              <img
                src="/images/hero/pix.png"
                alt="Mina Hotels exterior"
                className="w-full object-cover shadow-lg"
                style={{ height: 'clamp(320px, 50vw, 560px)' }}
                loading="lazy"
              />
              {/* Gold accent badge */}
              <div
                className="absolute flex flex-col items-center justify-center text-center bg-gold shadow-lg"
                style={{ bottom: '-20px', right: '-16px', width: '110px', height: '110px' }}
              >
                <span
                  className="text-[36px] font-light text-navy leading-none font-playfair"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  41
                </span>
                <span
                  className="text-[8px] tracking-[0.18em] uppercase text-navy/80 mt-1 font-inter"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Ensuite Rooms
                </span>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay="0.15s">
            <span
              className="block text-[10px] tracking-[0.28em] uppercase text-gold mb-4 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Our Story
            </span>
            <h2
              className="font-playfair font-light leading-[1.12] text-navy mb-4"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 5vw, 58px)' }}
            >
              A Boutique Icon<br />in the <em className="italic text-gold">Heart of PH</em>
            </h2>
            <div className="w-16 h-0.5 bg-gold mb-6" />
            <p
              className="text-[14px] sm:text-[15px] leading-[1.85] text-gray-600 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Nestled in the serene surroundings of Old GRA, Mina Hotels is within walking distance of the Port Harcourt Club's 18-hole golf course and minutes from the city's main business district.
            </p>
            <p
              className="text-[14px] sm:text-[15px] leading-[1.85] text-gray-600 mt-4 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Whether you visit for business or leisure, every detail at Mina — from our award-winning kitchen to our attentive concierge team — is crafted to make you feel like a true mover and shaker.
            </p>
            <div className="flex gap-10 mt-10">
              {[
                { num: '41', label: 'Rooms & Suites' },
                { num: '6', label: 'Room Categories' },
                { num: '24h', label: 'Front Desk' },
              ].map(stat => (
                <div key={stat.label}>
                  <div
                    className="text-[36px] sm:text-[40px] font-light text-navy leading-none font-playfair"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {stat.num}
                  </div>
                  <div
                    className="text-[9px] sm:text-[10px] tracking-[0.18em] uppercase text-gray-500 mt-1.5 font-inter"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── ROOMS ── */}
      <section id="rooms" className="px-5 sm:px-8 md:px-12 lg:px-16 py-20 md:py-28 bg-cream">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5 mb-12 md:mb-16">
          <FadeIn>
            <span
              className="block text-[10px] tracking-[0.28em] uppercase text-gold mb-3 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Accommodation
            </span>
            <h2
              className="font-playfair font-light text-navy leading-[1.12]"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 5vw, 58px)' }}
            >
              Our <em className="italic text-gold">Rooms</em>
            </h2>
            <div className="w-16 h-0.5 bg-gold mt-4" />
          </FadeIn>
          <FadeIn delay="0.1s">
            <Link
              href="/rooms"
              className="inline-block px-8 py-3.5 bg-navy text-white text-[11px] tracking-[0.22em] uppercase hover:bg-navy/80 transition-colors no-underline whitespace-nowrap flex-shrink-0 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              View All Rooms
            </Link>
          </FadeIn>
        </div>
        <HomeRoomsSection />
      </section>

      {/* ── AMENITIES ── */}
      <section className="px-5 sm:px-8 md:px-12 lg:px-16 py-20 md:py-28 bg-navy">
        <FadeIn>
          <div className="text-center max-w-[560px] mx-auto mb-14 md:mb-18">
            <span
              className="block text-[10px] tracking-[0.28em] uppercase text-gold mb-4 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Facilities
            </span>
            <h2
              className="font-playfair font-light leading-[1.12] text-white"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 5vw, 58px)' }}
            >
              Everything You<br /><em className="italic text-gold">Need &amp; More</em>
            </h2>
            <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 mt-14 border-t border-white/[0.06]">
          {amenities.map((a, i) => (
            <FadeIn key={a.title} delay={`${(i % 4) * 0.07}s`}>
              <div className="flex items-start gap-5 py-7 px-2 sm:px-4 border-b border-white/[0.06] hover:bg-white/[0.03] transition-colors duration-300 group">
                <span
                  className="text-[10px] tracking-[0.2em] text-gold/40 pt-[3px] font-inter flex-shrink-0 w-7"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="rgba(201,168,76,0.65)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-[2px]">
                  {a.icon}
                </svg>
                <div>
                  <h3
                    className="text-[11px] sm:text-[12px] tracking-[0.1em] uppercase text-white font-semibold mb-1.5 font-inter"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {a.title}
                  </h3>
                  <p
                    className="text-[12px] sm:text-[13px] leading-[1.7] text-white/35 font-inter"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {a.desc}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── DINING ── */}
      <section id="dining" className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ minHeight: 'clamp(400px, 60vw, 600px)' }}>
          <div className="relative overflow-hidden group" style={{ minHeight: '280px' }}>
            <img
              src="/images/gallery/food.jpg"
              alt="Mina restaurant"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
          </div>
          <FadeIn>
            <div
              className="flex flex-col justify-center py-14 sm:py-20 px-6 sm:px-10 md:px-[72px] bg-warm-white"
            >
              <span
                className="block text-[10px] tracking-[0.28em] uppercase text-gold mb-4 font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Eat &amp; Drink
              </span>
              <h2
                className="font-playfair font-light leading-[1.12] text-navy mb-4"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(30px, 5vw, 58px)' }}
              >
                The Mina<br /><em className="italic text-gold">Table</em>
              </h2>
              <div className="w-16 h-0.5 bg-gold mb-7" />
              <p
                className="text-[14px] sm:text-[15px] leading-[1.85] text-gray-600 font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Our kitchen brings together the richness of West African cuisine with the best of continental dining. The bar and lounge is the city's favourite spot to unwind after a long day.
              </p>
              <div className="mt-8 flex flex-col gap-4">
                {[
                  { num: '01', title: 'African & Continental Menu', desc: 'Fresh, seasonal dishes prepared daily.' },
                  { num: '02', title: 'Complimentary Breakfast', desc: 'All guests enjoy a full breakfast every morning.' },
                  { num: '03', title: 'Bar & Lounge', desc: 'Curated cocktails and a relaxed atmosphere.' },
                  { num: '04', title: 'In-Room Dining', desc: 'Full menu available via room service.' },
                ].map((f, i, arr) => (
                  <div key={f.num} className={`flex gap-4 items-start pb-4 ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
                    <span
                      className="text-[16px] font-light text-gold min-w-[28px] font-playfair"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {f.num}
                    </span>
                    <div>
                      <h4
                        className="text-[12px] sm:text-[13px] tracking-[0.08em] uppercase text-navy font-semibold mb-0.5 font-inter"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {f.title}
                      </h4>
                      <p
                        className="text-[12px] sm:text-[13px] leading-[1.7] text-gray-500 font-inter"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {f.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/dining"
                className="mt-8 self-start inline-block px-8 py-3.5 bg-gold text-navy text-[11px] tracking-[0.22em] uppercase font-semibold hover:bg-gold-light transition-colors no-underline font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Explore Dining
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── EVENTS ── */}
      <section id="events" className="px-5 sm:px-8 md:px-12 lg:px-16 py-20 md:py-28 bg-cream">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5 mb-12 md:mb-16">
          <FadeIn>
            <span
              className="block text-[10px] tracking-[0.28em] uppercase text-gold mb-3 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Gatherings
            </span>
            <h2
              className="font-playfair font-light text-navy leading-[1.12]"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 5vw, 58px)' }}
            >
              Events &amp; <em className="italic text-gold">Occasions</em>
            </h2>
            <div className="w-16 h-0.5 bg-gold mt-4" />
          </FadeIn>
          <FadeIn delay="0.1s">
            <Link
              href="/events"
              className="inline-block px-8 py-3.5 bg-gold text-navy text-[11px] tracking-[0.22em] uppercase font-semibold hover:bg-gold-light transition-colors no-underline flex-shrink-0 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Plan an Event
            </Link>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
          {[
            { type: 'Business', title: 'Corporate Meetings & Conferences', desc: 'Versatile rooms with presentation tech for up to 120 guests.', img: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&auto=format&fit=crop&q=80', delay: '0s' },
            { type: 'Celebrations', title: 'Weddings & Private Parties', desc: 'From intimate receptions to elaborate banquets.', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80', delay: '0.1s' },
            { type: 'Networking', title: 'Cocktail & Networking Evenings', desc: "The Mina lounge — PH's favourite business gathering point.", img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80', delay: '0.2s' },
            { type: 'Training', title: 'Seminars & Workshops', desc: 'Purpose-built halls with AV support and catering.', img: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop&q=80', delay: '0.3s' },
          ].map(event => (
            <FadeIn key={event.type} delay={event.delay}>
              <div className="group relative overflow-hidden cursor-pointer" style={{ aspectRatio: '4/3' }}>
                <img
                  src={event.img}
                  alt={event.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <div
                    className="text-[9px] tracking-[0.26em] uppercase text-gold mb-2 font-inter"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {event.type}
                  </div>
                  <h3
                    className="text-[20px] sm:text-[22px] font-light text-white leading-[1.2] mb-3 font-playfair"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {event.title}
                  </h3>
                  <p
                    className="text-[12px] sm:text-[13px] leading-[1.6] text-white/60 mb-4 hidden sm:block font-inter"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {event.desc}
                  </p>
                  <Link
                    href="/events"
                    className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-gold no-underline border-b border-gold/40 pb-0.5 hover:border-gold transition-colors font-inter"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Enquire
                  </Link>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section className="p-0">
        <div className="flex items-center justify-between px-5 sm:px-8 md:px-12 lg:px-16 py-8 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-6 h-px bg-gold/60" />
            <span
              className="text-[10px] tracking-[0.28em] uppercase text-gold font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Gallery
            </span>
          </div>
          <span
            className="text-[12px] text-gray-400 font-inter tracking-[0.06em]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Spaces &amp; Experiences
          </span>
        </div>
        <div className="gallery-grid">
          {galleryImages.map((img, i) => (
            <div key={i} className="gallery-item relative overflow-hidden cursor-pointer group">
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              {/* Gold overlay on hover */}
              <div className="gallery-overlay absolute inset-0 bg-gold/20 flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-white flex items-center justify-center">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="white" strokeWidth="2">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── LOYALTY ── */}
      <section className="py-20 md:py-28 px-5 sm:px-8 md:px-12 lg:px-16 text-center bg-navy">
        <FadeIn>
          <span
            className="block text-[10px] tracking-[0.28em] uppercase text-gold mb-4 font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Rewards
          </span>
          <h2
            className="font-playfair font-light leading-[1.12] text-white mb-4"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 5vw, 58px)' }}
          >
            Mina <em className="italic text-gold">Loyalty Programme</em>
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mb-6" />
          <p
            className="text-[14px] sm:text-[15px] leading-[1.85] text-white/55 text-center max-w-[540px] mx-auto mb-8 font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Join thousands of guests who earn points, enjoy exclusive benefits, and experience Mina Hotels at a deeper level — every single stay.
          </p>
          <Link
            href="/loyalty"
            className="inline-block px-9 py-3.5 bg-gold text-navy text-[11px] tracking-[0.22em] uppercase font-semibold hover:bg-gold-light transition-colors no-underline font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Join Mina Rewards
          </Link>
        </FadeIn>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-14 md:mt-18">
          {[
            { name: 'Classic', desc: 'For first-time and occasional guests.', perks: ['Points per night', 'Member rates', 'Priority check-in'], featured: false },
            { name: 'Gold', desc: 'For returning guests — more benefits.', perks: ['2x points multiplier', 'Complimentary upgrade', 'Late checkout', 'Welcome amenity'], featured: true },
            { name: 'Prestige', desc: 'Our most loyal members, no exceptions.', perks: ['3x points multiplier', 'Guaranteed suite upgrade', 'Dedicated host', 'Airport transfer', 'Annual dining credit'], featured: false },
          ].map(tier => (
            <div
              key={tier.name}
              className="flex-1 sm:max-w-[260px] p-8 md:p-10 text-left border transition-all hover:border-gold-light"
              style={{
                border: tier.featured ? '1px solid #C9A84C' : '1px solid rgba(255,255,255,0.1)',
                background: tier.featured ? '#C9A84C' : 'transparent',
              }}
            >
              <div
                className="text-[26px] sm:text-[28px] font-light mb-2 font-playfair"
                style={{ fontFamily: "'Playfair Display', serif", color: tier.featured ? '#0A1628' : '#fff' }}
              >
                {tier.name}
              </div>
              <p
                className="text-[13px] leading-[1.7] mb-5 pb-5 border-b font-inter"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  color: tier.featured ? 'rgba(10,22,40,0.65)' : 'rgba(255,255,255,0.5)',
                  borderColor: tier.featured ? 'rgba(10,22,40,0.15)' : 'rgba(255,255,255,0.1)',
                }}
              >
                {tier.desc}
              </p>
              <ul className="flex flex-col gap-2 list-none">
                {tier.perks.map(perk => (
                  <li
                    key={perk}
                    className="flex items-center gap-2.5 text-[12px] font-inter"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      color: tier.featured ? 'rgba(10,22,40,0.75)' : 'rgba(255,255,255,0.65)',
                    }}
                  >
                    <span
                      className="w-4 h-px flex-shrink-0 inline-block"
                      style={{ background: tier.featured ? 'rgba(10,22,40,0.4)' : 'rgba(201,168,76,0.6)' }}
                    />
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="px-5 sm:px-8 md:px-12 lg:px-16 py-20 md:py-28 bg-warm-white">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
          <FadeIn>
            <span
              className="block text-[10px] tracking-[0.28em] uppercase text-gold mb-3 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Guest Reviews
            </span>
            <h2
              className="font-playfair font-light text-navy leading-[1.12]"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 5vw, 52px)' }}
            >
              What Our <em className="italic text-gold">Guests Say</em>
            </h2>
          </FadeIn>
          <FadeIn delay="0.1s">
            <p
              className="text-[13px] leading-[1.85] text-gray-500 max-w-[340px] font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Unfiltered experiences from the guests who know Mina Hotels best.
            </p>
          </FadeIn>
        </div>
        <HomeReviewsSection />
      </section>

      {/* ── LOCATION ── */}
      <section id="location" className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative" style={{ minHeight: '360px' }}>
            <iframe
              title="Mina Hotels location"
              src="https://maps.google.com/maps?q=23+Igbodo+Street,+Old+GRA,+Port+Harcourt,+Rivers+State,+Nigeria&output=embed&z=16"
              className="absolute inset-0 w-full h-full border-0"
              loading="lazy"
              allowFullScreen
            />
          </div>
          <FadeIn>
            <div className="flex flex-col justify-center py-14 sm:py-18 px-6 sm:px-10 md:px-[72px] bg-cream">
              <span
                className="block text-[10px] tracking-[0.28em] uppercase text-gold mb-4 font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Find Us
              </span>
              <h2
                className="font-playfair font-light leading-[1.12] text-navy mb-4"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(30px, 5vw, 58px)' }}
              >
                Where to<br /><em className="italic text-gold">Find Mina</em>
              </h2>
              <div className="w-16 h-0.5 bg-gold mb-8" />
              <div className="flex flex-col gap-6">
                {[
                  { icon: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></>, title: 'Address', content: '23 Igbodo Street, Old GRA\nPort Harcourt, Rivers State, Nigeria' },
                  { icon: <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013 9.79a19.79 19.79 0 01-3.07-8.67A2 2 0 011.92 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />, title: 'Phone', content: '+234 805 615 5303' },
                  { icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></>, title: 'Email', content: 'info@mina-hotels.com' },
                  { icon: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>, title: 'Check-in / Check-out', content: 'Check-in from 3:00 PM\nCheck-out by 11:00 AM' },
                ].map(d => (
                  <div key={d.title} className="flex gap-4 items-start">
                    <div className="w-9 h-9 border border-gold/40 flex items-center justify-center flex-shrink-0 mt-0.5 bg-white">
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#C9A84C" strokeWidth="1.5">{d.icon}</svg>
                    </div>
                    <div>
                      <h4
                        className="text-[10px] tracking-[0.14em] uppercase text-gray-400 mb-1 font-inter"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {d.title}
                      </h4>
                      <p
                        className="text-[13px] sm:text-[14px] text-navy leading-[1.65] font-inter"
                        style={{ whiteSpace: 'pre-line', fontFamily: "'Inter', sans-serif" }}
                      >
                        {d.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section
        id="contact"
        className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 py-20 md:py-28 px-5 sm:px-8 md:px-12 lg:px-20 bg-navy"
      >
        <FadeIn>
          <span
            className="block text-[10px] tracking-[0.28em] uppercase text-gold mb-4 font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Get in Touch
          </span>
          <h2
            className="font-playfair font-light leading-[1.12] text-white mb-4"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(30px, 5vw, 58px)' }}
          >
            Reserve or<br /><em className="italic text-gold">Enquire</em>
          </h2>
          <div className="w-16 h-0.5 bg-gold mb-7" />
          <p
            className="text-[14px] sm:text-[15px] leading-[1.85] text-white/50 max-w-[540px] font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Whether you wish to book a stay, plan an event, or simply have a question, our team is ready to assist. Reach out and we will respond within the hour.
          </p>
        </FadeIn>
        <HomeContactForm />
      </section>
    </main>
  )
}
