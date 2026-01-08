'use client';

import { WatchlistButton } from '@/app/components/WatchlistButton';
import { Button } from '@/app/components/ui/Button';
import { Modal } from '@/app/components/ui/Modal';
import { getPosterUrl, getProviderLogoUrl } from '@/app/lib/image-helpers';
import { searchMovieTorrent } from '@/app/lib/pirate';
import { getMovieEnglishTitle, getWatchProviders } from '@/app/lib/tmdb';
import { Movie, WatchProviderResult } from '@/app/lib/types';
import {
  ArrowDownTrayIcon,
  ArrowTopRightOnSquareIcon,
  PlayIcon,
  ShareIcon,
  StarIcon,
} from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface MovieCardProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
  onReroll: () => void;
  onSortAgain: () => void;
}

export function MovieCard({
  movie,
  isOpen,
  onClose,
  onReroll,
  onSortAgain,
}: MovieCardProps) {
  const [watchProviders, setWatchProviders] =
    useState<WatchProviderResult | null>(null);
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);
  const [isSorting, setIsSorting] = useState(false);
  const [showShareFeedback, setShowShareFeedback] = useState(false);
  const [torrents, setTorrents] = useState<
    Array<{
      torrent: {
        name: string;
        seeders: number;
        leechers: number;
        size: string;
      };
      magnetLink: string;
    }>
  >([]);
  const [isLoadingMagnet, setIsLoadingMagnet] = useState(false);
  const [copiedMagnetIndex, setCopiedMagnetIndex] = useState<number | null>(
    null,
  );

  const searchParams = useSearchParams();
  const isJuicerMode = searchParams.get('juicer') !== null;

  useEffect(() => {
    if (movie) {
      getWatchProviders(movie.id).then(setWatchProviders);
    } else {
      setWatchProviders(null);
    }
  }, [movie]);

  useEffect(() => {
    if (movie && isJuicerMode) {
      setIsLoadingMagnet(true);
      setTorrents([]);

      const year = movie.release_date
        ? new Date(movie.release_date).getFullYear().toString()
        : undefined;

      getMovieEnglishTitle(movie.id)
        .then((englishTitle) => {
          const searchTitle = englishTitle || movie.original_title;
          return searchMovieTorrent(searchTitle, year);
        })
        .then((results) => {
          setTorrents(results);
        })
        .catch((error) => {
          console.error('Error searching torrent:', error);
        })
        .finally(() => {
          setIsLoadingMagnet(false);
        });
    } else {
      setTorrents([]);
      setIsLoadingMagnet(false);
    }
  }, [movie, isJuicerMode]);

  useEffect(() => {
    setShowFullSynopsis(false);
    setIsSorting(false);
  }, [movie?.id]);

  if (!movie || isSorting) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} className="sm:max-w-5xl">
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <motion.div
              className="w-16 h-16 border-4 border-rose-600 border-t-transparent rounded-full mx-auto mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <p className="text-zinc-400 text-sm">Buscando novo filme...</p>
          </div>
        </div>
      </Modal>
    );
  }

  const posterUrl = getPosterUrl(movie.poster_path, 'w500');
  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : 'N/A';
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

  const truncatedSynopsis =
    movie.overview.length > 200 && !showFullSynopsis
      ? movie.overview.slice(0, 200) + '...'
      : movie.overview;

  const handleReroll = async () => {
    setIsSorting(true);
    onReroll();
    await onSortAgain();
    setIsSorting(false);
  };

  const handleShare = async () => {
    if (!movie) return;

    const url = `${window.location.origin}?movie=${movie.id}`;

    try {
      await navigator.clipboard.writeText(url);
      setShowShareFeedback(true);
      setTimeout(() => setShowShareFeedback(false), 2500);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const handleMagnetClick = async (magnetLink: string, index: number) => {
    if (!magnetLink) return;

    try {
      await navigator.clipboard.writeText(magnetLink);
      setCopiedMagnetIndex(index);
      setTimeout(() => setCopiedMagnetIndex(null), 2500);
    } catch (error) {
      console.error('Error copying magnet link:', error);
    }
  };

  const formatSize = (size: string) => {
    return size;
  };

  const trailerSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${movie.title} ${year} trailer`,
  )}`;

  const tmdbUrl = `https://www.themoviedb.org/movie/${movie.id}`;
  const imdbUrl = movie.imdb_id
    ? `https://www.imdb.com/title/${movie.imdb_id}`
    : null;

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
                &ldquo;{movie.tagline}&rdquo;
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
              {truncatedSynopsis || 'Sinopse não disponível.'}
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

          {watchProviders &&
            watchProviders.flatrate &&
            watchProviders.flatrate.length > 0 && (
              <div className="text-center md:text-left">
                <p className="text-xs sm:text-sm text-zinc-400 mb-2">
                  Disponível em:
                </p>
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

          <div className="flex flex-col gap-3 sm:gap-4 mt-auto pt-4 sm:pt-6">
            {isJuicerMode && (
              <div className="border border-zinc-700 rounded-lg p-3 sm:p-4 bg-zinc-900/50">
                <h3 className="text-sm font-semibold text-zinc-50 mb-3 flex items-center gap-2">
                  <ArrowDownTrayIcon className="w-4 h-4 text-rose-500" />
                  Torrents Disponíveis
                </h3>

                {isLoadingMagnet ? (
                  <div className="flex items-center justify-center py-8">
                    <motion.div
                      className="w-8 h-8 border-2 border-rose-600 border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                  </div>
                ) : torrents.length > 0 ? (
                  <div className="flex flex-col gap-2 max-h-64 overflow-y-auto custom-scrollbar">
                    {torrents.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="relative bg-zinc-800/50 hover:bg-zinc-800 rounded-lg p-3 border border-zinc-700/50 hover:border-zinc-600 transition-all"
                      >
                        <div className="flex flex-col gap-2">
                          <p className="text-xs sm:text-sm text-zinc-300 font-medium line-clamp-2">
                            {item.torrent.name}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-zinc-400">
                            <span className="flex items-center gap-1">
                              <span className="text-green-500">↑</span>
                              {item.torrent.seeders}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="text-red-500">↓</span>
                              {item.torrent.leechers}
                            </span>
                            <span>{formatSize(item.torrent.size)}</span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <motion.div
                            whileTap={{ scale: 0.95 }}
                            animate={
                              copiedMagnetIndex === index
                                ? { scale: [1, 1.05, 1] }
                                : {}
                            }
                            transition={{ duration: 0.3 }}
                          >
                            <Button
                              variant="primary"
                              onClick={() =>
                                handleMagnetClick(item.magnetLink, index)
                              }
                              className="w-full text-xs sm:text-sm py-2 flex items-center justify-center gap-1.5"
                            >
                              {copiedMagnetIndex === index ? (
                                <>
                                  <svg
                                    className="w-3.5 h-3.5 text-green-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                  <span>Copiado!</span>
                                </>
                              ) : (
                                <>
                                  <ArrowDownTrayIcon className="w-3.5 h-3.5" />
                                  <span>Copiar Magnet</span>
                                </>
                              )}
                            </Button>
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-zinc-400 text-sm">
                    <p>Nenhum torrent encontrado</p>
                    <p className="text-xs mt-1">
                      Tente buscar manualmente: {movie?.original_title}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <Button
                variant="primary"
                onClick={handleReroll}
                isLoading={isSorting}
                className="text-sm sm:text-base py-3 sm:py-3.5"
              >
                {isSorting ? 'Buscando...' : 'Sortear Outro'}
              </Button>
              <WatchlistButton
                movie={movie}
                variant="secondary"
                className="w-full text-sm sm:text-base py-3 sm:py-3.5"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              <Button
                variant="secondary"
                onClick={() => window.open(trailerSearchUrl, '_blank')}
                className="flex items-center justify-center gap-1.5 text-xs sm:text-sm py-2.5 sm:py-3"
              >
                <PlayIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Trailer</span>
              </Button>
              {imdbUrl && (
                <Button
                  variant="link"
                  onClick={() => window.open(imdbUrl, '_blank')}
                  className="flex items-center justify-center gap-1.5 text-xs sm:text-sm py-2.5 sm:py-3"
                >
                  <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>IMDb</span>
                </Button>
              )}
              <Button
                variant="link"
                onClick={() => window.open(tmdbUrl, '_blank')}
                className="flex items-center justify-center gap-1.5 text-xs sm:text-sm py-2.5 sm:py-3"
              >
                <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>TMDB</span>
              </Button>
              <div className="relative">
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  animate={showShareFeedback ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  <Button
                    variant="secondary"
                    onClick={handleShare}
                    className="flex items-center justify-center gap-1.5 text-xs sm:text-sm py-2.5 sm:py-3 w-full h-full"
                  >
                    <motion.div
                      animate={
                        showShareFeedback
                          ? {
                              rotate: [0, -10, 10, -10, 0],
                              scale: [1, 1.2, 1],
                            }
                          : {}
                      }
                      transition={{ duration: 0.5 }}
                    >
                      <ShareIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </motion.div>
                    <span className="hidden sm:inline">Compartilhar</span>
                    <span className="sm:hidden">Share</span>
                  </Button>
                </motion.div>
                {showShareFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.9 }}
                    className="absolute -top-14 left-1/2 -translate-x-1/2 bg-zinc-800 text-zinc-50 px-4 py-2 rounded-lg text-sm whitespace-nowrap shadow-xl border border-zinc-700 z-50"
                  >
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="font-medium">Link copiado!</span>
                    </div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-zinc-800 border-r border-b border-zinc-700" />
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Modal>
  );
}
