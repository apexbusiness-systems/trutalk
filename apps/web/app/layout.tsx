import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TRU Talk - Connect Through Voice',
  description: 'Break language barriers with real-time voice translation. Make authentic connections worldwide.',
  keywords: ['voice dating', 'language translation', 'social app', 'voice matching'],
  openGraph: {
    title: 'TRU Talk - Connect Through Voice',
    description: 'Break language barriers with real-time voice translation.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

