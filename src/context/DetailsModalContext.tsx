import { createContext, useContext, useState, type ReactNode } from "react";
import type { Media, MediaType } from "../lib/tmdb";
import DetailsModal from "../components/DetailsModal";

interface Target {
  id: number;
  mediaType: MediaType;
}

interface DetailsModalContextType {
  open: (media: Media) => void;
  close: () => void;
}

const DetailsModalContext = createContext<DetailsModalContextType | undefined>(undefined);

export function DetailsModalProvider({ children }: { children: ReactNode }) {
  const [target, setTarget] = useState<Target | null>(null);

  const open = (media: Media) => {
    const mediaType = media.media_type ?? (media.title ? "movie" : "tv");
    setTarget({ id: media.id, mediaType });
  };
  const close = () => setTarget(null);

  return (
    <DetailsModalContext.Provider value={{ open, close }}>
      {children}
      {target && <DetailsModal id={target.id} mediaType={target.mediaType} onClose={close} />}
    </DetailsModalContext.Provider>
  );
}

export function useDetailsModal() {
  const ctx = useContext(DetailsModalContext);
  if (!ctx) throw new Error("useDetailsModal must be used within DetailsModalProvider");
  return ctx;
}
