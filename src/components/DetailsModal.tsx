import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Play, Plus, Check, Star } from "lucide-react";
import { getDetails, imageUrl, title, releaseYear, type MediaDetails, type MediaType } from "../lib/tmdb";
import { useMyList } from "../context/MyListContext";
import MovieCard from "./MovieCard";
import VideoPlayer from "./VideoPlayer";

interface DetailsModalProps {
  id: number;
  mediaType: MediaType;
  onClose: () => void;
}

export default function DetailsModal({ id, mediaType, onClose }: DetailsModalProps) {
  const [data, setData] = useState<MediaDetails | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const { isInList, toggle } = useMyList();

  useEffect(() => {
    let active = true;
    setData(null);
    setShowPlayer(false);
    getDetails(mediaType, id).then((d) => {
      if (active) setData(d);
    });
    return () => {
      active = false;
    };
  }, [id, mediaType]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const inList = data ? isInList(data.id) : false;

  if (showPlayer && data) {
    return (
      <VideoPlayer
        media={data}
        mediaType={mediaType === "tv" ? "tv" : "movie"}
        onClose={() => setShowPlayer(false)}
      />
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-black/80 p-0 sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-3xl overflow-hidden rounded-none sm:rounded-lg bg-zinc-900 shadow-2xl my-0 sm:my-10"
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900/80 text-white hover:bg-zinc-700"
          >
            <X size={20} />
          </button>

          {!data ? (
            <div className="flex h-[70vh] items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />
            </div>
          ) : (
            <>
              <div className="relative aspect-video w-full bg-black">
                <img
                  src={imageUrl(data.backdrop_path, "original")}
                  alt={title(data)}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/30 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h2 className="mb-4 text-2xl sm:text-4xl font-black text-white drop-shadow-lg">{title(data)}</h2>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setShowPlayer(true)}
                      className="flex items-center gap-2 rounded-md bg-white px-6 py-2.5 font-bold text-black hover:bg-white/80 shadow-lg transition active:scale-95"
                    >
                      <Play size={18} fill="black" /> Watch Now
                    </button>
                    <button
                      onClick={() => toggle(data)}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-400 bg-black/40 text-white hover:border-white transition"
                    >
                      {inList ? <Check size={18} /> : <Plus size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
                  <span className="flex items-center gap-1 font-bold text-green-500">
                    <Star size={14} className="fill-green-500" /> {data.vote_average?.toFixed(1)} Rating
                  </span>
                  <span className="text-zinc-300">{releaseYear(data)}</span>
                  {data.runtime ? <span className="text-zinc-300">{data.runtime} min</span> : null}
                  {data.number_of_seasons ? (
                    <span className="text-zinc-300">{data.number_of_seasons} Seasons</span>
                  ) : null}
                  <span className="rounded border border-zinc-500 px-1.5 py-0.5 text-xs text-zinc-300">HD</span>
                </div>

                <p className="mb-5 text-sm sm:text-base text-zinc-200">{data.overview}</p>

                <div className="mb-6 flex flex-wrap gap-2">
                  {data.genres?.map((g) => (
                    <span key={g.id} className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
                      {g.name}
                    </span>
                  ))}
                </div>

                {data.credits?.cast && data.credits.cast.length > 0 && (
                  <div className="mb-6">
                    <h3 className="mb-2 text-sm font-semibold text-zinc-400">Cast</h3>
                    <p className="text-sm text-zinc-300">
                      {data.credits.cast
                        .slice(0, 6)
                        .map((c) => c.name)
                        .join(", ")}
                    </p>
                  </div>
                )}

                {data.similar?.results && data.similar.results.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-lg font-bold text-white">More Like This</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {data.similar.results.slice(0, 6).map((s) => (
                        <div key={s.id} className="flex justify-center">
                          <MovieCard media={{ ...s, media_type: mediaType }} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
