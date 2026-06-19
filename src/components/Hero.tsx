import { useState, useEffect } from "react";
import { fetchTrending, getBackdropUrl, Movie } from "../services/tmdb";

interface HeroProps {
  onPlay: (id: number, title: string) => void;
}

export default function Hero({ onPlay }: HeroProps) {
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const getMovie = async () => {
      const movies = await fetchTrending();
      const randomIndex = Math.floor(Math.random() * Math.min(movies.length, 10));
      setMovie(movies[randomIndex] || movies[0]);
    };
    getMovie();
  }, []);

  if (!movie) {
    return (
      <div className="h-[85vh] w-full bg-gray-900" />
    );
  }

  const title = movie.title || movie.name || movie.original_name || "Untitled";
  const backdrop = getBackdropUrl(movie.backdrop_path);
  const overview = movie.overview
    ? movie.overview.length > 200
      ? movie.overview.slice(0, 200) + "..."
      : movie.overview
    : "";

  return (
    <div className="relative h-[85vh] w-full">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backdrop})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

      <div className="relative z-10 flex h-full flex-col justify-center px-6 pt-20 sm:px-12 lg:px-16">
        <h2 className="max-w-xl text-3xl font-bold text-white sm:text-5xl lg:text-6xl">
          {title}
        </h2>
        <div className="mt-4 flex items-center gap-3">
          <span className="rounded bg-yellow-400 px-2 py-0.5 text-sm font-bold text-black">
            HD
          </span>
          <span className="text-sm text-gray-300">
            ⭐ {movie.vote_average.toFixed(1)} / 10
          </span>
          <span className="text-sm text-gray-300">
            {movie.release_date?.slice(0, 4) || movie.first_air_date?.slice(0, 4) || ""}
          </span>
        </div>
        {overview && (
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-gray-200 sm:text-base">
            {overview}
          </p>
        )}
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => onPlay(movie.id, title)}
            className="flex items-center gap-2 rounded-md bg-white px-6 py-2 font-semibold text-black transition hover:bg-gray-200"
          >
            <span>▶</span> Play
          </button>
          <button className="flex items-center gap-2 rounded-md bg-gray-600/70 px-6 py-2 font-semibold text-white transition hover:bg-gray-600">
            <span>ℹ</span> More Info
          </button>
        </div>
      </div>
    </div>
  );
}
