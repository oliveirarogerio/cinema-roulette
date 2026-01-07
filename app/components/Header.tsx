'use client';

import { BookmarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { getWatchlistCount } from '../lib/watchlist';

interface HeaderProps {
  onOpenWatchlist: () => void;
}

export function Header({ onOpenWatchlist }: HeaderProps) {
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

  return (
    <header className="w-full py-4 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-end">
        <button
          onClick={onOpenWatchlist}
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
  );
}
