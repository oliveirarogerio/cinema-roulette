"use client";

import { useState, useEffect } from "react";
import { BookmarkIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkIconSolid } from "@heroicons/react/24/solid";
import { Movie } from "../lib/types";
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from "../lib/watchlist";
import { Button } from "./ui/Button";

interface WatchlistButtonProps {
  movie: Movie;
  variant?: "primary" | "secondary" | "ghost" | "link";
  className?: string;
  showLabel?: boolean;
}

export function WatchlistButton({
  movie,
  variant = "secondary",
  className = "",
  showLabel = true
}: WatchlistButtonProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    setIsSaved(isInWatchlist(movie.id));
  }, [movie.id]);

  const handleToggle = () => {
    if (isSaved) {
      removeFromWatchlist(movie.id);
      setIsSaved(false);
    } else {
      addToWatchlist(movie);
      setIsSaved(true);
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 2000);
    }
  };

  return (
    <div className="relative">
      <Button
        variant={variant}
        onClick={handleToggle}
        className={`flex items-center justify-center gap-1.5 ${className}`}
      >
        {isSaved ? (
          <BookmarkIconSolid className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500" />
        ) : (
          <BookmarkIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        )}
        {showLabel && (
          <span className="hidden sm:inline">
            {isSaved ? "Salvo" : "Salvar"}
          </span>
        )}
      </Button>

      {showFeedback && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-zinc-800 text-zinc-50 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap shadow-lg border border-zinc-700 animate-in fade-in slide-in-from-bottom-2">
          Salvo para ver depois!
        </div>
      )}
    </div>
  );
}

