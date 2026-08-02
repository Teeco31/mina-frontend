import Link from 'next/link'
import FadeIn from '@/components/FadeIn'

export const metadata = {
  title: 'Events & Occasions — Mina Hotels',
  description: 'Host your corporate meetings, weddings, networking evenings, and seminars at Mina Hotels, Port Harcourt. Professional event spaces for up to 120 guests.',
}

const events = [
  {
    type: 'Business',
    title: 'Corporate Meetings & Conferences',
    desc: 'Versatile meeting rooms equipped with state-of-the-art presentation technology, high-speed internet, and dedicated breakout spaces. Our events team handles all logistics, from AV setup to catering, so you can focus on what matters.',
    capacity: 'Up to 120 guests',
    img: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=900&auto=format&fit=crop&q=85',
    features: ['Projectors & screens', 'High-speed Wi-Fi', 'Dedicated AV technician', 'Catering packages', 'Breakout rooms', 'On-site parking'],
  },
  {
    type: 'Celebrations',
    title: 'Weddings & Private Parties',
    desc: 'From intimate receptions to elaborate banquets, our events team brings every vision to life with meticulous attention to detail. We offer bespoke décor, curated menus, and dedicated coordination from planning to the final toast.',
    capacity: 'Up to 200 guests',
    img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=900&auto=format&fit=crop&q=85',
    features: ['Bespoke décor', 'Custom menus', 'Wedding coordination', 'Photography spaces', 'Honeymoon suite', 'Guest room packages'],
  },
  {
    type: 'Networking',
    title: 'Cocktail & Networking Evenings',
    desc: 'The Mina lounge is a natural gathering point for Port Harcourt\'s business community. Host your next networking event in an atmosphere that blends sophistication with warmth — complete with signature cocktails and light bites.',
    capacity: 'Up to 80 guests',
    img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&auto=format&fit=crop&q=85',
    features: ['Signature cocktail bar', 'Canapés & light bites', 'Background music', 'Lounge seating', 'Branded materials', 'Dedicated event host'],
  },
  {
    type: 'Training',
    title: 'Seminars & Workshops',
    desc: 'Purpose-built seminar halls with flexible seating arrangements, whiteboards, and full AV support — designed for productive professional development sessions. Catering and accommodation packages available for multi-day programmes.',
    capacity: 'Up to 60 guests',
    img: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=900&auto=format&fit=crop&q=85',
    features: ['Flexible seating', 'Whiteboards & flip charts', 'AV support', 'Stationery kits', 'Coffee & tea stations', 'Delegate accommodation rates'],
  },
]

