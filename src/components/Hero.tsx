import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, Info, Volume2, VolumeX } from "lucide-react";
import { imageUrl, title, type Media, type MediaType } from "../lib/tmdb";
import { useDetailsModal } from "../context/DetailsModalContext";
import VideoPlayer from "./VideoPlayer";

interface HeroProps {
  items: Media[];
}

export default function Hero({ items }: HeroProps) {
  const [index, setIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [watchTarget, setWatchTarget] = useState<{ media: Media; mediaType: MediaType } | null>(null);
  const { open } = useDetailsModal();

  useEffect(() => {
    if (items.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % Math.min(items.length, 6)), 8000);
    return () => clearInterval(timer);
  }, [items.length]);

  if (!items.length) {
    return <div className="h-[70vh] w-full animate-pulse bg-zinc-900" />;
  }

  const media = items[index % Math.min(items.length, 6)];
  const backdrop = imageUrl(media.backdrop_path, "original");

  return (
    <>
      <div className="relative h-[65vh] sm:h-[85vh] w-full overflow-hidden">
        <AnimatePresence mode="sync">
          <motion.div
            key={media.id}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            <img src={backdrop} alt={title(media)} className="h-full w-full object-cover object-top" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/10 to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 flex h-full flex-col justify-end gap-4 px-4 pb-16 sm:px-8 sm:pb-24 max-w-2xl">
          <motion.h1
            key={`title-${media.id}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-3xl sm:text-6xl font-black text-white drop-shadow-lg leading-tight"
          >
            {title(media)}
          </motion.h1>
          <motion.p
            key={`overview-${media.id}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="hidden sm:block line-clamp-3 text-sm text-zinc-200 sm:text-base drop-shadow"
          >
            {media.overview}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex items-center gap-3"
          >
            <button
              onClick={() =>
                setWatchTarget({
                  media,
                  mediaType: (media.media_type ?? (media.title ? "movie" : "tv")) as MediaType,
                })
              }
              className="flex items-center gap-2 rounded-md bg-white px-5 py-2.5 sm:px-7 sm:py-3 font-bold text-black transition hover:bg-white/80 active:scale-95"
            >
              <Play size={20} fill="black" /> Watch Now
            </button>
            <button
              onClick={() => open(media)}
              className="flex items-center gap-2 rounded-md bg-zinc-500/40 px-5 py-2.5 sm:px-7 sm:py-3 font-bold text-white backdrop-blur-sm transition hover:bg-zinc-500/60"
            >
              <Info size={20} /> More Info
            </button>
            <button
              onClick={() => setMuted((m) => !m)}
              className="ml-auto flex h-10 w-10 items-center justify-center rounded-full border border-zinc-400 text-white hover:bg-white/10"
            >
              {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </motion.div>
        </div>

        <div className="absolute bottom-6 right-4 sm:right-8 z-10 flex gap-1.5">
          {items.slice(0, 6).map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index % 6 ? "w-6 bg-red-600" : "w-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      {watchTarget && (
        <VideoPlayer
          media={watchTarget.media}
          mediaType={watchTarget.mediaType}
          onClose={() => setWatchTarget(null)}
        />
      )}
    </>
  );
}
