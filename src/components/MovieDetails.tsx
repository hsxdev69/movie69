import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Plus, Check, ThumbsUp, Star, Clock, Calendar } from 'lucide-react';
import { useMovieDetails, getImageUrl } from '../hooks/useTMDB';
import { useVideoPlayer } from '../context/VideoContext';
import { useMyList } from '../context/MyListContext';
import type { Movie } from '../types';

interface MovieDetailsProps {
  movie: Movie;
  onClose: () => void;
}

export default function MovieDetails({ movie, onClose }: MovieDetailsProps) {
  const type = movie.media_type === 'tv' ? 'tv' : 'movie';
  const { data: details } = useMovieDetails(movie.id, type);
  const { openPlayer } = useVideoPlayer();
  const { isInList, toggleList } = useMyList();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const title = movie.title || movie.name || '';
  const year  = (movie.release_date || movie.first_air_date || '').slice(0, 4);

  const handlePlay = () => {
    openPlayer(movie);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* Bottom sheet / modal */}
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 35 }}
          className="relative w-full max-w-lg bg-[#181818] rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl"
          style={{ maxHeight: '92dvh' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Drag handle */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-white/20 z-10" />

          {/* Close btn */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center"
          >
            <X className="w-4 h-4 text-white" />
          </motion.button>

          {/* Scrollable content */}
          <div className="overflow-y-auto" style={{ maxHeight: '92dvh', scrollbarWidth: 'none' }}>
            {/* Backdrop */}
            <div className="relative aspect-video w-full flex-shrink-0">
              <img
                src={getImageUrl(movie.backdrop_path, 'w780') || ''}
                alt={title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-black/20 to-transparent" />

              {/* Big play button */}
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={handlePlay}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center">
                  <Play className="w-7 h-7 text-white fill-white ml-1" />
                </div>
              </motion.button>
            </div>

            <div className="px-5 pt-4 pb-8">
              {/* Title */}
              <h2 className="text-white text-2xl font-black mb-1">{title}</h2>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                  <span className="text-yellow-500 font-bold">{movie.vote_average.toFixed(1)}</span>
                </div>
                {year && (
                  <div className="flex items-center gap-1 text-gray-400">
                    <Calendar className="w-3.5 h-3.5" />
                    {year}
                  </div>
                )}
                {details?.runtime && (
                  <div className="flex items-center gap-1 text-gray-400">
                    <Clock className="w-3.5 h-3.5" />
                    {Math.floor(details.runtime / 60)}h {details.runtime % 60}m
                  </div>
                )}
                {details?.number_of_seasons && (
                  <span className="text-gray-400">{details.number_of_seasons} Seasons</span>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2.5 mb-5">
                <motion.button
                  whileTap={{ scale: 0.93 }}
                  onClick={handlePlay}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-white rounded-2xl text-black font-bold text-sm"
                >
                  <Play className="w-4 h-4 fill-black" />
                  Play Now
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={() => toggleList(movie)}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors ${
                    isInList(movie.id)
                      ? 'bg-red-600 border-red-500'
                      : 'bg-white/10 border-white/10'
                  }`}
                >
                  {isInList(movie.id)
                    ? <Check className="w-5 h-5 text-white" />
                    : <Plus className="w-5 h-5 text-white" />}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10"
                >
                  <ThumbsUp className="w-5 h-5 text-white" />
                </motion.button>
              </div>

              {/* Overview */}
              <p className="text-gray-300 text-sm leading-relaxed mb-5">{movie.overview}</p>

              {/* Genres */}
              {details?.genres && details.genres.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {details.genres.map(g => (
                    <span key={g.id} className="px-3 py-1 bg-white/8 text-gray-400 text-xs rounded-full border border-white/10">
                      {g.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Tagline */}
              {details?.tagline && (
                <p className="text-red-400 text-sm italic mb-5">"{details.tagline}"</p>
              )}

              {/* Cast */}
              {details?.credits?.cast && details.credits.cast.length > 0 && (
                <div className="mb-5">
                  <h3 className="text-white font-bold text-sm mb-3">Cast</h3>
                  <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                    {details.credits.cast.slice(0, 10).map(actor => (
                      <div key={actor.id} className="flex-shrink-0 text-center w-16">
                        <div className="w-12 h-12 mx-auto rounded-full overflow-hidden bg-gray-800 mb-1">
                          {actor.profile_path ? (
                            <img
                              src={getImageUrl(actor.profile_path, 'w185') || ''}
                              alt={actor.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm font-bold">
                              {actor.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <p className="text-white text-[9px] font-medium truncate">{actor.name}</p>
                        <p className="text-gray-600 text-[8px] truncate">{actor.character}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* More Like This */}
              {details?.similar?.results && details.similar.results.length > 0 && (
                <div>
                  <h3 className="text-white font-bold text-sm mb-3">More Like This</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {details.similar.results.slice(0, 6).map(sim => (
                      <motion.div
                        key={sim.id}
                        whileTap={{ scale: 0.93 }}
                        onClick={() => { openPlayer(sim as Movie); onClose(); }}
                        className="cursor-pointer group relative"
                      >
                        <div className="aspect-video rounded-xl overflow-hidden bg-gray-900">
                          <img
                            src={getImageUrl(sim.backdrop_path, 'w300') || ''}
                            alt={sim.title || sim.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-active:opacity-100">
                            <Play className="w-6 h-6 text-white fill-white" />
                          </div>
                        </div>
                        <p className="text-gray-400 text-[9px] mt-1 truncate">{sim.title || sim.name}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
