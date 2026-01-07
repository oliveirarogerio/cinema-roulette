import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: 'Cinema Roulette - Roleta Russa de Filmes',
  description:
    'Não sabe o que assistir? Deixe o destino escolher seu próximo filme. Descubra filmes aleatórios com a roleta de cinema.',
  keywords: ['filmes', 'cinema', 'roleta', 'aleatório', 'descoberta', 'TMDB'],
  authors: [{ name: 'Cinema Roulette' }],
  openGraph: {
    title: 'Cinema Roulette - Roleta Russa de Filmes',
    description: 'Deixe o destino escolher seu próximo filme',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} antialiased bg-zinc-950 text-zinc-50`}
      >
        <header className="fixed top-0 left-0 right-0 z-40 bg-zinc-950/80 backdrop-blur-sm border-b border-zinc-800">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-zinc-50">
              Cinema Roulette<span className="text-rose-600">.</span>
            </h1>
          </div>
        </header>
        <main className="pt-20">{children}</main>
      </body>
    </html>
  );
}
