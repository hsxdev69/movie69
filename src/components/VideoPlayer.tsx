import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minimize2, Loader2, RotateCw, ExternalLink } from 'lucide-react';
import type { Movie } from '../types';

interface VideoPlayerProps {
  movie: Movie;
  onClose: () => void;
}

const getPlayerUrl = (movie: Movie, season: number, episode: number): string => {
  const isTV = movie.media_type === 'tv' || !!movie.name;
  return isTV
    ? `https://player.videasy.net/tv/${movie.id}/${season}/${episode}?overlay=true`
    : `https://player.videasy.net/movie/${movie.id}?overlay=true`;
};

export default function VideoPlayer({ movie, onClose }: VideoPlayerProps) {
  const [loading, setLoading] = useState(true);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isNativeFs, setIsNativeFs] = useState(false);
  const [isRotated, setIsRotated] = useState(false);
  const [vp, setVp] = useState({ w: window.innerWidth, h: window.innerHeight });

  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<number | null>(null);
  const isTV = movie.media_type === 'tv' || !!movie.name;
  const title = movie.title || movie.name || '';

  useEffect(() => {
    setLoading(true);
  }, [movie.id, season, episode]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, []);

  useEffect(() => {
    const handler = () => setIsNativeFs(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    document.addEventListener('webkitfullscreenchange', handler);
    return () => {
      document.removeEventListener('fullscreenchange', handler);
      document.removeEventListener('webkitfullscreenchange', handler);
    };
  }, []);

  useEffect(() => {
    const update = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideTimerRef.current !== null) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = window.setTimeout(() => {
      setShowControls(false);
      hideTimerRef.current = null;
    }, 5000);
  }, []);

  useEffect(() => {
    resetHideTimer();
    return () => {
      if (hideTimerRef.current !== null) clearTimeout(hideTimerRef.current);
    };
  }, [resetHideTimer]);

  const toggleFullscreen = useCallback(async () => {
    if (isRotated) {
      setIsRotated(false);
      try {
        // @ts-ignore
        screen.orientation?.unlock?.();
      } catch {}
      return;
    }

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
      return;
    }

    let nativeWorked = false;
    if (document.fullscreenEnabled && containerRef.current) {
      try {
        await containerRef.current.requestFullscreen();
        await new Promise(r => setTimeout(r, 120));
        nativeWorked = !!document.fullscreenElement;
      } catch {
        nativeWorked = false;
      }
    }

    if (nativeWorked) {
      try {
        // @ts-ignore
        await screen.orientation?.lock?.('landscape');
      } catch {}
      return;
    }

    setIsRotated(true);
  }, [isRotated]);

  const isPortrait = vp.h >= vp.w;
  const innerStyle: React.CSSProperties = isRotated && isPortrait
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        width: vp.h,
        height: vp.w,
        transform: `translateX(${vp.w}px) rotate(90deg)`,
        transformOrigin: 'top left',
        zIndex: 90,
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
      }
    : {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        background: '#000',
      };

  const externalUrl = getPlayerUrl(movie, season, episode);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        ref={containerRef}
        className="fixed inset-0 z-[70] bg-black"
        onClick={resetHideTimer}
        onTouchStart={resetHideTimer}
      >
        <div style={innerStyle}>
          <AnimatePresence>
            {showControls && (
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.2 }}
                className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4"
                style={{
                  paddingTop: isRotated ? '10px' : 'max(12px, env(safe-area-inset-top, 12px))',
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, transparent 100%)',
                  paddingBottom: '24px',
                }}
              >
                <div className="flex items-center gap-3">
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isRotated) setIsRotated(false);
                      else onClose();
                    }}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
                  >
                    <X className="w-5 h-5 text-white" />
                  </motion.button>
                  <div className="min-w-0">
                    <p className="text-white font-bold text-sm leading-tight truncate max-w-[40vw]">{title}</p>
                    {isTV && <p className="text-gray-400 text-[10px] mt-0.5">S{season} E{episode}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(externalUrl, '_blank', 'noopener');
                    }}
                    className="flex items-center gap-1.5 h-10 px-3 rounded-full bg-white/10 active:bg-white/20"
                  >
                    <ExternalLink className="w-4 h-4 text-white" />
                    <span className="text-white text-xs font-bold">Open</span>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFullscreen();
                    }}
                    className="flex items-center gap-1.5 h-10 px-4 rounded-full bg-red-600 active:bg-red-700"
                  >
                    {isRotated || isNativeFs ? (
                      <>
                        <Minimize2 className="w-4 h-4 text-white" />
                        <span className="text-white text-xs font-bold">Exit</span>
                      </>
                    ) : (
                      <>
                        <RotateCw className="w-4 h-4 text-white" />
                        <span className="text-white text-xs font-bold">Fullscreen</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                >
                  <Loader2 className="w-12 h-12 text-red-600" />
                </motion.div>
                <p className="text-gray-500 text-sm mt-4 font-medium">Loading Videasy...</p>
                {isTV && <p className="text-gray-600 text-xs mt-1">Season {season} • Episode {episode}</p>}
              </motion.div>
            )}
          </AnimatePresence>

          <iframe
            id="video-iframe"
            key={`${movie.id}-${season}-${episode}`}
            src={externalUrl}
            width="100%"
            height="100%"
            className="w-full h-full flex-1"
            style={{ border: 'none' }}
            frameBorder={0}
            scrolling="no"
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            allowFullScreen
            // @ts-ignore - vendor fullscreen attributes for embed players
            webkitallowfullscreen="true"
            // @ts-ignore
            mozallowfullscreen="true"
            onLoad={() => {
              setLoading(false);
              resetHideTimer();
            }}
            referrerPolicy="no-referrer"
            title={title}
          />

          <AnimatePresence>
            {showControls && isTV && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-0 left-0 right-0 z-30 px-4 pt-12 pb-4"
                style={{
                  paddingBottom: isRotated ? '12px' : 'max(16px, env(safe-area-inset-bottom, 16px))',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 100%)',
                }}
              >
                <div className="flex items-center justify-center gap-6" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold">Season</span>
                    <div className="flex items-center gap-1 bg-white/10 rounded-xl px-1 py-1">
                      <motion.button whileTap={{ scale: 0.8 }} onClick={() => setSeason(s => Math.max(1, s - 1))} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center active:bg-white/20">
                        <span className="text-white font-bold text-sm">−</span>
                      </motion.button>
                      <span className="text-white font-black text-lg w-6 text-center tabular-nums">{season}</span>
                      <motion.button whileTap={{ scale: 0.8 }} onClick={() => setSeason(s => Math.min(20, s + 1))} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center active:bg-white/20">
                        <span className="text-white font-bold text-sm">+</span>
                      </motion.button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold">Episode</span>
                    <div className="flex items-center gap-1 bg-white/10 rounded-xl px-1 py-1">
                      <motion.button whileTap={{ scale: 0.8 }} onClick={() => setEpisode(e => Math.max(1, e - 1))} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center active:bg-white/20">
                        <span className="text-white font-bold text-sm">−</span>
                      </motion.button>
                      <span className="text-white font-black text-lg w-6 text-center tabular-nums">{episode}</span>
                      <motion.button whileTap={{ scale: 0.8 }} onClick={() => setEpisode(e => Math.min(50, e + 1))} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center active:bg-white/20">
                        <span className="text-white font-bold text-sm">+</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
