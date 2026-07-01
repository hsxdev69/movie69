import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SplashScreen from "./components/SplashScreen";
import Navbar from "./components/Navbar";
import BottomNav from "./components/BottomNav";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import NewAndPopular from "./pages/NewAndPopular";
import MyListPage from "./pages/MyListPage";
import SearchPage from "./pages/Search";
import { MyListProvider } from "./context/MyListContext";
import { DetailsModalProvider } from "./context/DetailsModalContext";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <MyListProvider>
      <BrowserRouter>
        <DetailsModalProvider>
          <AnimatePresence>{showSplash && <SplashScreen key="splash" />}</AnimatePresence>
          {!showSplash && (
            <div className="app-chrome bg-black min-h-screen min-h-[100dvh]">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/movies" element={<Browse mediaType="movie" heading="Movies" />} />
                <Route path="/tv" element={<Browse mediaType="tv" heading="TV Shows" />} />
                <Route path="/new" element={<NewAndPopular />} />
                <Route path="/my-list" element={<MyListPage />} />
                <Route path="/search" element={<SearchPage />} />
              </Routes>
              <BottomNav />
            </div>
          )}
        </DetailsModalProvider>
      </BrowserRouter>
    </MyListProvider>
  );
}
