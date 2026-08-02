import Link from 'next/link'
import FadeIn from '@/components/FadeIn'

export const metadata = {
  title: 'Dining — Mina Hotels',
  description: 'Experience the richness of West African cuisine and continental dining at The Mina Table. Complimentary breakfast, a vibrant bar & lounge, and in-room dining.',
}

const FALLBACK_COCKTAILS = [
  { _id: '1', name: 'Old GRA Sour', description: 'Bourbon, fresh lemon, egg white & a dash of bitters' },
  { _id: '2', name: 'Mina Mule', description: 'Premium vodka, ginger beer, lime & fresh mint' },
  { _id: '3', name: 'PH Negroni', description: 'Gin, Campari, sweet vermouth & a twist of orange' },
  { _id: '4', name: 'Garden Spritz', description: 'Aperol, prosecco, cucumber & elderflower' },
]

async function getCocktails() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cocktails`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return FALLBACK_COCKTAILS
    const json = await res.json()
    const data = json.data as { _id: string; name: string; description: string }[]
    return data?.length ? data : FALLBACK_COCKTAILS
  } catch {
    return FALLBACK_COCKTAILS

  }
}

export default async function DiningPage() {
  const cocktails = await getCocktails()
  return (
    <main>
      {/* Hero */}
      <section
        className="relative flex items-end pb-24 overflow-hidden"
        style={{ height: 'clamp(320px, 50vw, 540px)' }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&auto=format&fit=crop&q=85')" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(10,22,40,0.2) 0%, rgba(10,22,40,0.88) 100%)' }}
        />
        <div className="relative z-10 px-5 sm:px-8 md:px-12 pt-24">
          <p
            className="text-[10px] tracking-[0.3em] uppercase text-gold mb-4 font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Eat &amp; Drink
          </p>
          <h1
            className="font-playfair text-white font-light leading-[1.05]"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(48px, 6vw, 88px)' }}
          >
            The Mina<br /><em className="italic">Table</em>
          </h1>
        </div>
      </section>

      {/* Philosophy — split layout */}
      <section className="grid grid-cols-1 md:grid-cols-2" style={{ minHeight: '560px' }}>
        <div className="relative overflow-hidden group">
          <img
            src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=900&auto=format&fit=crop&q=85"
            alt="Mina restaurant interior"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        </div>
        <FadeIn>
          <div className="flex flex-col justify-center py-16 sm:py-22 px-6 sm:px-10 md:px-[72px] bg-warm-white">
            <span
              className="block text-[10px] tracking-[0.28em] uppercase text-gold mb-4 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Our Philosophy
            </span>
            <h2
              className="font-playfair font-light leading-[1.12] text-navy mb-4"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 3.5vw, 52px)' }}
            >
              Where Flavour<br />Meets <em className="italic text-gold">Tradition</em>
            </h2>
            <div className="w-16 h-0.5 bg-gold mb-7" />
            <p
              className="text-[15px] leading-[1.85] text-gray-600 max-w-[480px] font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              At Mina Hotels, dining is not an afterthought — it is a centrepiece. Our kitchen team, led by seasoned chefs with a passion for West African and continental cuisine, crafts every dish with intention and care.
            </p>
            <p
              className="text-[15px] leading-[1.85] text-gray-600 max-w-[480px] mt-4 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              From the morning buffet to late-evening room service, every meal at Mina is designed to nourish, impress, and linger in memory.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* Dining Offerings */}
      <section className="px-5 sm:px-8 md:px-12 lg:px-16 py-16 md:py-24 bg-cream">
        <FadeIn>
          <div className="text-center mb-14 md:mb-18">
            <span
              className="block text-[10px] tracking-[0.28em] uppercase text-gold mb-4 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              What We Offer
            </span>
            <h2
              className="font-playfair font-light text-navy"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(36px, 4vw, 58px)' }}
            >
              Every Craving, <em className="italic text-gold">Covered</em>
            </h2>
            <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
          </div>
        </FadeIn>

        <div className="grid grid-cols-2 gap-1">
          {[
            {
              title: 'African & Continental Restaurant',
              tag: '01',
              img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&auto=format&fit=crop&q=80',
              desc: 'Our main restaurant is a celebration of West African flavours alongside the finest continental dishes. Think perfectly spiced jollof rice, fresh seafood from Rivers State waters, and international staples crafted with local love. The restaurant serves breakfast, lunch, and dinner daily.',
              hours: 'Open Daily: 6:30 AM – 10:30 PM',
            },
            {
              title: 'Complimentary Breakfast',
              tag: '02',
              img: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=700&auto=format&fit=crop&q=80',
              desc: 'All hotel guests enjoy a complimentary full breakfast every morning — a generous spread featuring eggs cooked to order, fresh tropical fruits, pastries, Nigerian dishes, and a selection of hot and cold beverages. Start every day at Mina the right way.',
              hours: 'For Hotel Guests: 6:30 AM – 10:00 AM',
            },
            {
              title: 'Bar & Lounge',
              tag: '03',
              img: '/images/gallery/bar.png',
              desc: "One Bar has become Port Harcourt's favourite gathering spot for the city's movers and shakers. Curated cocktails, premium Nigerian and imported spirits, fine wines, and a relaxed yet sophisticated atmosphere.",
              hours: 'Open Daily: 11:00 AM – 12:00 AM',
            },
            {
              title: 'In-Room Dining',
              tag: '04',
              img: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=700&auto=format&fit=crop&q=80',
              desc: 'Enjoy the full Mina dining experience without leaving the comfort of your room. Our complete restaurant menu is available via in-room dining throughout the day and evening.',
              hours: 'Available: 6:30 AM – 10:30 PM',
            },
          ].map((item, i) => (
            <FadeIn key={item.tag} delay={`${(i % 2) * 0.12}s`}>
              <div
                className="relative group overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500"
                style={{ height: 'clamp(260px, 35vw, 460px)' }}
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0 flex flex-col justify-end p-8 md:p-10"
                  style={{ background: 'linear-gradient(to top, rgba(10,22,40,0.95) 0%, rgba(10,22,40,0.1) 55%)' }}
                >
                  <span
                    className="font-playfair text-[18px] font-light text-gold mb-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {item.tag}
                  </span>
                  <h3
                    className="font-playfair text-[22px] md:text-[26px] font-normal text-white leading-[1.2] mb-3"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-[13px] leading-[1.7] text-white/60 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden sm:block font-inter"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {item.desc}
                  </p>
                  <p
                    className="text-[10px] tracking-[0.18em] uppercase text-gold font-inter"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {item.hours}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Bar Highlight */}
      <section className="grid grid-cols-1 md:grid-cols-2" style={{ minHeight: 'clamp(280px, 40vw, 520px)' }}>
        <FadeIn>
          <div className="flex flex-col justify-center py-16 sm:py-22 px-6 sm:px-10 md:px-[72px] bg-navy">
            <span
              className="block text-[10px] tracking-[0.28em] uppercase text-gold mb-4 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Signature Cocktails
            </span>
            <h2
              className="font-playfair font-light leading-[1.12] text-white mb-4"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 3.5vw, 52px)' }}
            >
              One<em className="italic text-gold">Bar</em>
            </h2>
            <div className="w-16 h-0.5 bg-gold mb-8" />
            <div className="flex flex-col gap-5">
              {cocktails.map((cocktail, i, arr) => (
                <div key={cocktail._id} className={`pb-5 ${i < arr.length - 1 ? 'border-b border-white/8' : ''}`}>
                  <h4
                    className="text-[14px] text-white font-semibold mb-1 font-inter"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {cocktail.name}
                  </h4>
                  <p
                    className="text-[13px] leading-[1.65] text-white/40 font-inter"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {cocktail.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
        <div className="relative overflow-hidden group">
          <img
            src="/images/gallery/onebar.jpg"
            alt="Mina bar"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-5 sm:px-12 text-center bg-warm-white">
        <FadeIn>
          <h2
            className="font-playfair font-light text-navy mb-4"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 3.5vw, 52px)' }}
          >
            Make a <em className="italic text-gold">Reservation</em>
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mb-6" />
          <p
            className="text-[15px] leading-[1.85] text-gray-600 max-w-md mx-auto mb-8 font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            For group dining, private events, or to book the restaurant exclusively, contact our team.
          </p>
          <Link
            href="/contact"
            className="inline-block px-9 py-3.5 bg-gold text-navy text-[11px] tracking-[0.22em] uppercase font-semibold hover:bg-gold-light transition-colors no-underline font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Enquire About Dining
          </Link>
        </FadeIn>
      </section>
    </main>
  )
}
