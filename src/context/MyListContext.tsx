import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Media } from "../lib/tmdb";

interface MyListContextType {
  list: Media[];
  isInList: (id: number) => boolean;
  toggle: (media: Media) => void;
}

const MyListContext = createContext<MyListContextType | undefined>(undefined);
const STORAGE_KEY = "streamix-my-list";

export function MyListProvider({ children }: { children: ReactNode }) {
  const [list, setList] = useState<Media[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Media[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }, [list]);

  const isInList = (id: number) => list.some((m) => m.id === id);

  const toggle = (media: Media) => {
    setList((prev) => (prev.some((m) => m.id === media.id) ? prev.filter((m) => m.id !== media.id) : [media, ...prev]));
  };

  return <MyListContext.Provider value={{ list, isInList, toggle }}>{children}</MyListContext.Provider>;
}

export function useMyList() {
  const ctx = useContext(MyListContext);
  if (!ctx) throw new Error("useMyList must be used within MyListProvider");
  return ctx;
}
