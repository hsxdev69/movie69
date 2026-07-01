import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Loader2, Tv, Languages, Info } from "lucide-react";
import { title as mediaTitle, type Media, type MediaType } from "../lib/tmdb";

interface VideoPlayerProps {
  media: Media;
  mediaType: MediaType;
  onClose: () => void;
}

export default function VideoPlayer({ media, mediaType, onClose }: VideoPlayerProps) {
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showAudioTip, setShowAudioTip] = useState(true);

  const isTV = mediaType === "tv";

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

  const embedUrl =
    mediaType === "movie"
      ? `https://embed.smashystream.com/playere.php?tmdb=${media.id}`
      : `https://embed.smashystream.com/playere.php?tmdb=${media.id}&season=${season}&episode=${episode}`;

  // Permissions policy must explicitly allow "*" (all nested origins) so that
  // SmashyStream's own internal player iframe (a different origin) can also
  // request fullscreen — otherwise the browser blocks it with
  // "Fullscreen not available in this embed".
  const iframeAllow =
    "autoplay *; encrypted-media *; fullscreen *; picture-in-picture *; clipboard-write *; web-share *";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[95] flex items-start justify-center bg-black/95 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative flex w-full max-w-5xl flex-col bg-zinc-950 shadow-2xl my-0 sm:my-6 sm:rounded-lg overflow-hidden"
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-2 border-b border-zinc-800 bg-zinc-950 px-4 py-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={onClose}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-zinc-800 text-white hover:bg-zinc-700"
              >
                <X size={18} />
              </button>
              <div className="min-w-0">
                <h2 className="truncate text-sm sm:text-base font-bold text-white">
                  {mediaTitle(media)}
                </h2>
                <p className="text-[10px] text-zinc-500">
                  SmashyStream{loading && <span className="ml-2 text-zinc-400">· loading…</span>}
                </p>
              </div>
            </div>
          </div>

          {/* TV episode controls */}
          {isTV && (
            <div className="flex items-center gap-3 border-b border-zinc-800 bg-zinc-900 px-4 py-2">
              <Tv size={14} className="text-red-500" />
              <label className="flex items-center gap-1.5 text-xs text-zinc-300">
                Season
                <input
                  type="number"
                  min={1}
                  value={season}
                  onChange={(e) => {
                    const val = Math.max(1, parseInt(e.target.value) || 1);
                    setSeason(val);
                    setLoading(true);
                  }}
                  className="w-14 rounded border border-zinc-600 bg-zinc-800 px-2 py-1 text-center text-white text-xs"
                />
              </label>
              <label className="flex items-center gap-1.5 text-xs text-zinc-300">
                Episode
                <input
                  type="number"
                  min={1}
                  value={episode}
                  onChange={(e) => {
                    const val = Math.max(1, parseInt(e.target.value) || 1);
                    setEpisode(val);
                    setLoading(true);
                  }}
                  className="w-14 rounded border border-zinc-600 bg-zinc-800 px-2 py-1 text-center text-white text-xs"
                />
              </label>
            </div>
          )}

          {/* Dual audio tip — only English & Hindi, dismissible */}
          {showAudioTip && (
            <div className="flex items-start gap-2 border-b border-zinc-800 bg-zinc-900/60 px-4 py-2.5">
              <Languages size={14} className="mt-0.5 flex-shrink-0 text-red-500" />
              <p className="flex-1 text-[11px] leading-snug text-zinc-300">
                <span className="font-semibold text-white">Dual Audio:</span> English &amp; Hindi
                available. Tap the audio icon inside the player to switch.
              </p>
              <button
                onClick={() => setShowAudioTip(false)}
                className="flex-shrink-0 text-zinc-500 hover:text-white"
                aria-label="Dismiss"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Player */}
          <div className="relative aspect-video w-full bg-black">
            {loading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-black">
                <Loader2 size={40} className="animate-spin text-red-600" />
                <p className="text-sm text-zinc-400">Loading stream…</p>
              </div>
            )}

            <iframe
              key={embedUrl}
              src={embedUrl}
              className="h-full w-full border-0"
              allow={iframeAllow}
              allowFullScreen
              // Also set legacy attributes some browsers/webviews still read
              // @ts-expect-error legacy non-standard attrs for older webviews
              webkitallowfullscreen="true"
              mozallowfullscreen="true"
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={() => setLoading(false)}
            />
          </div>

          <div className="flex items-center gap-2 border-t border-zinc-800 bg-zinc-950 px-4 py-2">
            <Info size={12} className="flex-shrink-0 text-zinc-600" />
            <p className="text-[10px] text-zinc-600">
              If fullscreen doesn't work, use your browser's rotate-to-landscape instead — this is
              a limitation of the embedded player, not the app.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
