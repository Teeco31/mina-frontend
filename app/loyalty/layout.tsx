import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rewards Programme',
  description: 'Join the Mina Rewards Programme. Earn 200 points per night and redeem for free stays. Classic, Gold and Prestige membership tiers.',
  openGraph: {
    title: 'Mina Rewards Programme — Mina Hotels',
    description: 'Earn loyalty points with every stay and enjoy exclusive rewards at Mina Hotels Port Harcourt.',
  },
}

export default function LoyaltyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
