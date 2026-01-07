"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/Button";
import { Movie, MovieFilters } from "@/app/lib/types";
import { getRandomMovie } from "@/app/lib/tmdb";

interface RouletteProps {
  filters: MovieFilters;
  onMovieSelected: (movie: Movie) => void;
}

const LOADING_MESSAGES = [
  "Carregando munição...",
  "Girando o tambor...",
  "Escolhendo seu destino...",
  "Procurando o filme perfeito...",
];

export function Roulette({ filters, onMovieSelected }: RouletteProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);

  const handleSpin = async () => {
    setIsLoading(true);
    setError(null);

    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % LOADING_MESSAGES.length;
      setLoadingMessage(LOADING_MESSAGES[messageIndex]);
    }, 1000);

    try {
      const movie = await getRandomMovie(filters);

      clearInterval(messageInterval);

      if (!movie) {
        setError("Nenhum filme encontrado com esses filtros. Tente ajustar suas preferências!");
        setIsLoading(false);
        return;
      }

      setTimeout(() => {
        onMovieSelected(movie);
        setIsLoading(false);
      }, 500);
    } catch (err) {
      clearInterval(messageInterval);
      setError("Erro ao buscar filme. Tente novamente!");
      setIsLoading(false);
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <Button
        variant="primary"
        onClick={handleSpin}
        isLoading={isLoading}
        disabled={isLoading}
        className="text-base sm:text-lg md:text-xl px-8 sm:px-12 py-4 sm:py-5 md:py-6 rounded-full shadow-2xl shadow-rose-900/30 hover:shadow-rose-900/40 transition-shadow w-full sm:w-auto"
      >
        {isLoading ? loadingMessage : "Sortear Filme"}
      </Button>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md text-center p-3 sm:p-4 bg-rose-900/20 border border-rose-900/50 rounded-lg sm:rounded-xl mx-4"
        >
          <p className="text-rose-400 text-xs sm:text-sm">{error}</p>
        </motion.div>
      )}

      {!isLoading && !error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-zinc-500 text-xs sm:text-sm text-center max-w-md px-4"
        >
          Clique no botão para descobrir um filme aleatório baseado nas suas preferências
        </motion.p>
      )}
    </div>
  );
}

