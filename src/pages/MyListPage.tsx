import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Play, Film, X } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import MovieDetails from '../components/MovieDetails';
import { getImageUrl } from '../hooks/useTMDB';
import { useVideoPlayer } from '../context/VideoContext';
import { useMyList } from '../context/MyListContext';
import type { Movie } from '../types';

export default function MyListPage() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const { myList, removeFromList } = useMyList();
  const { openPlayer } = useVideoPlayer();

  return (
    <>
      <AppHeader title="My List" />

      <div className="scroll-page pt-16 pb-24">
        {myList.length > 0 ? (
          <div className="px-4 pt-2">
            <p className="text-gray-500 text-xs mb-4">{myList.length} title{myList.length > 1 ? 's' : ''} saved</p>

            <div className="grid grid-cols-3 gap-2.5">
              <AnimatePresence>
                {myList.map((movie, i) => (
                  <motion.div
                    key={movie.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: i * 0.04 }}
                    className="cursor-pointer"
                  >
                    <motion.div whileTap={{ scale: 0.93 }} onClick={() => setSelectedMovie(movie)}>
                      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-gray-900">
                        <img
                          src={getImageUrl(movie.poster_path, 'w342') || ''}
                          alt={movie.title || movie.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                        {/* Remove button */}
                        <motion.button
                          whileTap={{ scale: 0.8 }}
                          onClick={e => { e.stopPropagation(); removeFromList(movie.id); }}
                          className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center"
                        >
                          <X className="w-3.5 h-3.5 text-white" />
                        </motion.button>

                        {/* Play button */}
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={e => { e.stopPropagation(); openPlayer(movie); }}
                          className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center border border-white/30"
                        >
                          <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
                        </motion.button>
                      </div>
                      <p className="text-white text-[10px] font-semibold mt-1 truncate">{movie.title || movie.name}</p>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-32 px-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-5"
            >
              <Heart className="w-9 h-9 text-gray-600" />
            </motion.div>
            <h2 className="text-white font-bold text-xl mb-2">Your list is empty</h2>
            <p className="text-gray-500 text-sm text-center">
              Tap the <span className="text-white font-bold">+</span> button on any movie or show to save it here.
            </p>
            <div className="mt-6 flex items-center gap-2 px-5 py-3 bg-white/5 rounded-2xl border border-white/10">
              <Film className="w-4 h-4 text-red-500" />
              <span className="text-gray-400 text-xs">Browse Home, Movies or TV tabs to find content</span>
            </div>
          </div>
        )}
      </div>

      {selectedMovie && (
        <MovieDetails movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </>
  );
}
