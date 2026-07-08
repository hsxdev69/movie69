import { motion } from 'framer-motion';
import { Home, Film, Tv, Heart, Search } from 'lucide-react';

export type Tab = 'home' | 'movies' | 'tv' | 'search' | 'mylist';

interface BottomTabBarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string; Icon: React.FC<{ className?: string }> }[] = [
  { id: 'home',   label: 'Home',    Icon: Home   },
  { id: 'movies', label: 'Movies',  Icon: Film   },
  { id: 'search', label: 'Search',  Icon: Search },
  { id: 'tv',     label: 'TV',      Icon: Tv     },
  { id: 'mylist', label: 'My List', Icon: Heart  },
];

export default function BottomTabBar({ activeTab, onTabChange }: BottomTabBarProps) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 safe-bottom"
      style={{ background: 'linear-gradient(to top, #000 70%, rgba(0,0,0,0.9) 100%)' }}
    >
      {/* Top border line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-white/10" />

      <div className="flex items-center justify-around px-2 pt-2 pb-3"
           style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
        {tabs.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <motion.button
              key={id}
              onClick={() => onTabChange(id)}
              whileTap={{ scale: 0.88 }}
              className="flex flex-col items-center justify-center gap-1 px-4 py-1 relative"
            >
              {/* Active pill background */}
              {isActive && (
                <motion.div
                  layoutId="tab-pill"
                  className="absolute inset-0 bg-red-600/10 rounded-xl"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              {/* Icon */}
              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                  y: isActive ? -1 : 0,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              >
                <Icon
                  className={`w-6 h-6 transition-colors duration-200 ${
                    isActive ? 'text-red-500' : 'text-gray-500'
                  }`}
                />
              </motion.div>

              {/* Label */}
              <motion.span
                animate={{ opacity: isActive ? 1 : 0.5 }}
                className={`text-[10px] font-semibold tracking-wide transition-colors duration-200 ${
                  isActive ? 'text-red-500' : 'text-gray-500'
                }`}
              >
                {label}
              </motion.span>

              {/* Active dot */}
              {isActive && (
                <motion.div
                  layoutId="tab-dot"
                  className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-red-500"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
