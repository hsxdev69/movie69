import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, Clock } from 'lucide-react';
import { useSearch, getImageUrl, useTrending } from '../hooks/useTMDB';
import type { Movie } from '../types';
import MovieDetails from '../components/MovieDetails';

export default function SearchPage() {
  const [query, setQuery]             = useState('');
  const [selectedMovie, setSelected]  = useState<Movie | null>(null);
  const inputRef                      = useRef<HTMLInputElement>(null);
  const { data: results, loading }    = useSearch(query);
  const { data: trending }            = useTrending('day');


  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  const handleClick = (movie: Movie) => {
    setSelected(movie);
  };

  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Animation', 'Fantasy', 'Crime'];

  return (
    <div className="scroll-page pt-safe pb-24" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
      {/* Search bar */}
      <div className="sticky top-0 z-20 bg-black/95 backdrop-blur-md px-4 pt-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Movies, shows, genres..."
            className="w-full bg-white/10 border border-white/10 rounded-2xl py-3.5 pl-11 pr-10 text-white placeholder-gray-500 focus:outline-none focus:border-red-600 text-sm"
          />
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                onClick={() => setQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Content */}
      <div className="px-4">
        {query.trim() ? (
          /* Search results */
          loading ? (
            <div className="flex justify-center py-16">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full"
              />
            </div>
          ) : results.length > 0 ? (
            <div>
              <p className="text-gray-500 text-xs mb-3">{results.length} results</p>
              <div className="grid grid-cols-3 gap-2.5">
                {results.map((movie, i) => (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => handleClick(movie)}
                    className="cursor-pointer"
                  >
                    <div className="aspect-[2/3] rounded-xl overflow-hidden bg-gray-900 relative">
                      <img
                        src={getImageUrl(movie.poster_path, 'w342') || ''}
                        alt={movie.title || movie.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                    <p className="text-white text-[10px] font-medium mt-1 truncate">
                      {movie.title || movie.name}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <Search className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-400 font-medium">No results for &ldquo;{query}&rdquo;</p>
              <p className="text-gray-600 text-sm mt-1">Try another search</p>
            </div>
          )
        ) : (
          /* Empty state - trending & genres */
          <div>
            {/* Genre grid */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-red-500" />
                <h3 className="text-white font-bold text-sm">Browse by Genre</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {genres.map((g, i) => (
                  <motion.button
                    key={g}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => setQuery(g)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="py-3.5 rounded-2xl text-white font-semibold text-sm relative overflow-hidden"
                    style={{
                      background: `hsl(${(i * 37) % 360}, 60%, 20%)`,
                      border: `1px solid hsl(${(i * 37) % 360}, 60%, 30%)`,
                    }}
                  >
                    {g}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Trending now */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-gray-400" />
                <h3 className="text-white font-bold text-sm">Trending Today</h3>
              </div>
              <div className="space-y-3">
                {trending.slice(0, 8).map((movie, i) => (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleClick(movie)}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <span className="text-gray-600 font-black text-xl w-6 text-center flex-shrink-0">{i + 1}</span>
                    <div className="w-14 h-9 rounded-lg overflow-hidden bg-gray-900 flex-shrink-0">
                      <img
                        src={getImageUrl(movie.backdrop_path, 'w300') || ''}
                        alt={movie.title || movie.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold truncate">{movie.title || movie.name}</p>
                      <p className="text-gray-500 text-xs capitalize">{movie.media_type}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedMovie && (
        <MovieDetails movie={selectedMovie} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
