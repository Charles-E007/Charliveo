import type { Metadata } from 'next';
import './globals.css';
import { OfflineOverlay } from '@/components/ui/OfflineOverlay';

export const metadata: Metadata = {
  title: 'Charliveo | Server Ping & Uptime Monitor',
  description: 'Système de surveillance de serveurs en continu, réveil automatique et suivi de disponibilité en temps réel.',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon.ico',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full bg-white antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;1,400;1,500&family=Roboto+Mono:wght@400;500;600&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-[#0F0F0F] selection:bg-red-50 selection:text-[#FF0000]">
        <OfflineOverlay />
        {children}
      </body>
    </html>
  );
}
