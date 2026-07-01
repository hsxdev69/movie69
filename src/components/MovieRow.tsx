import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Media } from "../lib/tmdb";
import MovieCard from "./MovieCard";

interface MovieRowProps {
  title: string;
  items: Media[];
  ranked?: boolean;
}

export default function MovieRow({ title, items, ranked }: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.85;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  if (!items || items.length === 0) return null;

  return (
    <motion.div
      className="relative py-2"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="mb-2 px-4 sm:px-8 text-lg sm:text-xl font-bold text-white">{title}</h2>
      <div className="group relative">
        <button
          onClick={() => scroll("left")}
          className={`absolute left-0 top-0 z-30 hidden h-full w-10 sm:w-14 items-center justify-center bg-gradient-to-r from-black/80 to-transparent text-white transition-opacity sm:flex ${
            hovering ? "opacity-100" : "opacity-0"
          }`}
        >
          <ChevronLeft size={32} />
        </button>
        <div
          ref={scrollRef}
          className="scrollbar-hide flex gap-2 overflow-x-auto scroll-smooth px-4 pb-4 sm:px-8"
          style={{ scrollbarWidth: "none" }}
        >
          {items.map((item, idx) => (
            <MovieCard key={`${item.id}-${idx}`} media={item} rank={ranked ? idx + 1 : undefined} />
          ))}
        </div>
        <button
          onClick={() => scroll("right")}
          className={`absolute right-0 top-0 z-30 hidden h-full w-10 sm:w-14 items-center justify-center bg-gradient-to-l from-black/80 to-transparent text-white transition-opacity sm:flex ${
            hovering ? "opacity-100" : "opacity-0"
          }`}
        >
          <ChevronRight size={32} />
        </button>
      </div>
    </motion.div>
  );
}
