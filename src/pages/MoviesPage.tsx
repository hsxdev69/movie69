import { useState } from 'react';
import { motion } from 'framer-motion';
import MovieRow from '../components/MovieRow';
import MovieDetails from '../components/MovieDetails';
import AppHeader from '../components/AppHeader';
import { usePopularMovies, useTopRated, useNowPlaying, useUpcoming, useGenres, useDiscoverByGenre } from '../hooks/useTMDB';
import type { Movie } from '../types';

export default function MoviesPage() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

  const { data: popular }   = usePopularMovies();
  const { data: topRated }  = useTopRated('movie');
  const { data: nowPlaying }= useNowPlaying();
  const { data: upcoming }  = useUpcoming();
  const genres              = useGenres();
  const { data: byGenre }   = useDiscoverByGenre(selectedGenre ?? 28, 'movie');

  const movieGenreIds = [28,12,16,35,80,18,10751,14,27,10749,878,53,10752,37];
  const movieGenres  = genres.filter(g => movieGenreIds.includes(g.id));

  return (
    <>
      <AppHeader title="Movies" />

      <div className="scroll-page pt-16 pb-24">
        {/* Genre chips */}
        <div className="scroll-x flex gap-2 px-4 py-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setSelectedGenre(null)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
              selectedGenre === null
                ? 'bg-red-600 text-white'
                : 'bg-white/10 text-gray-300'
            }`}
          >
            All
          </motion.button>
          {movieGenres.map(g => (
            <motion.button
              key={g.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedGenre(g.id)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                selectedGenre === g.id
                  ? 'bg-red-600 text-white'
                  : 'bg-white/10 text-gray-300'
              }`}
            >
              {g.name}
            </motion.button>
          ))}
        </div>

        {selectedGenre ? (
          <MovieRow
            title={movieGenres.find(g => g.id === selectedGenre)?.name ?? 'Genre'}
            movies={byGenre}
            onMovieClick={setSelectedMovie}
            variant="portrait"
          />
        ) : (
          <>
            <MovieRow title="🎬 Now Playing"   movies={nowPlaying} onMovieClick={setSelectedMovie} variant="wide" />
            <MovieRow title="🔥 Popular"        movies={popular}    onMovieClick={setSelectedMovie} variant="portrait" />
            <MovieRow title="🏆 Top 10"         movies={popular.slice(0,10)} onMovieClick={setSelectedMovie} rank />
            <MovieRow title="⭐ Top Rated"       movies={topRated}   onMovieClick={setSelectedMovie} variant="portrait" />
            <MovieRow title="📅 Coming Soon"     movies={upcoming}   onMovieClick={setSelectedMovie} variant="wide" />
          </>
        )}
      </div>

      {selectedMovie && (
        <MovieDetails movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </>
  );
}
