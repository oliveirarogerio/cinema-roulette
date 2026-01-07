"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FilterBar } from "@/app/components/FilterBar";
import { Roulette } from "@/app/components/Roulette";
import { MovieCard } from "@/app/components/MovieCard";
import { Movie, MovieFilters } from "@/app/lib/types";
import { getMovieById } from "@/app/lib/tmdb";

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filters, setFilters] = useState<MovieFilters>({});
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingMovie, setIsLoadingMovie] = useState(false);

  useEffect(() => {
    const movieId = searchParams.get("movie");
    if (movieId) {
      loadMovieById(parseInt(movieId));
    }
  }, [searchParams]);

  const loadMovieById = async (movieId: number) => {
    setIsLoadingMovie(true);
    try {
      const movie = await getMovieById(movieId);
      if (movie) {
        setSelectedMovie(movie);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Error loading movie by ID:", error);
    } finally {
      setIsLoadingMovie(false);
    }
  };

  const updateUrl = (movieId: number | null) => {
    if (movieId) {
      router.push(`?movie=${movieId}`, { scroll: false });
    } else {
      router.push("/", { scroll: false });
    }
  };

  const handleMovieSelected = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
    updateUrl(movie.id);
    window.dispatchEvent(new Event("watchlist-updated"));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    updateUrl(null);
  };

  const handleReroll = () => {
    setSelectedMovie(null);
  };

  const handleSortAgain = async () => {
    const { getRandomMovie } = await import("@/app/lib/tmdb");
    try {
      const movie = await getRandomMovie(filters);
      if (movie) {
        setSelectedMovie(movie);
        setIsModalOpen(true);
        updateUrl(movie.id);
        window.dispatchEvent(new Event("watchlist-updated"));
      }
    } catch (error) {
      console.error("Error sorting again:", error);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center text-center space-y-6 sm:space-y-8 max-w-4xl mx-auto"
        >
          <div className="space-y-3 sm:space-y-4 px-2">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-50 leading-tight"
            >
              Não sabe o que assistir?
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto px-2"
            >
              Deixe o destino escolher seu próximo filme.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="w-full space-y-6 sm:space-y-8"
          >
            <FilterBar onFiltersChange={setFilters} />

            <div className="py-6 sm:py-8">
              <Roulette filters={filters} onMovieSelected={handleMovieSelected} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-center space-y-2 pt-8 sm:pt-12 px-4"
          >
            <p className="text-zinc-600 text-xs sm:text-sm">
              Descubra filmes aleatórios de todo o mundo
            </p>
            <p className="text-zinc-700 text-xs">
              Dados fornecidos por{" "}
              <a
                href="https://www.themoviedb.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 hover:text-zinc-500 underline"
              >
                The Movie Database (TMDB)
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>

      <MovieCard
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onReroll={handleReroll}
        onSortAgain={handleSortAgain}
      />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-600 border-t-transparent rounded-full mx-auto mb-4 animate-spin" />
          <p className="text-zinc-400 text-sm">Carregando...</p>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
