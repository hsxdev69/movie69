import { useState, useEffect } from "react";
import { searchMovies, getImageUrl, Movie } from "../services/tmdb";

interface SearchResultsProps {
  query: string;
  onPlay: (id: number, title: string) => void;
}

export default function SearchResults({ query, onPlay }: SearchResultsProps) {
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await searchMovies(query);
        setResults(data);
      } catch {
        setResults([]);
      }
      setLoading(false);
    };
    load();
  }, [query]);

  if (loading) {
    return (
      <div className="min-h-[60vh] px-6 pt-28 sm:px-12 lg:px-16">
        <h2 className="mb-6 text-xl font-semibold text-white">
          Searching for "{query}"...
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[2/3] animate-pulse rounded-sm bg-gray-800"
            />
          ))}
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 pt-28 text-center">
        <p className="text-5xl mb-4">🔍</p>
        <h2 className="mb-2 text-2xl font-semibold text-white">
          No results found for "{query}"
        </h2>
        <p className="text-gray-400">
          Try searching for a different movie or TV show title.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 pt-28 pb-12 sm:px-12 lg:px-16">
      <h2 className="mb-6 text-xl font-semibold text-white">
        Results for "{query}" ({results.length})
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {results.map((movie) => {
          const title = movie.title || movie.name || "Untitled";
          const year =
            movie.release_date?.slice(0, 4) ||
            movie.first_air_date?.slice(0, 4) ||
            "";
          return (
            <div
              key={movie.id}
              onClick={() => onPlay(movie.id, title)}
              className="group cursor-pointer overflow-hidden rounded-sm"
            >
              <div className="relative aspect-[2/3] overflow-hidden bg-gray-800">
                <img
                  src={getImageUrl(movie.poster_path, "w342")}
                  alt={title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/40" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-lg">
                    ▶
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <p className="truncate text-sm font-medium text-white">
                  {title}
                </p>
                <p className="text-xs text-gray-400">
                  {year && `${year} · `}⭐ {movie.vote_average.toFixed(1)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
