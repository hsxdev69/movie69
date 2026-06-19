import { useState, useEffect, useRef } from "react";

interface NavbarProps {
  onSearch: (query: string) => void;
  searchQuery: string;
  onHome: () => void;
}

export default function Navbar({ onSearch, searchQuery, onHome }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = inputRef.current?.value.trim();
    if (value) {
      onSearch(value);
    }
  };

  const handleHomeClick = () => {
    onHome();
    setIsSearchOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        scrolled || searchQuery ? "bg-black" : "bg-gradient-to-b from-black/90 to-transparent"
      }`}
    >
      <div className="mx-auto flex items-center justify-between px-4 py-3 sm:px-8 lg:px-12">
        <div className="flex items-center gap-8">
          <h1
            onClick={handleHomeClick}
            className="cursor-pointer text-2xl font-bold tracking-tight text-red-600 sm:text-3xl"
          >
            FLIXILY
          </h1>
          <ul className="hidden items-center gap-5 text-sm text-gray-300 md:flex">
            <li onClick={handleHomeClick} className="cursor-pointer transition hover:text-white">Home</li>
            <li className="cursor-pointer transition hover:text-white">TV Shows</li>
            <li className="cursor-pointer transition hover:text-white">Movies</li>
            <li className="cursor-pointer transition hover:text-white">New & Popular</li>
            <li className="cursor-pointer transition hover:text-white">My List</li>
          </ul>
        </div>
        <div className="flex items-center gap-3">
          <form
            onSubmit={handleSubmit}
            className={`flex items-center overflow-hidden rounded-md border border-gray-600 transition-all duration-300 ${
              isSearchOpen ? "w-48 sm:w-64" : "w-0 border-transparent"
            }`}
          >
            <input
              ref={inputRef}
              type="text"
              defaultValue={searchQuery}
              placeholder="Search titles..."
              className="h-8 w-full bg-black/80 px-3 text-sm text-white outline-none placeholder:text-gray-500"
            />
            <button
              type="submit"
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center text-white hover:text-red-500"
            >
              →
            </button>
          </form>
          <button
            onClick={() => setIsSearchOpen((v) => !v)}
            className="flex h-8 w-8 items-center justify-center text-lg text-gray-300 transition hover:text-white"
            aria-label="Toggle search"
          >
            🔍
          </button>
          <div className="h-8 w-8 cursor-pointer rounded-sm bg-red-600"></div>
        </div>
      </div>
    </nav>
  );
}
