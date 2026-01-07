'use client';

import { WatchlistModal } from '@/app/components/WatchlistModal';
import { getWatchlistCount } from '@/app/lib/watchlist';
import { BookmarkIcon } from '@heroicons/react/24/outline';
import { Geist } from 'next/font/google';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [watchlistCount, setWatchlistCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      setWatchlistCount(getWatchlistCount());
    };

    updateCount();

    window.addEventListener('storage', updateCount);
    window.addEventListener('watchlist-updated', updateCount);

    const interval = setInterval(updateCount, 1000);

    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('watchlist-updated', updateCount);
      clearInterval(interval);
    };
  }, []);

  const handleSelectFromWatchlist = async (movieId: number) => {
    setIsWatchlistOpen(false);
    router.push(`/?movie=${movieId}`);
  };

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
            <button
              onClick={() => setIsWatchlistOpen(true)}
              className="relative flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-50 rounded-lg transition-colors"
              title="Ver lista de filmes salvos"
            >
              <BookmarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="hidden sm:inline text-sm font-medium">
                Ver Depois
              </span>
              {watchlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-zinc-50 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {watchlistCount > 9 ? '9+' : watchlistCount}
                </span>
              )}
            </button>
          </div>
        </header>
        <main className="pt-20">{children}</main>
        <WatchlistModal
          isOpen={isWatchlistOpen}
          onClose={() => setIsWatchlistOpen(false)}
          onSelectMovie={handleSelectFromWatchlist}
        />
      </body>
    </html>
  );
}
