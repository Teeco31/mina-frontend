import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  const navLinks = [
    { href: '/#about', label: 'About Us' },
    { href: '/rooms', label: 'Rooms & Suites' },
    { href: '/dining', label: 'Eat & Drink' },
    { href: '/events', label: 'Events' },
    { href: '/contact', label: 'Contact' },
  ]
  const services = [
    { label: 'Loyalty Programme', href: '/loyalty' },
    { label: 'Airport Shuttle', href: '/contact' },
    { label: 'Corporate Stays', href: '/contact' },
    { label: 'Event Planning', href: '/contact' },
    { label: 'Gift Vouchers', href: '/contact' },
  ]
  const policies = [
    { label: 'Cancellation Policy', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms & Conditions', href: '/loyalty/terms' },
    { label: 'Cookie Policy', href: '#' },
  ]

  return (
    <footer style={{ background: '#060E1C', fontFamily: "'Inter', sans-serif" }}>
      {/* Gold top divider */}
      <div className="w-full h-px bg-gold/30" />

      <div className="px-5 sm:px-10 md:px-16 pt-16 pb-10">
        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-16 pb-12 border-b border-white/8">
          {/* Brand — spans 2 cols on mobile */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white px-2 py-1.5 flex items-center justify-center flex-shrink-0">
                <Image src="/images/images.png" alt="Mina Hotels Logo" width={36} height={28} className="object-contain" />
              </div>
              <span
                className="text-[14px] tracking-[0.16em] uppercase font-semibold text-gold"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Mina Hotels
              </span>
            </div>
            <p
              className="text-[10px] tracking-[0.2em] uppercase text-gold/70 mb-5 mt-1"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Movers &amp; Shakers
            </p>
            <p
              className="text-[13px] leading-[1.85] text-white/35 max-w-[300px] mb-6"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              A boutique luxury hotel nestled in the serene setting of Old GRA, Port Harcourt. 41 ensuite rooms, world-class dining, and genuine Nigerian hospitality.
            </p>
            {/* Social icons */}
            <div className="flex gap-2.5">
              {[
                { label: 'Facebook', d: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
                { label: 'Instagram', paths: true },
                { label: 'Twitter', d: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' },
              ].map(social => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="w-8 h-8 border border-white/10 flex items-center justify-center hover:border-gold hover:bg-gold/10 transition-all duration-300 cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"
                    className="group-hover:stroke-gold transition-colors">
                    {social.paths ? (
                      <>
                        <rect x="2" y="2" width="20" height="20" rx="5" />
                        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </>
                    ) : (
                      <path d={social.d} />
                    )}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Navigate */}
          <div>
            <h5
              className="text-[10px] tracking-[0.24em] uppercase text-gold/60 mb-5"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Navigate
            </h5>
            <ul className="flex flex-col gap-3 list-none">
              {navLinks.map(l => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[13px] text-white/35 hover:text-gold transition-colors duration-300 no-underline"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h5
              className="text-[10px] tracking-[0.24em] uppercase text-gold/60 mb-5"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Services
            </h5>
            <ul className="flex flex-col gap-3 list-none">
              {services.map(s => (
                <li key={s.label}>
                  <Link
                    href={s.href}
                    className="text-[13px] text-white/35 hover:text-gold transition-colors duration-300 no-underline"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies + Contact */}
          <div>
            <h5
              className="text-[10px] tracking-[0.24em] uppercase text-gold/60 mb-5"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Policies
            </h5>
            <ul className="flex flex-col gap-3 list-none mb-8">
              {policies.map(p => (
                <li key={p.label}>
                  <Link
                    href={p.href}
                    className="text-[13px] text-white/35 hover:text-gold transition-colors duration-300 no-underline"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-2">
              <a
                href="tel:+2348056155303"
                className="text-[12px] text-white/40 hover:text-gold transition-colors no-underline"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                +234 805 615 5303
              </a>
              <a
                href="mailto:info@mina-hotels.com"
                className="text-[12px] text-white/40 hover:text-gold transition-colors no-underline"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                info@mina-hotels.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-7">
          <p
            className="text-[11px] text-white/20 tracking-[0.06em]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            © 2026 Mina Hotels Ltd. All rights reserved. Port Harcourt, Nigeria.
          </p>
          <div className="flex gap-6">
            {[
              { label: 'Privacy', href: '#' },
              { label: 'Terms', href: '/loyalty/terms' },
              { label: 'Cookies', href: '#' },
            ].map(l => (
              <Link
                key={l.label}
                href={l.href}
                className="text-[11px] text-white/20 hover:text-white/50 transition-colors tracking-[0.08em] no-underline"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
