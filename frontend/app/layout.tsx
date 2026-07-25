// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppShell } from './app-shell';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FoodieXpress - Food Delivery',
  description: 'Get your favorite food delivered fast.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-gray-50 text-gray-900`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}