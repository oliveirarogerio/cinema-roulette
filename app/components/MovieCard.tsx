"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { StarIcon, PlayIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
import { Modal } from "@/app/components/ui/Modal";
import { Button } from "@/app/components/ui/Button";
import { Movie, WatchProviderResult } from "@/app/lib/types";
import { getWatchProviders } from "@/app/lib/tmdb";
import { getPosterUrl, getProviderLogoUrl } from "@/app/lib/image-helpers";

interface MovieCardProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
  onReroll: () => void;
  onSortAgain: () => void;
}

export function MovieCard({ movie, isOpen, onClose, onReroll, onSortAgain }: MovieCardProps) {
  const [watchProviders, setWatchProviders] = useState<WatchProviderResult | null>(null);
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);
  const [isSorting, setIsSorting] = useState(false);

  useEffect(() => {
    if (movie) {
      setShowFullSynopsis(false);
      setIsSorting(false);
      getWatchProviders(movie.id).then(setWatchProviders);
    }
  }, [movie]);

  if (!movie || isSorting) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} className="sm:max-w-5xl">
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <motion.div
              className="w-16 h-16 border-4 border-rose-600 border-t-transparent rounded-full mx-auto mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-zinc-400 text-sm">Buscando novo filme...</p>
          </div>
        </div>
      </Modal>
    );
  }

  const posterUrl = getPosterUrl(movie.poster_path, "w500");
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A";
  const rating = movie.vote_average.toFixed(1);

  const formatRuntime = (minutes: number | undefined) => {
    if (!minutes) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  const runtime = formatRuntime(movie.runtime);

  const truncatedSynopsis = movie.overview.length > 200 && !showFullSynopsis
    ? movie.overview.slice(0, 200) + "..."
    : movie.overview;

  const handleReroll = async () => {
    setIsSorting(true);
    onReroll();
    await onSortAgain();
    setIsSorting(false);
  };

  const trailerSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${movie.title} ${year} trailer`
  )}`;

  const tmdbUrl = `https://www.themoviedb.org/movie/${movie.id}`;
  const imdbUrl = movie.imdb_id ? `https://www.imdb.com/title/${movie.imdb_id}` : null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="sm:max-w-5xl">
      <div className="flex flex-col md:flex-row gap-4 sm:gap-6 p-4 sm:p-6 pb-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-shrink-0 w-full md:w-auto"
        >
          {posterUrl ? (
            <div className="relative w-full max-w-[280px] sm:max-w-xs md:w-80 aspect-[2/3] rounded-lg sm:rounded-xl overflow-hidden bg-zinc-800 mx-auto">
              <Image
                src={posterUrl}
                alt={movie.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 320px"
                priority
              />
            </div>
          ) : (
            <div className="w-full md:w-80 aspect-[2/3] rounded-xl bg-zinc-800 flex items-center justify-center">
              <p className="text-zinc-600 text-sm">Sem poster disponível</p>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1 flex flex-col gap-3 sm:gap-4 w-full"
        >
          <div className="text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-50 mb-2 leading-tight">
              {movie.title}
            </h2>
            {movie.original_title !== movie.title && (
              <p className="text-zinc-400 text-xs sm:text-sm mb-2">
                {movie.original_title}
              </p>
            )}
            {movie.tagline && (
              <p className="text-rose-500 text-xs sm:text-sm italic mb-2 sm:mb-3">
                "{movie.tagline}"
              </p>
            )}
            <div className="flex items-center justify-center md:justify-start gap-2 sm:gap-4 text-xs sm:text-sm text-zinc-400 flex-wrap">
              <span>{year}</span>
              {runtime && (
                <>
                  <span className="text-zinc-700">•</span>
                  <span>{runtime}</span>
                </>
              )}
              <span className="text-zinc-700">•</span>
              <div className="flex items-center gap-1">
                <StarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-600" />
                <span className="text-zinc-50 font-medium">{rating}</span>
                <span>/ 10</span>
              </div>
            </div>
          </div>

          {movie.genres && movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center md:justify-start">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-2.5 sm:px-3 py-1 bg-zinc-800 text-zinc-300 text-xs rounded-full"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          <div className="text-center md:text-left">
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              {truncatedSynopsis || "Sinopse não disponível."}
            </p>
            {!showFullSynopsis && truncatedSynopsis !== movie.overview && (
              <button
                onClick={() => setShowFullSynopsis(true)}
                className="text-rose-600 hover:text-rose-500 text-xs sm:text-sm mt-2 font-medium"
              >
                Ver mais
              </button>
            )}
          </div>

          {watchProviders && watchProviders.flatrate && watchProviders.flatrate.length > 0 && (
            <div className="text-center md:text-left">
              <p className="text-xs sm:text-sm text-zinc-400 mb-2">Disponível em:</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {watchProviders.flatrate.map((provider) => (
                  <div
                    key={provider.provider_id}
                    className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-zinc-800"
                    title={provider.provider_name}
                  >
                    <Image
                      src={getProviderLogoUrl(provider.logo_path)}
                      alt={provider.provider_name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 40px, 48px"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 sm:gap-3 mt-auto pt-4 sm:pt-6">
            <Button
              variant="primary"
              onClick={handleReroll}
              className="w-full text-base sm:text-lg py-3 sm:py-4"
            >
              Sortear Outro
            </Button>
            <div className={`grid gap-2 ${imdbUrl ? 'grid-cols-3' : 'grid-cols-2'}`}>
              <Button
                variant="secondary"
                onClick={() => window.open(trailerSearchUrl, "_blank")}
                className="flex items-center justify-center gap-1.5 text-sm sm:text-base py-2.5 sm:py-3"
              >
                <PlayIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Trailer</span>
                <span className="xs:hidden">Play</span>
              </Button>
              {imdbUrl && (
                <Button
                  variant="link"
                  onClick={() => window.open(imdbUrl, "_blank")}
                  className="flex items-center justify-center gap-1.5 text-sm sm:text-base py-2.5 sm:py-3"
                >
                  <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  IMDb
                </Button>
              )}
              <Button
                variant="link"
                onClick={() => window.open(tmdbUrl, "_blank")}
                className="flex items-center justify-center gap-1.5 text-sm sm:text-base py-2.5 sm:py-3"
              >
                <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                TMDB
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </Modal>
  );
}

