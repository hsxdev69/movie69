import { Link, useLocation } from "react-router-dom";
import { Home, Search, Tv, Film, List } from "lucide-react";
import { cn } from "../utils/cn";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/search", label: "Search", icon: Search },
  { to: "/movies", label: "Movies", icon: Film },
  { to: "/tv", label: "TV", icon: Tv },
  { to: "/my-list", label: "My List", icon: List },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-800 bg-black/95 backdrop-blur-lg md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg px-3 py-2 transition-all",
                isActive ? "text-red-500" : "text-zinc-500 active:scale-95"
              )}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
