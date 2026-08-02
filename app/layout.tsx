import type { Metadata } from 'next'
import './globals.css'
import ClientLayout from '@/components/ClientLayout'
import Script from 'next/script'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mina-hotels.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Mina Hotels — Port Harcourt',
    template: '%s | Mina Hotels',
  },
  description:
    'A boutique luxury hotel nestled in the serene setting of Old GRA, Port Harcourt. 41 ensuite rooms, world-class dining, and genuine Nigerian hospitality.',
  keywords: [
    'Mina Hotels', 'Port Harcourt hotel', 'luxury hotel Port Harcourt',
    'Old GRA hotel', 'Nigeria boutique hotel', 'hotel Port Harcourt',
    'Mina Hotels Nigeria', 'best hotel Port Harcourt',
  ],
  authors: [{ name: 'Mina Hotels' }],
  creator: 'Mina Hotels',
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: SITE_URL,
    siteName: 'Mina Hotels',
    title: 'Mina Hotels — Port Harcourt',
    description: 'Movers & Shakers. Boutique luxury in the heart of Port Harcourt, Nigeria.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Mina Hotels Port Harcourt',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mina Hotels — Port Harcourt',
    description: 'Movers & Shakers. Boutique luxury in Old GRA, Port Harcourt.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // google: 'your-google-site-verification-code',
  },
  alternates: {
    canonical: SITE_URL,
  },
}

const hotelJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Hotel',
  name: 'Mina Hotels',
  description:
    'A boutique luxury hotel in Old GRA, Port Harcourt, Nigeria. 41 ensuite rooms, fine dining, event spaces, and a loyalty programme.',
  url: SITE_URL,
  logo: `${SITE_URL}/images/images.png`,
  image: `${SITE_URL}/og-image.jpg`,
  telephone: '+234-000-000-0000',
  email: 'info@mina-hotels.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Old GRA',
    addressLocality: 'Port Harcourt',
    addressRegion: 'Rivers State',
    addressCountry: 'NG',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 4.8156,
    longitude: 7.0498,
  },
  priceRange: '₦₦₦',
  starRating: { '@type': 'Rating', ratingValue: 5 },
  numberOfRooms: 41,
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: '24h Front Desk', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Free Wi-Fi', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Restaurant', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Business Centre', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Fitness Centre', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Secure Parking', value: true },
  ],
  checkinTime: 'T14:00',
  checkoutTime: 'T12:00',
  currenciesAccepted: 'NGN',
  paymentAccepted: 'Cash, Credit Card, Bank Transfer',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Script
          id="hotel-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelJsonLd) }}
        />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