export default function EventsPage() {
  return (
    <main>
      {/* Hero */}
      <section
        className="relative flex items-end pb-24 overflow-hidden"
        style={{ height: 'clamp(320px, 50vw, 540px)' }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=1800&auto=format&fit=crop&q=85')" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(10,22,40,0.25) 0%, rgba(10,22,40,0.88) 100%)' }}
        />
        <div className="relative z-10 px-5 sm:px-8 md:px-12 pt-24">
          <p
            className="text-[10px] tracking-[0.3em] uppercase text-gold mb-4 font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Gatherings
          </p>
          <h1
            className="font-playfair text-white font-light leading-[1.05]"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(48px, 6vw, 88px)' }}
          >
            Events &amp;<br /><em className="italic">Occasions</em>
          </h1>
        </div>
      </section>

      {/* Intro */}
      <section className="px-5 sm:px-8 md:px-12 lg:px-16 py-14 md:py-18 bg-warm-white">
        <FadeIn>
          <div className="max-w-2xl">
            <p
              className="text-[15px] leading-[1.85] text-gray-600 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Mina Hotels is Port Harcourt's premier event venue — a space where business milestones are celebrated, partnerships are forged, and memories are made. Our dedicated events team works with you from first enquiry to final guest departure, ensuring every occasion is executed flawlessly.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* Events listings */}
      {events.map((event, i) => (
        <section
          key={event.type}
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ minHeight: 'clamp(300px, 45vw, 560px)', background: i % 2 === 0 ? '#FAFAFA' : '#F5F0E8' }}
        >
          {i % 2 === 0 ? (
            <>
              <div className="relative overflow-hidden group">
                <img
                  src={event.img}
                  alt={event.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <EventContent event={event} />
            </>
          ) : (
            <>
              <EventContent event={event} />
              <div className="relative overflow-hidden group">
                <img
                  src={event.img}
                  alt={event.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
            </>
          )}
        </section>
      ))}

      {/* Why Mina */}
      <section className="px-5 sm:px-8 md:px-12 lg:px-16 py-16 md:py-24 bg-navy">
        <FadeIn>
          <div className="text-center mb-14">
            <span
              className="block text-[10px] tracking-[0.28em] uppercase text-gold mb-4 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Why Choose Mina
            </span>
            <h2
              className="font-playfair font-light text-white"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(36px, 4vw, 58px)' }}
            >
              The Mina <em className="italic text-gold">Difference</em>
            </h2>
            <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5">
          {[
            { title: 'Prime Location', desc: 'Situated in prestigious Old GRA, easily accessible from the Port Harcourt business district and international airport.' },
            { title: 'Expert Team', desc: 'Our dedicated events coordinators bring years of experience planning corporate and social events of all scales.' },
            { title: 'Full Catering', desc: 'From coffee breaks to elaborate banquets — our kitchen team crafts bespoke menus tailored to your occasion.' },
            { title: 'Accommodation', desc: 'Guests can stay on-site in our 41 premium rooms, with special rates available for event delegates.' },
          ].map(item => (
            <FadeIn key={item.title}>
              <div className="p-10 bg-navy hover:bg-white/5 transition-colors duration-300 h-full">
                <div className="w-8 h-px bg-gold mb-5" />
                <h4
                  className="text-[13px] tracking-[0.1em] uppercase text-white font-semibold mb-3 font-inter"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {item.title}
                </h4>
                <p
                  className="text-[13px] leading-[1.75] text-white/40 font-inter"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {item.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-5 sm:px-12 text-center bg-warm-white">
        <FadeIn>
          <span
            className="block text-[10px] tracking-[0.28em] uppercase text-gold mb-4 font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Plan Your Event
          </span>
          <h2
            className="font-playfair font-light text-navy mb-4"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(36px, 4vw, 58px)' }}
          >
            Let&apos;s Create Something <em className="italic text-gold">Memorable</em>
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mb-6" />
          <p
            className="text-[15px] leading-[1.85] text-gray-600 max-w-lg mx-auto mb-8 font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Reach out to our events team to discuss your requirements. We respond within the hour, every day.
          </p>
          <Link
            href="/contact"
            className="inline-block px-9 py-3.5 bg-gold text-navy text-[11px] tracking-[0.22em] uppercase font-semibold hover:bg-gold-light transition-colors no-underline font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Start Planning
          </Link>
        </FadeIn>
      </section>
    </main>
  )
}

function EventContent({ event }: { event: typeof events[0] }) {
  return (
    <FadeIn>
      <div className="flex flex-col justify-center py-14 sm:py-18 px-6 sm:px-10 md:px-[72px]">
        <span
          className="text-[10px] tracking-[0.3em] uppercase text-gold mb-3 font-inter"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {event.type}
        </span>
        <h2
          className="font-playfair font-light text-navy leading-[1.1] mb-4"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 3vw, 44px)' }}
        >
          {event.title}
        </h2>
        <div className="w-16 h-0.5 bg-gold mb-6" />
        <p
          className="text-[14px] leading-[1.85] text-gray-500 mb-4 max-w-[440px] font-inter"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {event.desc}
        </p>
        <p
          className="text-[11px] tracking-[0.16em] uppercase text-navy mb-6 font-inter"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <span className="text-gray-400">Capacity:</span> {event.capacity}
        </p>
        <div className="grid grid-cols-2 gap-2.5 mb-8">
          {event.features.map(f => (
            <div key={f} className="flex items-center gap-2">
              <span className="w-4 h-px flex-shrink-0 bg-gold inline-block" />
              <span
                className="text-[12px] text-gray-500 font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {f}
              </span>
            </div>
          ))}
        </div>
        <Link
          href="/contact"
          className="self-start inline-block px-8 py-3.5 bg-gold text-navy text-[11px] tracking-[0.22em] uppercase font-semibold hover:bg-gold-light transition-colors no-underline font-inter"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Enquire
        </Link>
      </div>
    </FadeIn>
  )
}
