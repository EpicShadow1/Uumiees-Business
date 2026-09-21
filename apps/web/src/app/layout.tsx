import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import { Footer } from '@uumiees/ui';
import { Providers } from '@/lib/providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: {
    default: "Uumiee's - Premium E-commerce",
    template: '%s · Uumiee\'s',
  },
  description: 'Premium shopping experience for the whole family',
  metadataBase: new URL('https://uumiees.com'),
  openGraph: {
    title: "Uumiee's - Premium E-commerce",
    description: 'Premium shopping experience for the whole family',
    url: 'https://uumiees.com',
    siteName: "Uumiee's",
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Uumiee's - Premium E-commerce",
    description: 'Premium shopping experience for the whole family',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#173B8F] focus:text-white focus:rounded-lg">
          Skip to content
        </a>
        <Navigation />
        <Providers>
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
