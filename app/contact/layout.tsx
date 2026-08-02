import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Mina Hotels in Old GRA, Port Harcourt. Email, phone, or submit an enquiry. We respond within 24 hours.',
  openGraph: {
    title: 'Contact Mina Hotels — Port Harcourt',
    description: 'Reach out to Mina Hotels for reservations, events, or general enquiries.',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
