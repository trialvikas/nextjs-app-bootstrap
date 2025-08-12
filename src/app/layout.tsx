import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Stock Analytics - Real-time Stock Data & Analysis',
  description: 'Get real-time stock data, comprehensive analysis, and the latest news for any publicly traded company. Powered by Yahoo Finance.',
  keywords: 'stock analysis, stock data, yahoo finance, real-time stocks, stock news, market data',
  authors: [{ name: 'Stock Analytics' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
