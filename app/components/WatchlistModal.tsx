"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { StarIcon, TrashIcon, FilmIcon, CalendarIcon } from "@heroicons/react/24/solid";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { WatchlistItem, getWatchlist, removeFromWatchlist } from "../lib/watchlist";
import { getPosterUrl } from "../lib/image-helpers";
import { motion, AnimatePresence } from "framer-motion";

interface WatchlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMovie: (movieId: number) => void;
}

export function WatchlistModal({ isOpen, onClose, onSelectMovie }: WatchlistModalProps) {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [removingId, setRemovingId] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setWatchlist(getWatchlist());
    }
  }, [isOpen]);

  const handleRemove = (movieId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setRemovingId(movieId);

    setTimeout(() => {
      removeFromWatchlist(movieId);
      setWatchlist(getWatchlist());
      setRemovingId(null);
      window.dispatchEvent(new Event("watchlist-updated"));
    }, 300);
  };

  const handleSelectMovie = (movieId: number) => {
    onSelectMovie(movieId);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="sm:max-w-5xl">
      <div className="p-4 sm:p-6 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-50 mb-1">
              Ver Depois
            </h2>
            {watchlist.length > 0 && (
              <p className="text-zinc-400 text-sm">
                {watchlist.length} {watchlist.length === 1 ? "filme salvo" : "filmes salvos"}
              </p>
            )}
          </div>
          {watchlist.length > 0 && (
            <div className="text-rose-600 bg-rose-600/10 px-3 py-1.5 rounded-full text-sm font-medium">
              {watchlist.length}
            </div>
          )}
        </div>

        {watchlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 sm:py-20"
          >
            <div className="mb-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                <FilmIcon className="w-10 h-10 sm:w-12 sm:h-12 text-zinc-600" />
              </div>
            </div>
            <h3 className="text-zinc-50 text-xl sm:text-2xl font-bold mb-3">
              Sua lista está vazia
            </h3>
            <p className="text-zinc-400 text-sm sm:text-base mb-6 max-w-md mx-auto">
              Comece a adicionar filmes que você quer assistir mais tarde. Clique no botão
              <span className="text-rose-500 font-medium"> Salvar</span> ao ver os detalhes de um filme.
            </p>
            <Button variant="primary" onClick={onClose} className="mx-auto">
              Descobrir Filmes
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
            <AnimatePresence mode="popLayout">
              {watchlist.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: removingId === item.id ? 0 : 1,
                    scale: removingId === item.id ? 0.8 : 1,
                    y: 0
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    layout: { duration: 0.3 },
                    opacity: { duration: 0.2 },
                    scale: { duration: 0.2 }
                  }}
                  className="group relative bg-zinc-800/50 rounded-xl overflow-hidden cursor-pointer hover:bg-zinc-800 transition-all duration-300"
                  onClick={() => handleSelectMovie(item.id)}
                >
                  <div className="relative aspect-[2/3] w-full overflow-hidden">
                    {item.poster_path ? (
                      <>
                        <Image
                          src={getPosterUrl(item.poster_path, "w300") || ""}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </>
                    ) : (
                      <div className="w-full h-full bg-zinc-900 flex flex-col items-center justify-center">
                        <FilmIcon className="w-12 h-12 text-zinc-700 mb-2" />
                        <p className="text-zinc-600 text-xs text-center px-2">
                          Sem poster
                        </p>
                      </div>
                    )}

                    <div className="absolute top-2 right-2 flex gap-2 z-10">
                      <motion.button
                        onClick={(e) => handleRemove(item.id, e)}
                        className="p-2 bg-zinc-900/90 backdrop-blur-sm hover:bg-red-600 rounded-full transition-all shadow-lg opacity-0 group-hover:opacity-100"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Remover da lista"
                      >
                        <TrashIcon className="w-4 h-4 text-zinc-50" />
                      </motion.button>
                    </div>

                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-zinc-900/90 backdrop-blur-sm px-2 py-1 rounded-full">
                      <StarIcon className="w-3 h-3 text-rose-500" />
                      <span className="text-zinc-50 text-xs font-bold">
                        {item.vote_average.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <div className="p-3">
                    <h3 className="text-zinc-50 text-sm font-semibold line-clamp-2 mb-2 leading-tight group-hover:text-rose-400 transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <CalendarIcon className="w-3 h-3" />
                      <span>{new Date(item.release_date).getFullYear()}</span>
                    </div>
                  </div>

                  <div className="absolute inset-0 ring-2 ring-transparent group-hover:ring-rose-600/50 rounded-xl transition-all pointer-events-none" />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </Modal>
  );
}

