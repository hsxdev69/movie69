import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { VideoProvider, useVideoPlayer } from './context/VideoContext';
import { MyListProvider } from './context/MyListContext';
import { AdminProvider, useAdmin } from './context/AdminContext';
import AdminPanel from './components/AdminPanel';
import SplashScreen from './components/SplashScreen';
import BottomTabBar, { type Tab } from './components/BottomTabBar';
import VideoPlayer from './components/VideoPlayer';
import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage';
import TVShowsPage from './pages/TVShowsPage';
import SearchPage from './pages/SearchPage';
import MyListPage from './pages/MyListPage';

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab]   = useState<Tab>('home');
  const { playerMovie, closePlayer } = useVideoPlayer();
  const { adminOpen, closeAdmin } = useAdmin();

  const handleSplashComplete = useCallback(() => setShowSplash(false), []);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
  };

  const pages: Record<Tab, React.ReactNode> = {
    home:   <HomePage />,
    movies: <MoviesPage />,
    search: <SearchPage />,
    tv:     <TVShowsPage />,
    mylist: <MyListPage />,
  };

  return (
    <div className="fixed inset-0 bg-black text-white overflow-hidden">
      {/* Splash */}
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      </AnimatePresence>

      {/* Main App */}
      {!showSplash && (
        <>
          {/* Page content with animated tab transitions */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute inset-0"
            >
              {pages[activeTab]}
            </motion.div>
          </AnimatePresence>

          {/* Bottom tab bar - always on top */}
          <BottomTabBar activeTab={activeTab} onTabChange={handleTabChange} />

          {/* Global fullscreen video player */}
          <AnimatePresence>
            {playerMovie && (
              <VideoPlayer movie={playerMovie} onClose={closePlayer} />
            )}
          </AnimatePresence>

          {/* Admin Panel (profile icon se khulta hai) */}
          <AnimatePresence>
            {adminOpen && <AdminPanel onClose={closeAdmin} />}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <MyListProvider>
      <VideoProvider>
        <AdminProvider>
          <AppContent />
        </AdminProvider>
      </VideoProvider>
    </MyListProvider>
  );
}
