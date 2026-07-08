import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Movie } from '../types';

interface VideoContextType {
  playerMovie: Movie | null;
  openPlayer: (movie: Movie) => void;
  closePlayer: () => void;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export function VideoProvider({ children }: { children: ReactNode }) {
  const [playerMovie, setPlayerMovie] = useState<Movie | null>(null);

  const openPlayer = (movie: Movie) => setPlayerMovie(movie);
  const closePlayer = () => setPlayerMovie(null);

  return (
    <VideoContext.Provider value={{ playerMovie, openPlayer, closePlayer }}>
      {children}
    </VideoContext.Provider>
  );
}

export function useVideoPlayer() {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideoPlayer must be used within a VideoProvider');
  }
  return context;
}
