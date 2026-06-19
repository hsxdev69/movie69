import { useEffect } from "react";

interface PlayerModalProps {
  tmdbId: number;
  title: string;
  onClose: () => void;
}

export default function PlayerModal({ tmdbId, title, onClose }: PlayerModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const embedUrl = `https://embed.smashystream.com/playere.php?tmdb=${tmdbId}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-2xl text-white transition hover:bg-red-600 sm:right-8 sm:top-8"
        aria-label="Close player"
      >
        ✕
      </button>

      {/* Title */}
      <div className="absolute left-4 top-4 z-10 text-sm text-gray-400 sm:left-8 sm:top-8 sm:text-base">
        Now Playing: <span className="font-semibold text-white">{title}</span>
      </div>

      {/* Iframe player */}
      <div className="h-full w-full pt-16">
        <iframe
          src={embedUrl}
          className="h-full w-full border-0"
          allowFullScreen
          allow="autoplay; encrypted-media; picture-in-picture"
          title={`Watch ${title}`}
        />
      </div>
    </div>
  );
}
