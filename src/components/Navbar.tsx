import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Bell, Menu, X } from "lucide-react";
import { cn } from "../utils/cn";

const links = [
  { label: "Home", to: "/" },
  { label: "TV Shows", to: "/tv" },
  { label: "Movies", to: "/movies" },
  { label: "New & Popular", to: "/new" },
  { label: "My List", to: "/my-list" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "fixed top-0 z-50 flex w-full items-center justify-between px-4 sm:px-8 py-3 transition-colors duration-300",
        scrolled || mobileOpen ? "bg-black" : "bg-gradient-to-b from-black/80 to-transparent"
      )}
    >
      <div className="flex items-center gap-6">
        <Link to="/" className="text-xl sm:text-2xl font-black tracking-tight text-red-600">
          STREAMIX
        </Link>
        <div className="hidden md:flex items-center gap-5 text-sm">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "transition-colors hover:text-zinc-300",
                location.pathname === l.to ? "font-semibold text-white" : "text-zinc-200"
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <button className="md:hidden text-white" onClick={() => setMobileOpen((v) => !v)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div className="flex items-center gap-4">
        <form onSubmit={submitSearch} className="flex items-center">
          <motion.input
            initial={false}
            animate={{ width: searchOpen ? 180 : 0, opacity: searchOpen ? 1 : 0, paddingLeft: searchOpen ? 12 : 0 }}
            transition={{ duration: 0.25 }}
            className="h-9 rounded-sm border border-zinc-500 bg-black/70 text-sm text-white outline-none"
            placeholder="Titles, people, genres"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            className="text-white ml-2"
            aria-label="Search"
          >
            <Search size={20} />
          </button>
        </form>
        <button className="hidden sm:block text-white" aria-label="Notifications">
          <Bell size={20} />
        </button>
        <Link to="/my-list" className="flex h-8 w-8 items-center justify-center rounded bg-gradient-to-br from-red-600 to-red-900 text-sm font-bold text-white">
          U
        </Link>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="absolute left-0 top-full flex w-full flex-col gap-1 bg-black px-4 py-3 md:hidden"
        >
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="py-2 text-sm text-zinc-200 border-b border-zinc-800">
              {l.label}
            </Link>
          ))}
        </motion.div>
      )}
    </motion.nav>
  );
}
