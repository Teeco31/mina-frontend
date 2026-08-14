import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Guest Reviews',
  description: 'Read what guests say about Mina Hotels, Port Harcourt — real reviews covering rooms, dining, staff, and value at Old GRA\'s premier boutique hotel.',
  alternates: { canonical: 'https://minahotels.com/reviews' },
  openGraph: {
    title: 'Guest Reviews — Mina Hotels',
    description: 'Authentic guest reviews for Mina Hotels, Old GRA, Port Harcourt.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Mina Hotels guest reviews' }],
  },
}

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
