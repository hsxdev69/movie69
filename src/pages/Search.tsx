import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { SearchX } from "lucide-react";
import { searchMulti, type Media } from "../lib/tmdb";
import MovieCard from "../components/MovieCard";

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";
  const [results, setResults] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q) {
      setResults([]);
      return;
    }
    setLoading(true);
    searchMulti(q)
      .then(setResults)
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <div className="min-h-screen bg-black pb-20 pt-24 px-4 sm:px-8">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl sm:text-2xl font-bold text-white mb-6"
      >
        {q ? `Results for "${q}"` : "Search for movies and TV shows"}
      </motion.h1>

      {loading && (
        <div className="flex justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />
        </div>
      )}

      {!loading && q && results.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-20 text-zinc-500">
          <SearchX size={48} />
          <p>No results found for "{q}"</p>
        </div>
      )}

      <motion.div layout className="flex flex-wrap gap-3">
        {results.map((m) => (
          <MovieCard key={m.id} media={m} />
        ))}
      </motion.div>
    </div>
  );
}
