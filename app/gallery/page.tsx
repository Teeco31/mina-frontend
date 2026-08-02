import FadeIn from '@/components/FadeIn'

export const metadata = {
  title: 'Gallery — Mina Hotels',
  description: 'Browse images of Mina Hotels — our rooms, restaurant, bar, event spaces, and the surrounding Old GRA neighbourhood in Port Harcourt.',
}

const galleries = [
  {
    category: 'Rooms & Suites',
    images: [
      { src: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&auto=format&fit=crop&q=80', alt: 'Standard Room' },
      { src: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=900&auto=format&fit=crop&q=80', alt: 'Deluxe Room' },
      { src: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=900&auto=format&fit=crop&q=80', alt: 'Royal Room' },
      { src: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=900&auto=format&fit=crop&q=80', alt: 'Executive Room' },
      { src: 'https://images.unsplash.com/photo-1606744824163-985d376605ef?w=900&auto=format&fit=crop&q=80', alt: 'Exclusive Suite' },
      { src: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=900&auto=format&fit=crop&q=80', alt: 'Luxury Suite' },
    ],
  },
  {
    category: 'Dining & Bar',
    images: [
      { src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&auto=format&fit=crop&q=80', alt: 'Restaurant' },
      { src: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=900&auto=format&fit=crop&q=80', alt: 'Dining' },
      { src: 'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=900&auto=format&fit=crop&q=80', alt: 'Bar Lounge' },
      { src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&auto=format&fit=crop&q=80', alt: 'Restaurant Interior' },
    ],
  },
  {
    category: 'Facilities',
    images: [
      { src: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=900&auto=format&fit=crop&q=80', alt: 'Hotel Lobby' },
      { src: 'https://images.unsplash.com/photo-1521783988139-89397d761dce?w=900&auto=format&fit=crop&q=80', alt: 'Fitness Centre' },
      { src: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=900&auto=format&fit=crop&q=80', alt: 'Wellness' },
      { src: 'https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=900&auto=format&fit=crop&q=80', alt: 'Pool Area' },
    ],
  },
  {
    category: 'Events & Exterior',
    images: [
      { src: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=900&auto=format&fit=crop&q=80', alt: 'Corporate Events' },
      { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=900&auto=format&fit=crop&q=80', alt: 'Weddings' },
      { src: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=900&auto=format&fit=crop&q=80', alt: 'Exterior' },
      { src: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=900&auto=format&fit=crop&q=80', alt: 'Hotel Building' },
    ],
  },
]

export default function GalleryPage() {
  return (
    <main>
      {/* Hero */}
      <section
        className="relative flex items-end pb-24 overflow-hidden"
        style={{ height: 'clamp(280px, 40vw, 460px)' }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1800&auto=format&fit=crop&q=85')" }}
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
            Visual Journey
          </p>
          <h1
            className="font-playfair text-white font-light leading-[1.05]"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(48px, 6vw, 88px)' }}
          >
            <em className="italic">Gallery</em>
          </h1>
        </div>
      </section>

      {/* Gallery Sections — masonry-style alternating bg */}
      {galleries.map((section, si) => (
        <section
          key={section.category}
          className="px-5 sm:px-8 md:px-12 lg:px-16 py-14 md:py-20"
          style={{ background: si % 2 === 0 ? '#FAFAFA' : '#F5F0E8' }}
        >
          <FadeIn>
            <div className="flex items-center gap-5 mb-10">
              <div className="w-16 h-0.5 bg-gold" />
              <h2
                className="font-playfair text-[26px] md:text-[30px] font-light text-navy tracking-[0.04em]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {section.category}
              </h2>
            </div>
          </FadeIn>

          {/* Masonry-style CSS columns grid */}
          <div className="columns-2 md:columns-3 gap-1 space-y-1">
            {section.images.map((img, i) => (
              <FadeIn key={i} delay={`${(i % 3) * 0.08}s`}>
                <div
                  className="relative overflow-hidden group cursor-pointer break-inside-avoid mb-1"
                  style={{ height: i % 3 === 0 ? 'clamp(240px, 35vw, 360px)' : 'clamp(180px, 25vw, 280px)' }}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Gold overlay on hover */}
                  <div
                    className="absolute inset-0 flex items-end p-5 opacity-0 group-hover:opacity-100 transition-all duration-400"
                    style={{ background: 'linear-gradient(to top, rgba(10,22,40,0.82) 0%, rgba(201,168,76,0.15) 60%)' }}
                  >
                    <span
                      className="text-[11px] tracking-[0.18em] uppercase text-white/85 font-inter"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {img.alt}
                    </span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>
      ))}
    </main>
  )
}
