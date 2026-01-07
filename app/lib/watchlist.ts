import { Movie } from "./types";

const WATCHLIST_KEY = "cinema-roulette-watchlist";

export interface WatchlistItem {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  savedAt: number;
}

export function getWatchlist(): WatchlistItem[] {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(WATCHLIST_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading watchlist:", error);
    return [];
  }
}

export function addToWatchlist(movie: Movie): void {
  if (typeof window === "undefined") return;

  try {
    const watchlist = getWatchlist();
    const exists = watchlist.some((item) => item.id === movie.id);

    if (!exists) {
      const item: WatchlistItem = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        savedAt: Date.now(),
      };

      watchlist.unshift(item);
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
    }
  } catch (error) {
    console.error("Error adding to watchlist:", error);
  }
}

export function removeFromWatchlist(movieId: number): void {
  if (typeof window === "undefined") return;

  try {
    const watchlist = getWatchlist();
    const filtered = watchlist.filter((item) => item.id !== movieId);
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error removing from watchlist:", error);
  }
}

export function isInWatchlist(movieId: number): boolean {
  if (typeof window === "undefined") return false;

  try {
    const watchlist = getWatchlist();
    return watchlist.some((item) => item.id === movieId);
  } catch (error) {
    console.error("Error checking watchlist:", error);
    return false;
  }
}

export function getWatchlistCount(): number {
  return getWatchlist().length;
}

