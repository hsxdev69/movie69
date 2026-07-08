import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Film, User } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

interface AppHeaderProps {
  title?: string;
  transparent?: boolean;
}

export default function AppHeader({ title, transparent = false }: AppHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const { openAdmin } = useAdmin();

  useEffect(() => {
    const el = document.querySelector('.scroll-page');
    if (!el) return;
    const handler = () => setScrolled(el.scrollTop > 40);
    el.addEventListener('scroll', handler, { passive: true });
    return () => el.removeEventListener('scroll', handler);
  }, []);

  const showBg = !transparent || scrolled;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-30 safe-top"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        background: showBg
          ? 'linear-gradient(to bottom, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.85) 100%)'
          : 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)',
        backdropFilter: showBg ? 'blur(12px)' : 'none',
        transition: 'background 0.3s, backdrop-filter 0.3s',
      }}
    >
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo or page title */}
        {title ? (
          <h1 className="text-white text-xl font-black">{title}</h1>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg shadow-red-900/40">
              <Film className="w-4 h-4 text-white" />
            </div>
            <span className="text-white text-xl font-black tracking-tight">
              Stream<span className="text-red-500">Flix</span>
            </span>
          </div>
        )}

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.88 }}
            className="relative w-9 h-9 rounded-full bg-white/8 flex items-center justify-center"
          >
            <Bell className="w-5 h-5 text-gray-300" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-black" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={openAdmin}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center shadow-lg"
          >
            <User className="w-4 h-4 text-white" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
