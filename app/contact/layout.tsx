import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Mina Hotels at 23 Igbodo Street, Old GRA, Port Harcourt. Call +234 805 615 5303, email us, or submit an enquiry. We respond within the hour.',
  alternates: { canonical: 'https://minahotels.com/contact' },
  openGraph: {
    title: 'Contact Mina Hotels — Port Harcourt',
    description: 'Reach Mina Hotels for reservations, events, or general enquiries. 23 Igbodo Street, Old GRA, Port Harcourt.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Mina Hotels contact' }],
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
