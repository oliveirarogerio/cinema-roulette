"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdjustmentsHorizontalIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { Genre, MovieFilters } from "@/app/lib/types";
import { getGenres } from "@/app/lib/tmdb";

interface FilterBarProps {
  onFiltersChange: (filters: MovieFilters) => void;
}

const DECADE_OPTIONS = [
  { label: "Qualquer Ano", value: null },
  { label: "Anos 80", value: { start: 1980, end: 1989 } },
  { label: "Anos 90", value: { start: 1990, end: 1999 } },
  { label: "Anos 2000", value: { start: 2000, end: 2009 } },
  { label: "Anos 2010", value: { start: 2010, end: 2019 } },
  { label: "Anos 2020+", value: { start: 2020, end: new Date().getFullYear() } },
  { label: "Ano Específico", value: null },
];

export function FilterBar({ onFiltersChange }: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [selectedDecade, setSelectedDecade] = useState<number>(0);
  const [customStartYear, setCustomStartYear] = useState<string>("");
  const [customEndYear, setCustomEndYear] = useState<string>("");

  useEffect(() => {
    async function loadGenres() {
      const genreList = await getGenres();
      setGenres(genreList);
    }
    loadGenres();
  }, []);

  useEffect(() => {
    const decadeOption = DECADE_OPTIONS[selectedDecade];
    const isCustomYear = selectedDecade === DECADE_OPTIONS.length - 1;

    const filters: MovieFilters = {
      genreIds: selectedGenres.length > 0 ? selectedGenres : undefined,
      startYear: isCustomYear
        ? (customStartYear ? parseInt(customStartYear) : undefined)
        : decadeOption.value?.start,
      endYear: isCustomYear
        ? (customEndYear ? parseInt(customEndYear) : undefined)
        : decadeOption.value?.end,
    };
    onFiltersChange(filters);
  }, [selectedGenres, selectedDecade, customStartYear, customEndYear, onFiltersChange]);

  const toggleGenre = (genreId: number) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setSelectedDecade(0);
    setCustomStartYear("");
    setCustomEndYear("");
  };

  const hasActiveFilters = selectedGenres.length > 0 || selectedDecade !== 0 || customStartYear !== "" || customEndYear !== "";
  const isCustomYear = selectedDecade === DECADE_OPTIONS.length - 1;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-50 rounded-xl border border-zinc-800 transition-colors w-full sm:w-auto mx-auto text-sm sm:text-base"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <AdjustmentsHorizontalIcon className="w-5 h-5 sm:w-5 sm:h-5" />
        <span className="font-medium">Preferências</span>
        {hasActiveFilters && (
          <span className="px-2 py-0.5 bg-rose-600 text-zinc-50 text-xs rounded-full min-w-[20px] text-center">
            {selectedGenres.length + (selectedDecade !== 0 ? 1 : 0) + (customStartYear !== "" || customEndYear !== "" ? 1 : 0)}
          </span>
        )}
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDownIcon className="w-4 h-4" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6 space-y-5 sm:space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm sm:text-base font-medium text-zinc-50">
                    Gêneros
                  </label>
                  {selectedGenres.length > 0 && (
                    <button
                      onClick={() => setSelectedGenres([])}
                      className="text-xs sm:text-sm text-rose-600 hover:text-rose-500 font-medium"
                    >
                      Limpar
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <button
                      key={genre.id}
                      onClick={() => toggleGenre(genre.id)}
                      className={`px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg transition-all active:scale-95 ${
                        selectedGenres.includes(genre.id)
                          ? "bg-rose-600 text-zinc-50"
                          : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-50"
                      }`}
                    >
                      {genre.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm sm:text-base font-medium text-zinc-50 block mb-3">
                  Década
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {DECADE_OPTIONS.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedDecade(index)}
                      className={`px-3 sm:px-4 py-2.5 text-xs sm:text-sm rounded-lg transition-all active:scale-95 ${
                        selectedDecade === index
                          ? "bg-rose-600 text-zinc-50"
                          : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-50"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                <AnimatePresence>
                  {isCustomYear && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <div>
                          <label className="text-xs sm:text-sm text-zinc-400 block mb-2">
                            Ano Inicial
                          </label>
                          <input
                            type="number"
                            min="1900"
                            max={new Date().getFullYear()}
                            placeholder="Ex: 2010"
                            value={customStartYear}
                            onChange={(e) => setCustomStartYear(e.target.value)}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-800 text-zinc-50 text-sm sm:text-base rounded-lg border border-zinc-700 focus:border-rose-600 focus:outline-none transition-colors placeholder:text-zinc-600"
                          />
                        </div>
                        <div>
                          <label className="text-xs sm:text-sm text-zinc-400 block mb-2">
                            Ano Final
                          </label>
                          <input
                            type="number"
                            min="1900"
                            max={new Date().getFullYear()}
                            placeholder="Ex: 2024"
                            value={customEndYear}
                            onChange={(e) => setCustomEndYear(e.target.value)}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-800 text-zinc-50 text-sm sm:text-base rounded-lg border border-zinc-700 focus:border-rose-600 focus:outline-none transition-colors placeholder:text-zinc-600"
                          />
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-zinc-500 mt-2">
                        Deixe em branco para buscar apenas filmes de um ano específico
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {hasActiveFilters && (
                <motion.button
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={clearFilters}
                  className="w-full py-2 text-sm text-zinc-400 hover:text-zinc-50 transition-colors"
                >
                  Limpar todos os filtros
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

