import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { Footer } from '@/widgets/footer/Footer';
import { Header } from '@/widgets/header/Header';

import './globals.scss';

export const metadata: Metadata = {
  title: 'Mebel Shop',
  description: 'Frontend for a furniture store built with Next.js, React, TypeScript, and SCSS.',
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
      </body>
    </html>
  );
}
