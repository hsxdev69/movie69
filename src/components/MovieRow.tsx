import { useRef, useState, useEffect } from "react";
import { Movie, getImageUrl } from "../services/tmdb";

interface MovieRowProps {
  title: string;
  fetchMovies: () => Promise<Movie[]>;
  onPlay: (id: number, title: string) => void;
}

export default function MovieRow({ title, fetchMovies, onPlay }: MovieRowProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchMovies();
        setMovies(data.filter((m) => m.poster_path));
      } catch {
        // silently fail
      }
      setLoading(false);
    };
    load();
  }, [fetchMovies]);

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth * 0.7
          : scrollLeft + clientWidth * 0.7;
      rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="mb-8 px-6 sm:px-12 lg:px-16">
        <h3 className="mb-3 text-lg font-semibold text-white">{title}</h3>
        <div className="flex gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[140px] w-[230px] flex-shrink-0 animate-pulse rounded-sm bg-gray-800 sm:h-[170px] sm:w-[280px]"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="group/row mb-8">
      <h3 className="mb-3 px-6 text-lg font-semibold text-white sm:px-12 lg:px-16">
        {title}
      </h3>
      <div className="relative">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-0 z-20 hidden h-full w-12 items-center justify-center bg-black/50 text-3xl text-white transition group-hover/row:flex"
        >
          ‹
        </button>

        <div
          ref={rowRef}
          className="flex gap-1.5 overflow-x-scroll scroll-smooth px-6 sm:px-12 lg:px-16 no-scrollbar"
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => onPlay(movie.id, movie.title || movie.name || "Untitled")}
              className="h-[140px] w-[230px] flex-shrink-0 cursor-pointer overflow-hidden rounded-sm transition-transform duration-300 hover:scale-110 hover:z-10 sm:h-[170px] sm:w-[280px]"
            >
              <img
                src={getImageUrl(movie.poster_path, "w342")}
                alt={movie.title || movie.name || ""}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-0 z-20 hidden h-full w-12 items-center justify-center bg-black/50 text-3xl text-white transition group-hover/row:flex"
        >
          ›
        </button>
      </div>
    </div>
  );
}
