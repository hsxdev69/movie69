import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

const SILK: [number, number, number, number] = [0.22, 1, 0.36, 1];
const CINEMATIC: [number, number, number, number] = [0.83, 0, 0.17, 1];

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 250);   // cinematic bars + starfield
    const t2 = setTimeout(() => setPhase(2), 900);   // logo warp-in + particle burst
    const t3 = setTimeout(() => setPhase(3), 2000);  // brand name typewriter glow
    const t4 = setTimeout(() => setPhase(4), 3100);  // tagline + ring pulse
    const t5 = setTimeout(() => setPhase(5), 4100);  // hyperspace exit
    const t6 = setTimeout(() => onComplete(), 4750);
    return () => [t1, t2, t3, t4, t5, t6].forEach(clearTimeout);
  }, [onComplete]);

  // Starfield — depth layers
  const stars = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 0.8 + Math.random() * 1.8,
        depth: 0.3 + Math.random() * 0.7,
        twinkleDelay: Math.random() * 3,
      })),
    []
  );

  // Particle burst (explosion from logo)
  const burst = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => {
        const angle = (i / 26) * Math.PI * 2;
        const dist = 90 + Math.random() * 130;
        return {
          id: i,
          tx: Math.cos(angle) * dist,
          ty: Math.sin(angle) * dist,
          size: 2 + Math.random() * 4,
          delay: Math.random() * 0.12,
          hue: Math.random() > 0.5 ? '#ff2230' : '#ff8a5c',
        };
      }),
    []
  );

  // Orbiting sparks around logo
  const orbiters = useMemo(
    () =>
      Array.from({ length: 3 }, (_, i) => ({
        id: i,
        radius: 68 + i * 14,
        duration: 3 + i * 1.2,
        size: 3 - i * 0.5,
        reverse: i % 2 === 1,
      })),
    []
  );

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#030303', perspective: 800 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* ═══════ CINEMATIC LETTERBOX BARS ═══════ */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-40 bg-black pointer-events-none"
        initial={{ height: '50vh' }}
        animate={{ height: phase >= 1 ? '0vh' : '50vh' }}
        transition={{ duration: 1.1, ease: CINEMATIC }}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-40 bg-black pointer-events-none"
        initial={{ height: '50vh' }}
        animate={{ height: phase >= 1 ? '0vh' : '50vh' }}
        transition={{ duration: 1.1, ease: CINEMATIC }}
      />

      {/* ═══════ AURORA BACKGROUND ═══════ */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 1 ? 1 : 0 }}
        transition={{ duration: 1.8 }}
      >
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '80vmax', height: '80vmax', left: '-30vmax', top: '-35vmax',
            background: 'radial-gradient(circle, rgba(229,9,20,0.13) 0%, transparent 58%)',
            filter: 'blur(50px)',
          }}
          animate={{ x: [0, 50, 0], y: [0, 30, 0], rotate: [0, 15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '70vmax', height: '70vmax', right: '-25vmax', bottom: '-30vmax',
            background: 'radial-gradient(circle, rgba(120,0,40,0.2) 0%, transparent 58%)',
            filter: 'blur(50px)',
          }}
          animate={{ x: [0, -40, 0], y: [0, -25, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* ═══════ TWINKLING STARFIELD ═══════ */}
      {phase >= 1 &&
        stars.map(s => (
          <motion.div
            key={s.id}
            className="absolute rounded-full bg-white pointer-events-none"
            style={{
              width: s.size, height: s.size,
              left: `${s.x}%`, top: `${s.y}%`,
              opacity: s.depth * 0.5,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, s.depth * 0.6, s.depth * 0.2, s.depth * 0.6],
              scale: [0, 1, 0.8, 1],
            }}
            transition={{
              duration: 3,
              delay: s.twinkleDelay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

      {/* ═══════ FILM GRAIN OVERLAY ═══════ */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-30 opacity-[0.04]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
        }}
        animate={{ opacity: [0.03, 0.05, 0.03] }}
        transition={{ duration: 0.4, repeat: Infinity }}
      />

      {/* ═══════ LOGO — 3D WARP ENTRANCE ═══════ */}
      <div className="relative z-10 mb-10" style={{ perspective: 700 }}>
        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              initial={{ scale: 4.5, opacity: 0, rotateY: 65, z: 500, filter: 'blur(25px)' }}
              animate={{ scale: 1, opacity: 1, rotateY: 0, z: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1, ease: SILK }}
              className="relative"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* ── PARTICLE BURST on arrival ── */}
              {burst.map(p => (
                <motion.div
                  key={p.id}
                  className="absolute left-1/2 top-1/2 rounded-full pointer-events-none"
                  style={{
                    width: p.size, height: p.size,
                    background: p.hue,
                    boxShadow: `0 0 8px ${p.hue}`,
                  }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{ x: p.tx, y: p.ty, opacity: 0, scale: 0.2 }}
                  transition={{ duration: 1.1, delay: 0.15 + p.delay, ease: 'easeOut' }}
                />
              ))}

              {/* ── SHOCKWAVE RINGS ── */}
              {[0, 1, 2].map(r => (
                <motion.div
                  key={r}
                  className="absolute -inset-2 rounded-[32px] pointer-events-none"
                  style={{ border: '1.5px solid rgba(229,9,20,0.8)' }}
                  initial={{ scale: 0.9, opacity: 0.9 }}
                  animate={{ scale: 2.4 + r * 0.7, opacity: 0 }}
                  transition={{ duration: 1.3, delay: 0.18 + r * 0.16, ease: 'easeOut' }}
                />
              ))}

              {/* ── ORBITING SPARKS ── */}
              {orbiters.map(o => (
                <motion.div
                  key={o.id}
                  className="absolute left-1/2 top-1/2 pointer-events-none"
                  style={{ width: 0, height: 0 }}
                  animate={{ rotate: o.reverse ? -360 : 360 }}
                  transition={{ duration: o.duration, repeat: Infinity, ease: 'linear' }}
                >
                  <div
                    className="absolute rounded-full"
                    style={{
                      width: o.size * 2, height: o.size * 2,
                      left: o.radius, top: 0,
                      background: '#ff4d58',
                      boxShadow: '0 0 10px 2px rgba(255,60,70,0.7)',
                    }}
                  />
                </motion.div>
              ))}

              {/* ── Breathing halo ── */}
              <motion.div
                className="absolute -inset-8 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(229,9,20,0.3) 0%, transparent 62%)',
                  filter: 'blur(16px)',
                }}
                animate={{ scale: [1, 1.25, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* ── Rotating conic ring ── */}
              <motion.div
                className="absolute -inset-[3px] rounded-[30px] pointer-events-none"
                style={{
                  background:
                    'conic-gradient(from 0deg, transparent, rgba(255,90,90,0.9) 12%, transparent 26%, transparent 52%, rgba(229,9,20,0.6) 66%, transparent 80%)',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }}
              />

              {/* ── GLASS LOGO TILE ── */}
              <motion.div
                className="relative w-24 h-24 rounded-[28px] flex items-center justify-center overflow-hidden"
                style={{
                  background: 'linear-gradient(145deg, #ff1424 0%, #ad0510 48%, #5f0007 100%)',
                  boxShadow:
                    '0 26px 80px rgba(229,9,20,0.5), inset 0 2px 0 rgba(255,255,255,0.4), inset 0 -10px 24px rgba(0,0,0,0.4)',
                }}
                animate={{
                  scale: [1, 1.035, 1],
                  boxShadow: [
                    '0 26px 80px rgba(229,9,20,0.5), inset 0 2px 0 rgba(255,255,255,0.4), inset 0 -10px 24px rgba(0,0,0,0.4)',
                    '0 26px 110px rgba(229,9,20,0.75), inset 0 2px 0 rgba(255,255,255,0.4), inset 0 -10px 24px rgba(0,0,0,0.4)',
                    '0 26px 80px rgba(229,9,20,0.5), inset 0 2px 0 rgba(255,255,255,0.4), inset 0 -10px 24px rgba(0,0,0,0.4)',
                  ],
                }}
                transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              >
                {/* Play triangle — pop with rotation */}
                <motion.svg
                  width="42" height="42" viewBox="0 0 24 24"
                  initial={{ scale: 0, rotate: -120, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ delay: 0.45, duration: 0.75, ease: SILK }}
                  style={{ filter: 'drop-shadow(0 5px 12px rgba(0,0,0,0.5))' }}
                >
                  <path d="M8.5 5.8v12.4a.8.8 0 0 0 1.22.68l9.9-6.2a.8.8 0 0 0 0-1.36l-9.9-6.2a.8.8 0 0 0-1.22.68z" fill="white" />
                </motion.svg>

                {/* Glass sheen sweeps */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(115deg, transparent 32%, rgba(255,255,255,0.42) 50%, transparent 68%)',
                  }}
                  animate={{ x: ['-140%', '140%'] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.9 }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══════ BRAND NAME — GLOW TYPEWRITER ═══════ */}
      <div className="relative z-10 flex items-baseline overflow-visible">
        {'StreamFlix'.split('').map((ch, i) => {
          const isFlix = i >= 6;
          return (
            <motion.span
              key={i}
              className="text-[42px] sm:text-5xl font-black tracking-tight inline-block relative"
              style={{
                color: isFlix ? '#ff2230' : '#ffffff',
                textShadow: isFlix
                  ? '0 0 40px rgba(229,9,20,0.8), 0 4px 30px rgba(0,0,0,0.8)'
                  : '0 4px 30px rgba(0,0,0,0.8)',
              }}
              initial={{ opacity: 0, y: 34, scale: 1.6, filter: 'blur(10px)' }}
              animate={phase >= 3 ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : {}}
              transition={{ delay: i * 0.05, duration: 0.6, ease: SILK }}
            >
              {ch}
              {/* per-letter glow flash on arrival */}
              {phase >= 3 && (
                <motion.span
                  className="absolute inset-0 pointer-events-none"
                  style={{ color: '#fff', textShadow: '0 0 24px rgba(255,255,255,0.9)' }}
                  initial={{ opacity: 0.9 }}
                  animate={{ opacity: 0 }}
                  transition={{ delay: i * 0.05 + 0.1, duration: 0.5 }}
                >
                  {ch}
                </motion.span>
              )}
            </motion.span>
          );
        })}
      </div>

      {/* ═══════ UNDERLINE ENERGY BEAM ═══════ */}
      <motion.div
        className="relative z-10 h-[2.5px] rounded-full mt-3 overflow-hidden"
        initial={{ width: 0, opacity: 0 }}
        animate={phase >= 3 ? { width: 230, opacity: 1 } : {}}
        transition={{ delay: 0.55, duration: 0.8, ease: CINEMATIC }}
        style={{ background: 'rgba(255,255,255,0.08)' }}
      >
        <motion.div
          className="absolute inset-y-0 w-20"
          style={{
            background: 'linear-gradient(90deg, transparent, #ff2230, #ff8a5c, transparent)',
            boxShadow: '0 0 16px rgba(229,9,20,0.9)',
          }}
          animate={{ x: [-90, 260] }}
          transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
      </motion.div>

      {/* ═══════ TAGLINE + LOADER ═══════ */}
      <div className="relative z-10 flex flex-col items-center mt-6 h-14">
        <AnimatePresence>
          {phase >= 4 && (
            <>
              <motion.p
                initial={{ opacity: 0, letterSpacing: '0.15em', filter: 'blur(8px)' }}
                animate={{ opacity: 1, letterSpacing: '0.5em', filter: 'blur(0px)' }}
                transition={{ duration: 1.1, ease: SILK }}
                className="text-gray-400 text-[10px] uppercase font-bold"
              >
                Unlimited Entertainment
              </motion.p>

              {/* Orbital dot loader */}
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 }}
                className="relative w-8 h-8 mt-4"
              >
                {[0, 1, 2].map(d => (
                  <motion.div
                    key={d}
                    className="absolute inset-0"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      ease: 'linear',
                      delay: d * 0.4,
                    }}
                  >
                    <div
                      className="absolute w-1.5 h-1.5 rounded-full left-1/2 top-0 -translate-x-1/2"
                      style={{
                        background: '#ff2230',
                        boxShadow: '0 0 8px rgba(229,9,20,0.9)',
                        opacity: 1 - d * 0.3,
                      }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* ═══════ HYPERSPACE EXIT ═══════ */}
      <AnimatePresence>
        {phase >= 5 && (
          <motion.div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
            {/* Star streaks flying past */}
            {stars.slice(0, 24).map(s => (
              <motion.div
                key={`streak-${s.id}`}
                className="absolute rounded-full"
                style={{
                  left: `${s.x}%`, top: `${s.y}%`,
                  width: 2, height: 2,
                  background: '#fff',
                }}
                initial={{ scaleX: 1, opacity: 0.8 }}
                animate={{
                  x: (s.x - 50) * 30,
                  y: (s.y - 50) * 30,
                  scaleX: 20,
                  opacity: 0,
                }}
                transition={{ duration: 0.55, ease: 'easeIn' }}
              />
            ))}
            {/* Center flash */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0] }}
              transition={{ duration: 0.5 }}
            >
              <div
                className="w-40 h-40 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(255,80,90,0.9) 0%, transparent 60%)',
                  filter: 'blur(20px)',
                }}
              />
            </motion.div>
            {/* Fade to black */}
            <motion.div
              className="absolute inset-0 bg-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
