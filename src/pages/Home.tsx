import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import MovieRow from "../components/MovieRow";
import {
  getTrending,
  getPopularMovies,
  getTopRatedMovies,
  getPopularTV,
  getTopRatedTV,
  getUpcomingMovies,
  discoverByGenre,
  type Media,
} from "../lib/tmdb";

export default function Home() {
  const [trending, setTrending] = useState<Media[]>([]);
  const [popularMovies, setPopularMovies] = useState<Media[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Media[]>([]);
  const [popularTV, setPopularTV] = useState<Media[]>([]);
  const [topRatedTV, setTopRatedTV] = useState<Media[]>([]);
  const [upcoming, setUpcoming] = useState<Media[]>([]);
  const [action, setAction] = useState<Media[]>([]);
  const [comedy, setComedy] = useState<Media[]>([]);
  const [horror, setHorror] = useState<Media[]>([]);
  const [animation, setAnimation] = useState<Media[]>([]);

  useEffect(() => {
    getTrending().then(setTrending).catch(() => {});
    getPopularMovies().then(setPopularMovies).catch(() => {});
    getTopRatedMovies().then(setTopRatedMovies).catch(() => {});
    getPopularTV().then(setPopularTV).catch(() => {});
    getTopRatedTV().then(setTopRatedTV).catch(() => {});
    getUpcomingMovies().then(setUpcoming).catch(() => {});
    discoverByGenre("movie", 28).then(setAction).catch(() => {});
    discoverByGenre("movie", 35).then(setComedy).catch(() => {});
    discoverByGenre("movie", 27).then(setHorror).catch(() => {});
    discoverByGenre("movie", 16).then(setAnimation).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-black pb-20">
      <Hero items={trending} />
      <div className="relative z-10 -mt-16 sm:-mt-28 space-y-6">
        <MovieRow title="Trending Now" items={trending} ranked />
        <MovieRow title="Popular on Streamix" items={popularMovies} />
        <MovieRow title="Popular TV Shows" items={popularTV} />
        <MovieRow title="Top Rated Movies" items={topRatedMovies} />
        <MovieRow title="Top Rated TV Shows" items={topRatedTV} />
        <MovieRow title="Coming Soon" items={upcoming} />
        <MovieRow title="Action & Adventure" items={action} />
        <MovieRow title="Comedies" items={comedy} />
        <MovieRow title="Horror Movies" items={horror} />
        <MovieRow title="Animation" items={animation} />
      </div>
    </div>
  );
}
