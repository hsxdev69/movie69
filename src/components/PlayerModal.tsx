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
    <div className="fixed inset-0 z-[100] h-[100dvh] w-[100dvw] bg-black">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/80 text-xl text-white transition hover:bg-red-600 sm:right-6 sm:top-6 sm:h-11 sm:w-11 sm:text-2xl"
        aria-label="Close player"
      >
        ✕
      </button>

      {/* Title */}
      <div className="pointer-events-none absolute left-3 top-3 z-20 text-xs text-gray-400 sm:left-6 sm:top-6 sm:text-base">
        Now Playing: <span className="font-semibold text-white">{title}</span>
      </div>

      {/* Iframe player - Fullscreen Fixed */}
      <iframe
        src={embedUrl}
        className="absolute inset-0 h-full w-full border-0"
        allowFullScreen={true}
        webkitAllowFullScreen={true}
        mozAllowFullScreen={true}
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        title={`Watch ${title}`}
      />
    </div>
  );
}
