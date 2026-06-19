import { useCallback, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MovieRow from "./components/MovieRow";
import SearchResults from "./components/SearchResults";
import PlayerModal from "./components/PlayerModal";
import Footer from "./components/Footer";
import {
  fetchTrending,
  fetchPopularMovies,
  fetchTopRated,
  fetchUpcoming,
  fetchActionMovies,
  fetchComedyMovies,
  fetchHorrorMovies,
  fetchDocumentaries,
  fetchTVShows,
} from "./services/tmdb";

export default function App() {
  const [player, setPlayer] = useState<{ id: number; title: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const trendingFn = useCallback(() => fetchTrending(), []);
  const popularFn = useCallback(() => fetchPopularMovies(), []);
  const topRatedFn = useCallback(() => fetchTopRated(), []);
  const upcomingFn = useCallback(() => fetchUpcoming(), []);
  const actionFn = useCallback(() => fetchActionMovies(), []);
  const comedyFn = useCallback(() => fetchComedyMovies(), []);
  const horrorFn = useCallback(() => fetchHorrorMovies(), []);
  const docsFn = useCallback(() => fetchDocumentaries(), []);
  const tvFn = useCallback(() => fetchTVShows(), []);

  const handlePlay = (id: number, title: string) => {
    setPlayer({ id, title });
  };

  const handleClose = () => {
    setPlayer(null);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleHome = () => {
    setSearchQuery("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar onSearch={handleSearch} searchQuery={searchQuery} onHome={handleHome} />

      {searchQuery ? (
        <SearchResults query={searchQuery} onPlay={handlePlay} />
      ) : (
        <>
          <Hero onPlay={handlePlay} />
          <div className="-mt-20 relative z-20 pb-8">
            <MovieRow title="Trending Now" fetchMovies={trendingFn} onPlay={handlePlay} />
            <MovieRow title="Popular on Flixily" fetchMovies={popularFn} onPlay={handlePlay} />
            <MovieRow title="Top Rated" fetchMovies={topRatedFn} onPlay={handlePlay} />
            <MovieRow title="Action Movies" fetchMovies={actionFn} onPlay={handlePlay} />
            <MovieRow title="Comedy Movies" fetchMovies={comedyFn} onPlay={handlePlay} />
            <MovieRow title="Horror Movies" fetchMovies={horrorFn} onPlay={handlePlay} />
            <MovieRow title="Upcoming" fetchMovies={upcomingFn} onPlay={handlePlay} />
            <MovieRow title="Popular TV Shows" fetchMovies={tvFn} onPlay={handlePlay} />
            <MovieRow title="Documentaries" fetchMovies={docsFn} onPlay={handlePlay} />
          </div>
        </>
      )}

      {player && (
        <PlayerModal tmdbId={player.id} title={player.title} onClose={handleClose} />
      )}
      <Footer />
    </div>
  );
}
