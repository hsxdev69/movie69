import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Star } from 'lucide-react';
import { getImageUrl } from '../hooks/useTMDB';
import { useVideoPlayer } from '../context/VideoContext';
import type { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  index: number;
  onClick: (movie: Movie) => void;
  variant?: 'portrait' | 'landscape' | 'wide';
}

export default function MovieCard({ movie, index, onClick, variant = 'portrait' }: MovieCardProps) {
  const [loaded, setLoaded] = useState(false);
  const { openPlayer } = useVideoPlayer();

  const title = movie.title || movie.name || '';
  const year  = (movie.release_date || movie.first_air_date || '').slice(0, 4);

  const isLandscape = variant === 'landscape' || variant === 'wide';
  const imgPath = isLandscape ? movie.backdrop_path : movie.poster_path;
  const imgSize = isLandscape ? 'w500' : 'w342';

  const cardW = variant === 'wide'      ? 'w-64'
              : variant === 'landscape' ? 'w-44'
              : 'w-28';
  const aspect = isLandscape ? 'aspect-video' : 'aspect-[2/3]';

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className={`flex-shrink-0 ${cardW}`}
    >
      <motion.div
        whileTap={{ scale: 0.94 }}
        onClick={() => onClick(movie)}
        className="relative cursor-pointer"
      >
        {/* Image */}
        <div className={`relative ${aspect} rounded-xl overflow-hidden bg-gray-900`}>
          {!loaded && <div className="absolute inset-0 skeleton rounded-xl" />}
          <img
            src={getImageUrl(imgPath, imgSize) || ''}
            alt={title}
            className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setLoaded(true)}
            loading="lazy"
          />

          {/* Bottom gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* Play button overlay */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={e => { e.stopPropagation(); openPlayer(movie); }}
            className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center"
          >
            <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
          </motion.button>

          {/* Type badge */}
          <div className="absolute top-1.5 left-1.5">
            <span className="px-1.5 py-0.5 bg-red-600/90 text-white text-[9px] font-bold rounded-md uppercase">
              {movie.media_type === 'tv' ? 'TV' : 'HD'}
            </span>
          </div>
        </div>

        {/* Title + rating */}
        <div className="mt-1.5 px-0.5">
          <p className="text-white text-[11px] font-semibold truncate">{title}</p>
          <div className="flex items-center gap-1 mt-0.5">
            {year && <span className="text-gray-500 text-[10px]">{year}</span>}
            <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
            <span className="text-gray-400 text-[10px]">{movie.vote_average.toFixed(1)}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
