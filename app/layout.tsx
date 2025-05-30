import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Flaunch Feed Dashboard',
  description: 'Real-time visualization of Flaunch Feed events',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-white`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}