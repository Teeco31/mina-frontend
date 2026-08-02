import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Guest Reviews',
  description: 'Read what guests say about Mina Hotels, Port Harcourt — real reviews covering rooms, dining, staff, and value.',
  openGraph: {
    title: 'Guest Reviews — Mina Hotels',
    description: 'Authentic guest reviews for Mina Hotels, Old GRA, Port Harcourt.',
  },
}

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
