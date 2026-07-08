import { useState } from 'react';
import { motion } from 'framer-motion';
import MovieRow from '../components/MovieRow';
import MovieDetails from '../components/MovieDetails';
import AppHeader from '../components/AppHeader';
import { useTopRated, usePopularTV, useGenres, useDiscoverByGenre } from '../hooks/useTMDB';
import type { Movie } from '../types';

export default function TVShowsPage() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

  const { data: popular }  = usePopularTV();
  const { data: topRated } = useTopRated('tv');
  const genres             = useGenres();
  const { data: byGenre }  = useDiscoverByGenre(selectedGenre ?? 18, 'tv');

  const tvGenreIds  = [10759,16,35,80,18,10751,10762,9648,10763,10764,10765,10766,10767,37];
  const tvGenres    = genres.filter(g => tvGenreIds.includes(g.id));

  return (
    <>
      <AppHeader title="TV Shows" />

      <div className="scroll-page pt-16 pb-24">
        {/* Genre chips */}
        <div className="scroll-x flex gap-2 px-4 py-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setSelectedGenre(null)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
              selectedGenre === null ? 'bg-red-600 text-white' : 'bg-white/10 text-gray-300'
            }`}
          >
            All
          </motion.button>
          {tvGenres.map(g => (
            <motion.button
              key={g.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedGenre(g.id)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                selectedGenre === g.id ? 'bg-red-600 text-white' : 'bg-white/10 text-gray-300'
              }`}
            >
              {g.name}
            </motion.button>
          ))}
        </div>

        {selectedGenre ? (
          <MovieRow
            title={tvGenres.find(g => g.id === selectedGenre)?.name ?? 'Genre'}
            movies={byGenre}
            onMovieClick={setSelectedMovie}
            variant="portrait"
          />
        ) : (
          <>
            <MovieRow title="📺 Popular Shows"   movies={popular}   onMovieClick={setSelectedMovie} variant="wide" />
            <MovieRow title="🏆 Top 10 TV"        movies={popular.slice(0,10)} onMovieClick={setSelectedMovie} rank />
            <MovieRow title="⭐ Top Rated"         movies={topRated}  onMovieClick={setSelectedMovie} variant="portrait" />
            <MovieRow title="🔥 Binge-Worthy"     movies={[...popular].reverse()} onMovieClick={setSelectedMovie} variant="landscape" />
          </>
        )}
      </div>

      {selectedMovie && (
        <MovieDetails movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </>
  );
}
