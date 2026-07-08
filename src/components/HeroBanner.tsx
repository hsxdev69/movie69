import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Plus, Check, Star, Info } from 'lucide-react';
import { getImageUrl } from '../hooks/useTMDB';
import { useVideoPlayer } from '../context/VideoContext';
import { useMyList } from '../context/MyListContext';
import type { Movie } from '../types';

interface HeroBannerProps {
  movies: Movie[];
  onInfoClick: (movie: Movie) => void;
}

export default function HeroBanner({ movies, onInfoClick }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { openPlayer } = useVideoPlayer();
  const { isInList, toggleList } = useMyList();

  useEffect(() => {
    if (movies.length === 0) return;
    const iv = setInterval(() => {
      setCurrentIndex(i => (i + 1) % Math.min(movies.length, 6));
    }, 6000);
    return () => clearInterval(iv);
  }, [movies]);

  const movie = movies[currentIndex];
  if (!movie) return null;

  const title = movie.title || movie.name || '';
  const year  = (movie.release_date || movie.first_air_date || '').slice(0, 4);
  const isTV  = movie.media_type === 'tv';

  return (
    <div className="relative w-full" style={{ height: '72vw', maxHeight: 420, minHeight: 260 }}>
      {/* Backdrop */}
      <AnimatePresence mode="wait">
        <motion.div
          key={movie.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img
            src={getImageUrl(movie.backdrop_path, 'w780') || ''}
            alt={title}
            className="w-full h-full object-cover object-top"
            loading="eager"
          />
          {/* Multi-layer gradient for cinematic look */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={movie.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="absolute bottom-0 left-0 right-0 px-4 pb-5"
        >
          {/* Badges */}
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-bold uppercase tracking-wide">
              {isTV ? 'Series' : 'Movie'}
            </span>
            {year && <span className="text-gray-400 text-xs">{year}</span>}
            <div className="flex items-center gap-0.5">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              <span className="text-yellow-500 text-xs font-semibold">{movie.vote_average.toFixed(1)}</span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-white text-2xl font-black leading-tight mb-1 drop-shadow-lg line-clamp-2">
            {title}
          </h2>

          {/* Overview */}
          <p className="text-gray-300 text-xs leading-relaxed line-clamp-2 mb-4">
            {movie.overview}
          </p>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={() => openPlayer(movie)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white text-black font-bold text-sm"
            >
              <Play className="w-4 h-4 fill-black" />
              Play
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={() => onInfoClick(movie)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/15 text-white font-semibold text-sm border border-white/10"
            >
              <Info className="w-4 h-4" />
              More Info
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => toggleList(movie)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
                isInList(movie.id)
                  ? 'bg-red-600 border-red-500'
                  : 'bg-white/10 border-white/10'
              }`}
            >
              {isInList(movie.id)
                ? <Check className="w-5 h-5 text-white" />
                : <Plus className="w-5 h-5 text-white" />}
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dot indicators */}
      <div className="absolute top-3 right-4 flex gap-1">
        {movies.slice(0, 6).map((_, i) => (
          <motion.button
            key={i}
            onClick={() => setCurrentIndex(i)}
            animate={{ width: i === currentIndex ? 16 : 6, opacity: i === currentIndex ? 1 : 0.4 }}
            className="h-1.5 rounded-full bg-white"
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
}
