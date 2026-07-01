import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import Hero from "../components/Hero";
import MovieRow from "../components/MovieRow";
import {
  getGenres,
  discoverByGenre,
  getPopularMovies,
  getTopRatedMovies,
  getPopularTV,
  getTopRatedTV,
  type Genre,
  type Media,
  type MediaType,
} from "../lib/tmdb";

interface BrowseProps {
  mediaType: MediaType;
  heading: string;
}

export default function Browse({ mediaType, heading }: BrowseProps) {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [featured, setFeatured] = useState<Media[]>([]);
  const [popular, setPopular] = useState<Media[]>([]);
  const [topRated, setTopRated] = useState<Media[]>([]);
  const [genreRows, setGenreRows] = useState<Record<number, Media[]>>({});
  const [filtered, setFiltered] = useState<Media[]>([]);

  useEffect(() => {
    getGenres(mediaType).then(setGenres).catch(() => {});
    const popularFn = mediaType === "movie" ? getPopularMovies : getPopularTV;
    const topRatedFn = mediaType === "movie" ? getTopRatedMovies : getTopRatedTV;
    popularFn().then((r) => {
      setPopular(r);
      setFeatured(r);
    });
    topRatedFn().then(setTopRated);
  }, [mediaType]);

  useEffect(() => {
    if (genres.length === 0) return;
    genres.slice(0, 6).forEach((g) => {
      discoverByGenre(mediaType, g.id).then((res) =>
        setGenreRows((prev) => ({ ...prev, [g.id]: res }))
      );
    });
  }, [genres, mediaType]);

  useEffect(() => {
    if (selectedGenre) {
      discoverByGenre(mediaType, selectedGenre.id).then(setFiltered);
    }
  }, [selectedGenre, mediaType]);

  return (
    <div className="min-h-screen bg-black pb-20">
      <Hero items={featured} />
      <div className="relative z-10 -mt-16 sm:-mt-24 space-y-6">
        <div className="flex items-center justify-between px-4 sm:px-8">
          <h1 className="text-xl sm:text-2xl font-bold text-white">{heading}</h1>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex items-center gap-1 rounded border border-zinc-500 bg-zinc-900/80 px-3 py-1.5 text-sm text-white"
            >
              {selectedGenre?.name ?? "Genres"} <ChevronDown size={16} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 z-30 mt-1 max-h-72 w-48 overflow-y-auto rounded bg-zinc-900 border border-zinc-700 shadow-xl">
                <button
                  className="block w-full px-4 py-2 text-left text-sm text-zinc-200 hover:bg-zinc-800"
                  onClick={() => {
                    setSelectedGenre(null);
                    setDropdownOpen(false);
                  }}
                >
                  All Genres
                </button>
                {genres.map((g) => (
                  <button
                    key={g.id}
                    className="block w-full px-4 py-2 text-left text-sm text-zinc-200 hover:bg-zinc-800"
                    onClick={() => {
                      setSelectedGenre(g);
                      setDropdownOpen(false);
                    }}
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {selectedGenre ? (
          <MovieRow title={selectedGenre.name} items={filtered} />
        ) : (
          <>
            <MovieRow title="Popular" items={popular} ranked />
            <MovieRow title="Top Rated" items={topRated} />
            {genres.slice(0, 6).map((g) => (
              <MovieRow key={g.id} title={g.name} items={genreRows[g.id] ?? []} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
