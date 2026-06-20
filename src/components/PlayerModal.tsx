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
    <div className="fixed inset-0 z-[100] bg-black" style={{ width: "100vw", height: "100vh" }}>
      {/* Header bar */}
      <div className="flex h-14 items-center justify-between bg-black px-4 sm:px-6">
        <div className="truncate text-sm text-gray-400 sm:text-base">
          <span className="hidden sm:inline">Now Playing: </span>
          <span className="font-semibold text-white">{title}</span>
        </div>
        <button
          onClick={onClose}
          className="ml-4 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gray-800 text-lg text-white transition hover:bg-red-600"
          aria-label="Close player"
        >
          ✕
        </button>
      </div>

      {/* Iframe player — exact screen fit */}
      <div style={{ width: "100%", height: "calc(100vh - 56px)" }}>
        <iframe
          src={embedUrl}
          style={{ width: "100%", height: "100%", border: "none" }}
          allowFullScreen
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          title={`Watch ${title}`}
        />
      </div>
    </div>
  );
}
