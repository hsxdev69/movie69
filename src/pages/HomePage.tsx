import { useState } from 'react';
import HeroBanner from '../components/HeroBanner';
import MovieRow from '../components/MovieRow';
import MovieDetails from '../components/MovieDetails';
import AppHeader from '../components/AppHeader';
import {
  useTrending, usePopularMovies, useTopRated,
  useNowPlaying, useUpcoming, usePopularTV,
} from '../hooks/useTMDB';
import type { Movie } from '../types';

export default function HomePage() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data: trending }      = useTrending('week');
  const { data: popular }       = usePopularMovies();
  const { data: topRated }      = useTopRated('movie');
  const { data: nowPlaying }    = useNowPlaying();
  const { data: upcoming }      = useUpcoming();
  const { data: popularTV }     = usePopularTV();
  const { data: topRatedTV }    = useTopRated('tv');

  return (
    <>
      <AppHeader transparent />

      <div className="scroll-page pb-24">
        {/* Hero */}
        <HeroBanner movies={trending} onInfoClick={setSelectedMovie} />

        {/* Categories */}
        <div className="mt-4">
          <MovieRow title="🔥 Trending This Week" movies={trending} onMovieClick={setSelectedMovie} variant="wide" />
          <MovieRow title="🏆 Top 10 Movies"      movies={popular.slice(0,10)} onMovieClick={setSelectedMovie} rank />
          <MovieRow title="🎬 Now Playing"         movies={nowPlaying} onMovieClick={setSelectedMovie} variant="portrait" />
          <MovieRow title="⭐ Top Rated"            movies={topRated} onMovieClick={setSelectedMovie} variant="portrait" />
          <MovieRow title="📺 Popular TV Shows"    movies={popularTV} onMovieClick={setSelectedMovie} variant="landscape" />
          <MovieRow title="🏆 Top 10 TV Shows"     movies={topRatedTV.slice(0,10)} onMovieClick={setSelectedMovie} rank />
          <MovieRow title="📅 Coming Soon"          movies={upcoming} onMovieClick={setSelectedMovie} variant="wide" />
        </div>
      </div>

      {selectedMovie && (
        <MovieDetails movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </>
  );
}
