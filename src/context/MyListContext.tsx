import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Movie } from '../types';

interface MyListContextType {
  myList: Movie[];
  isInList: (id: number) => boolean;
  toggleList: (movie: Movie) => void;
  addToList: (movie: Movie) => void;
  removeFromList: (id: number) => void;
}

const MyListContext = createContext<MyListContextType | undefined>(undefined);

const STORAGE_KEY = 'streamflix_mylist';

function loadList(): Movie[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function MyListProvider({ children }: { children: ReactNode }) {
  const [myList, setMyList] = useState<Movie[]>(loadList);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(myList));
    } catch { /* storage full or unavailable */ }
  }, [myList]);

  const isInList = (id: number) => myList.some(m => m.id === id);

  const addToList = (movie: Movie) => {
    setMyList(prev => (prev.some(m => m.id === movie.id) ? prev : [movie, ...prev]));
  };

  const removeFromList = (id: number) => {
    setMyList(prev => prev.filter(m => m.id !== id));
  };

  const toggleList = (movie: Movie) => {
    setMyList(prev =>
      prev.some(m => m.id === movie.id)
        ? prev.filter(m => m.id !== movie.id)
        : [movie, ...prev]
    );
  };

  return (
    <MyListContext.Provider value={{ myList, isInList, toggleList, addToList, removeFromList }}>
      {children}
    </MyListContext.Provider>
  );
}

export function useMyList() {
  const ctx = useContext(MyListContext);
  if (!ctx) throw new Error('useMyList must be used within MyListProvider');
  return ctx;
}
