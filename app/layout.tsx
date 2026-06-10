import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: {
    default: 'Foundry Jobs — Startup Jobs for Engineers',
    template: '%s | Foundry Jobs',
  },
  description:
    'Discover startup job opportunities, explore companies, and find roles that match your experience. Resume matching powered by AI.',
  keywords: ['startup jobs', 'engineering jobs', 'YC companies', 'tech jobs', 'remote jobs'],
  openGraph: {
    title: 'Foundry Jobs — Startup Jobs for Engineers',
    description: 'Find startup jobs before everyone else.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--bg)] text-[var(--ink)] antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
