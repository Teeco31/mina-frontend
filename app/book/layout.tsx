import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Book a Room',
  description: 'Reserve your room at Mina Hotels, Old GRA, Port Harcourt. Choose from Standard, Deluxe, Royal, Executive, Exclusive Suite, and Luxury Suite categories.',
  alternates: { canonical: 'https://minahotels.com/book' },
  openGraph: {
    title: 'Book a Room — Mina Hotels',
    description: 'Reserve your stay at Mina Hotels in Port Harcourt. 41 ensuite rooms across 6 categories.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Mina Hotels — Book a Room' }],
  },
  robots: { index: false, follow: true },
}

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
