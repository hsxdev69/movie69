import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Star, Plus, Check } from 'lucide-react';
import { getImageUrl } from '../hooks/useTMDB';
import { useVideoPlayer } from '../context/VideoContext';
import { useMyList } from '../context/MyListContext';
import type { Movie } from '../types';

interface SeeAllViewProps {
  title: string;
  movies: Movie[];
  onClose: () => void;
  onMovieClick: (movie: Movie) => void;
}

export default function SeeAllView({ title, movies, onClose, onMovieClick }: SeeAllViewProps) {
  const { openPlayer } = useVideoPlayer();
  const { isInList, toggleList } = useMyList();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 34 }}
        className="fixed inset-0 z-50 bg-black flex flex-col"
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-4 py-3 bg-black/95 border-b border-white/5 flex-shrink-0"
          style={{ paddingTop: 'max(12px, env(safe-area-inset-top, 12px))' }}
        >
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.button>
          <h1 className="text-white font-bold text-lg truncate">{title}</h1>
          <span className="text-gray-500 text-xs ml-auto">{movies.length} titles</span>
        </div>

        {/* Grid */}
        <div className="scroll-page flex-1 px-4 py-4 pb-10">
          <div className="grid grid-cols-3 gap-2.5">
            {movies.map((movie, i) => {
              const inList = isInList(movie.id);
              return (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.5) }}
                  className="cursor-pointer"
                >
                  <motion.div whileTap={{ scale: 0.93 }} onClick={() => onMovieClick(movie)}>
                    <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-gray-900">
                      <img
                        src={getImageUrl(movie.poster_path, 'w342') || ''}
                        alt={movie.title || movie.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                      {/* Add to list */}
                      <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={e => { e.stopPropagation(); toggleList(movie); }}
                        className={`absolute top-1.5 right-1.5 w-7 h-7 rounded-full backdrop-blur-md flex items-center justify-center border ${
                          inList
                            ? 'bg-red-600 border-red-500'
                            : 'bg-black/40 border-white/30'
                        }`}
                      >
                        {inList
                          ? <Check className="w-3.5 h-3.5 text-white" />
                          : <Plus className="w-3.5 h-3.5 text-white" />}
                      </motion.button>

                      {/* Play */}
                      <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={e => { e.stopPropagation(); openPlayer(movie); }}
                        className="absolute bottom-1.5 right-1.5 w-7 h-7 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center"
                      >
                        <Play className="w-3 h-3 text-white fill-white ml-0.5" />
                      </motion.button>
                    </div>
                    <p className="text-white text-[10px] font-semibold mt-1 truncate">
                      {movie.title || movie.name}
                    </p>
                    <div className="flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
                      <span className="text-gray-500 text-[9px]">{movie.vote_average.toFixed(1)}</span>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
