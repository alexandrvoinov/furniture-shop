import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { Footer } from '@/widgets/footer/Footer';
import { Header } from '@/widgets/header/Header';
import { WhatsAppFloat } from '@/widgets/whatsapp/WhatsAppFloat';

import './globals.scss';

export const metadata: Metadata = {
  title: 'VEEMA ASTANA | Мебель на заказ',
  description:
    'VEEMA ASTANA: кухни, шкафы и ТВ-зоны на заказ. Выполненные проекты, замер, производство и монтаж.',
  icons: {
    icon: '/images/logo.jpg',
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        <div className="app-shell">
          <Header />
          <div className="app-shell__content">{children}</div>
          <Footer />
        </div>
        <WhatsAppFloat />
      </body>
    </html>
  );
}
