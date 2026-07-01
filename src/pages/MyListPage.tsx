import { motion } from "framer-motion";
import { Film } from "lucide-react";
import { useMyList } from "../context/MyListContext";
import MovieCard from "../components/MovieCard";

export default function MyListPage() {
  const { list } = useMyList();

  return (
    <div className="min-h-screen bg-black pb-20 pt-24 px-4 sm:px-8">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl sm:text-4xl font-black text-white mb-8"
      >
        My List
      </motion.h1>

      {list.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-zinc-500">
          <Film size={48} />
          <p className="text-lg">Your list is empty.</p>
          <p className="text-sm">Add movies and shows to watch them later.</p>
        </div>
      ) : (
        <motion.div layout className="flex flex-wrap gap-3">
          {list.map((m) => (
            <MovieCard key={m.id} media={m} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
