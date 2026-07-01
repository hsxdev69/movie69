import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MovieRow from "../components/MovieRow";
import { getUpcomingMovies, getAiringTodayTV, getNowPlayingMovies, getTrending, type Media } from "../lib/tmdb";

export default function NewAndPopular() {
  const [trending, setTrending] = useState<Media[]>([]);
  const [upcoming, setUpcoming] = useState<Media[]>([]);
  const [airingToday, setAiringToday] = useState<Media[]>([]);
  const [nowPlaying, setNowPlaying] = useState<Media[]>([]);

  useEffect(() => {
    getTrending("day").then(setTrending);
    getUpcomingMovies().then(setUpcoming);
    getAiringTodayTV().then(setAiringToday);
    getNowPlayingMovies().then(setNowPlaying);
  }, []);

  return (
    <div className="min-h-screen bg-black pb-20 pt-24">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 sm:px-8 text-2xl sm:text-4xl font-black text-white mb-6"
      >
        New &amp; Popular
      </motion.h1>
      <div className="space-y-6">
        <MovieRow title="Trending Today" items={trending} ranked />
        <MovieRow title="In Theaters Now" items={nowPlaying} />
        <MovieRow title="Coming Soon" items={upcoming} />
        <MovieRow title="Airing Today" items={airingToday} />
      </div>
    </div>
  );
}
