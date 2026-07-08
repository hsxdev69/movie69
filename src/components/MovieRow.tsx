import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';
import SeeAllView from './SeeAllView';
import type { Movie } from '../types';
import { getImageUrl } from '../hooks/useTMDB';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
  variant?: 'portrait' | 'landscape' | 'wide';
  rank?: boolean;
}

export default function MovieRow({ title, movies, onMovieClick, variant = 'portrait', rank = false }: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showAll, setShowAll] = useState(false);

  if (!movies.length) return null;

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        {/* Row header */}
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="text-white text-base font-bold">{title}</h2>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowAll(true)}
            className="flex items-center gap-0.5 text-gray-500 text-xs font-medium active:text-white"
          >
            See all <ChevronRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>

        {/* Horizontal scroll */}
        <div ref={scrollRef} className="scroll-x flex gap-3 px-4">
          {movies.map((movie, index) =>
            rank ? (
              <RankedCard key={movie.id} movie={movie} index={index} onClick={onMovieClick} rank={index + 1} />
            ) : (
              <MovieCard key={movie.id} movie={movie} index={index} onClick={onMovieClick} variant={variant} />
            )
          )}
          <div className="flex-shrink-0 w-2" />
        </div>
      </motion.section>

      {/* See All full-screen view */}
      <AnimatePresence>
        {showAll && (
          <SeeAllView
            title={title}
            movies={movies}
            onClose={() => setShowAll(false)}
            onMovieClick={m => { setShowAll(false); onMovieClick(m); }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// Ranked card component
interface RankedCardProps {
  movie: Movie;
  index: number;
  onClick: (m: Movie) => void;
  rank: number;
}

function RankedCard({ movie, index, onClick, rank }: RankedCardProps) {
  const [loaded, setLoaded] = useState(false);
  const title = movie.title || movie.name || '';

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className="flex-shrink-0 flex items-end w-32"
    >
      {/* Rank number */}
      <span
        className="text-[5rem] font-black leading-none select-none flex-shrink-0"
        style={{
          WebkitTextStroke: '2px rgba(255,255,255,0.15)',
          color: 'transparent',
          marginRight: '-14px',
          zIndex: 0,
        }}
      >
        {rank}
      </span>

      {/* Card */}
      <motion.div
        whileTap={{ scale: 0.93 }}
        onClick={() => onClick(movie)}
        className="relative z-10 flex-shrink-0 cursor-pointer"
      >
        <div className="w-20 aspect-[2/3] rounded-xl overflow-hidden bg-gray-900">
          {!loaded && <div className="absolute inset-0 skeleton rounded-xl" />}
          <img
            src={getImageUrl(movie.poster_path, 'w342') || ''}
            alt={title}
            className={`w-full h-full object-cover ${loaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setLoaded(true)}
            loading="lazy"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
