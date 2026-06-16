import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Space_Grotesk, Manrope } from 'next/font/google';
import '../styles/globals.css';
import { organization, SITE_URL } from '../lib/site-config';

const space = Space_Grotesk({ subsets: ['latin'], variable: '--font-headline', display: 'swap' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-body', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${organization.brand} – Software, vehicle transfer and content creation`,
    template: `%s · ${organization.brand}`
  },
  description:
    'IMANIGO builds software that solves real problems, transfers vehicles across Europe, and creates trusted digital content in German and English.',
  robots: {
    index: true,
    follow: true
  }
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const lang = headersList.get('x-imanigo-locale') === 'en' ? 'en' : 'de';

  return (
    <html lang={lang} className={`${space.variable} ${manrope.variable}`} suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
