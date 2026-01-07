"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FilterBar } from "@/app/components/FilterBar";
import { Roulette } from "@/app/components/Roulette";
import { MovieCard } from "@/app/components/MovieCard";
import { Movie, MovieFilters } from "@/app/lib/types";

export default function Home() {
  const [filters, setFilters] = useState<MovieFilters>({});
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMovieSelected = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleReroll = () => {
    setSelectedMovie(null);
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
      />
    </div>
  );
}
