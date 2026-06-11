import type { Metadata } from 'next';
import { Space_Grotesk, Manrope } from 'next/font/google';
import '../styles/globals.css';

const space = Space_Grotesk({ subsets: ['latin'], variable: '--font-headline', display: 'swap' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-body', display: 'swap' });

export const metadata: Metadata = {
  title: 'IMANIGO – Software solutions, vehicle transfer and content creation',
  description: 'IMANIGO builds software that solves real problems, transfers vehicles across Europe, and creates trusted digital content in German and English.',
  metadataBase: new URL('https://imanigo.de'),
  icons: {
    icon: '/favicon.ico'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${space.variable} ${manrope.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://a.basemaps.cartocdn.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://b.basemaps.cartocdn.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://a.basemaps.cartocdn.com" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
