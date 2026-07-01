import { motion } from "framer-motion";
import { Plus, Check, Play, Star } from "lucide-react";
import { imageUrl, title, releaseYear, type Media } from "../lib/tmdb";
import { useMyList } from "../context/MyListContext";
import { useDetailsModal } from "../context/DetailsModalContext";

interface MovieCardProps {
  media: Media;
  rank?: number;
}

export default function MovieCard({ media, rank }: MovieCardProps) {
  const { isInList, toggle } = useMyList();
  const { open } = useDetailsModal();
  const poster = imageUrl(media.poster_path, "w342");
  const inList = isInList(media.id);

  if (!poster && !media.backdrop_path) return null;

  return (
    <div className={`relative shrink-0 ${rank ? "pl-8" : ""}`}>
      {rank && (
        <span
          className="absolute -left-1 bottom-0 z-0 select-none font-black text-transparent leading-none"
          style={{
            WebkitTextStroke: "3px #52525b",
            fontSize: "6.5rem",
          }}
        >
          {rank}
        </span>
      )}
      <motion.div
        className="group relative z-10 w-[140px] sm:w-[170px] cursor-pointer overflow-hidden rounded-md bg-zinc-900 shadow-lg"
        whileHover={{ scale: 1.12, zIndex: 20, transition: { duration: 0.25 } }}
        onClick={() => open(media)}
      >
        <div className="aspect-[2/3] w-full overflow-hidden">
          {poster ? (
            <img src={poster} alt={title(media)} loading="lazy" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-zinc-800 p-2 text-center text-xs text-zinc-400">
              {title(media)}
            </div>
          )}
        </div>
        <motion.div
          className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black via-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100"
          transition={{ duration: 0.2 }}
        >
          <p className="mb-1 line-clamp-2 text-[11px] font-semibold text-white">{title(media)}</p>
          <div className="mb-1 flex items-center gap-1 text-[10px] text-zinc-300">
            <Star size={10} className="fill-yellow-400 text-yellow-400" />
            <span>{media.vote_average?.toFixed(1)}</span>
            <span>·</span>
            <span>{releaseYear(media)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-black hover:bg-zinc-200"
              onClick={(e) => {
                e.stopPropagation();
                open(media);
              }}
              aria-label="Play"
            >
              <Play size={12} fill="black" />
            </button>
            <button
              className="flex h-6 w-6 items-center justify-center rounded-full border border-zinc-400 bg-black/40 text-white hover:border-white"
              onClick={(e) => {
                e.stopPropagation();
                toggle(media);
              }}
              aria-label="Add to list"
            >
              {inList ? <Check size={12} /> : <Plus size={12} />}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
