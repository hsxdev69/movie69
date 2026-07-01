import { motion } from "framer-motion";

export default function SplashScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
    >
      {/* animated background glow */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <div className="absolute left-1/2 top-1/2 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-700/30 blur-[120px]" />
      </motion.div>

      <div className="relative flex flex-col items-center">
        <motion.h1
          className="text-6xl sm:text-8xl font-black tracking-tighter"
          style={{
            fontFamily: "'Arial Black', Helvetica, sans-serif",
            color: "#E50914",
            textShadow: "0 0 40px rgba(229,9,20,0.6)",
          }}
          initial={{ scale: 0.3, opacity: 0, letterSpacing: "-0.1em" }}
          animate={{ scale: 1, opacity: 1, letterSpacing: "-0.02em" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          STREAMIX
        </motion.h1>
        <motion.div
          className="mt-6 h-[3px] w-40 rounded-full bg-gradient-to-r from-transparent via-red-600 to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
        />
        <motion.p
          className="mt-4 text-sm tracking-[0.3em] text-zinc-400 uppercase"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          Movies · Shows · Live
        </motion.p>
      </div>
    </motion.div>
  );
}
