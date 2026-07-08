import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Shield, LogOut, LayoutDashboard, Film, Users, Settings,
  Plus, Trash2, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle,
  TrendingUp, Heart, Search as SearchIcon,
} from 'lucide-react';
import { auth, db, isFirebaseConfigured } from '../firebase';
import {
  signInWithEmailAndPassword, signOut, onAuthStateChanged, type User,
} from 'firebase/auth';
import {
  collection, addDoc, deleteDoc, doc, onSnapshot, serverTimestamp,
} from 'firebase/firestore';
import { getImageUrl } from '../hooks/useTMDB';
import { useMyList } from '../context/MyListContext';
import axios from 'axios';

interface AdminPanelProps {
  onClose: () => void;
}

interface FeaturedItem {
  id: string;          // firestore doc id (or local id)
  tmdbId: number;
  title: string;
  poster: string | null;
  type: 'movie' | 'tv';
}

type Tab = 'dashboard' | 'featured' | 'users' | 'settings';

const TMDB_KEY = 'd3a8b762c1c9cbf6e8d16b223a94614f';
const LOCAL_KEY = 'streamflix_admin_featured';
const LOCAL_AUTH = 'streamflix_admin_demo_auth';

// ─── DEMO credentials (jab Firebase configure nahi hai) ───
const DEMO_EMAIL = 'admin@streamflix.com';
const DEMO_PASS = 'admin123';

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const [user, setUser] = useState<User | null>(null);
  const [demoAuthed, setDemoAuthed] = useState(
    () => localStorage.getItem(LOCAL_AUTH) === '1'
  );
  const [authLoading, setAuthLoading] = useState(true);

  // Firebase auth listener
  useEffect(() => {
    if (!auth) {
      setAuthLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u);
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  const isLoggedIn = isFirebaseConfigured ? !!user : demoAuthed;

  const handleLogout = async () => {
    if (auth) await signOut(auth).catch(() => {});
    localStorage.removeItem(LOCAL_AUTH);
    setDemoAuthed(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] bg-black flex flex-col"
      >
        {authLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}>
              <Loader2 className="w-8 h-8 text-red-600" />
            </motion.div>
          </div>
        ) : isLoggedIn ? (
          <AdminDashboard onClose={onClose} onLogout={handleLogout} userEmail={user?.email ?? DEMO_EMAIL} />
        ) : (
          <AdminLogin onClose={onClose} onDemoLogin={() => {
            localStorage.setItem(LOCAL_AUTH, '1');
            setDemoAuthed(true);
          }} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}

/* ═══════════════════════ LOGIN SCREEN ═══════════════════════ */

function AdminLogin({ onClose, onDemoLogin }: { onClose: () => void; onDemoLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isFirebaseConfigured && auth) {
      // ── Real Firebase login ──
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch {
        setError('Galat email ya password. Firebase Console mein user banao.');
      }
    } else {
      // ── Demo login ──
      if (email === DEMO_EMAIL && password === DEMO_PASS) {
        onDemoLogin();
      } else {
        setError(`Demo mode: ${DEMO_EMAIL} / ${DEMO_PASS} use karo`);
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 relative">
      {/* Close */}
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
        style={{ marginTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <X className="w-5 h-5 text-white" />
      </motion.button>

      {/* Logo */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 18 }}
        className="w-20 h-20 rounded-3xl bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center mb-6 shadow-2xl shadow-red-900/50"
      >
        <Shield className="w-9 h-9 text-white" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-white text-2xl font-black mb-1"
      >
        Admin Panel
      </motion.h1>
      <p className="text-gray-500 text-sm mb-8">StreamFlix Management</p>

      {/* Firebase status badge */}
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-xs font-semibold ${
        isFirebaseConfigured
          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
          : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
      }`}>
        {isFirebaseConfigured ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
        {isFirebaseConfigured ? 'Firebase Connected' : 'Demo Mode — Firebase config pending'}
      </div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        onSubmit={handleLogin}
        className="w-full max-w-sm space-y-3"
      >
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full bg-white/8 border border-white/10 rounded-2xl py-3.5 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-red-600 text-sm"
        />
        <div className="relative">
          <input
            type={showPass ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full bg-white/8 border border-white/10 rounded-2xl py-3.5 px-4 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-red-600 text-sm"
          />
          <button
            type="button"
            onClick={() => setShowPass(v => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 text-xs px-1"
          >
            {error}
          </motion.p>
        )}

        <motion.button
          whileTap={{ scale: 0.96 }}
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-red-600 rounded-2xl text-white font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Login
        </motion.button>
      </motion.form>

      {!isFirebaseConfigured && (
        <p className="text-gray-600 text-[11px] mt-6 text-center max-w-xs">
          Demo: <span className="text-gray-400">{DEMO_EMAIL}</span> / <span className="text-gray-400">{DEMO_PASS}</span>
          <br />Real Firebase ke liye <span className="text-gray-400">src/firebase.ts</span> mein config daalo
        </p>
      )}
    </div>
  );
}

/* ═══════════════════════ DASHBOARD ═══════════════════════ */

function AdminDashboard({ onClose, onLogout, userEmail }: {
  onClose: () => void;
  onLogout: () => void;
  userEmail: string;
}) {
  const [tab, setTab] = useState<Tab>('dashboard');
  const { myList } = useMyList();
  const [featured, setFeatured] = useState<FeaturedItem[]>([]);

  // ── Load featured items (Firestore ya localStorage) ──
  useEffect(() => {
    if (isFirebaseConfigured && db) {
      const unsub = onSnapshot(collection(db, 'featured'), snap => {
        setFeatured(
          snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<FeaturedItem, 'id'>) }))
        );
      }, () => { /* permission error ignore */ });
      return unsub;
    } else {
      try {
        const raw = localStorage.getItem(LOCAL_KEY);
        setFeatured(raw ? JSON.parse(raw) : []);
      } catch { setFeatured([]); }
    }
  }, []);

  const saveLocal = (items: FeaturedItem[]) => {
    setFeatured(items);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
  };

  const addFeatured = useCallback(async (item: Omit<FeaturedItem, 'id'>) => {
    if (isFirebaseConfigured && db) {
      await addDoc(collection(db, 'featured'), { ...item, createdAt: serverTimestamp() });
    } else {
      saveLocal([...featured, { ...item, id: `local_${Date.now()}` }]);
    }
  }, [featured]);

  const removeFeatured = useCallback(async (id: string) => {
    if (isFirebaseConfigured && db) {
      await deleteDoc(doc(db, 'featured', id));
    } else {
      saveLocal(featured.filter(f => f.id !== id));
    }
  }, [featured]);

  const tabs: { id: Tab; label: string; Icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
    { id: 'featured', label: 'Featured', Icon: Film },
    { id: 'users', label: 'Users', Icon: Users },
    { id: 'settings', label: 'Settings', Icon: Settings },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* ── Header ── */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-white/8 flex-shrink-0"
        style={{ paddingTop: 'max(12px, env(safe-area-inset-top, 12px))' }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center">
            <Shield className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">Admin Panel</p>
            <p className="text-gray-500 text-[10px] mt-0.5 truncate max-w-[140px]">{userEmail}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={onLogout}
            className="w-9 h-9 rounded-full bg-white/8 flex items-center justify-center"
            title="Logout"
          >
            <LogOut className="w-4 h-4 text-gray-400" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/8 flex items-center justify-center"
          >
            <X className="w-4.5 h-4.5 text-white" />
          </motion.button>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div className="flex px-3 py-2 gap-1 border-b border-white/5 flex-shrink-0 overflow-x-auto scrollbar-hide">
        {tabs.map(t => (
          <motion.button
            key={t.id}
            whileTap={{ scale: 0.93 }}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              tab === t.id ? 'bg-red-600 text-white' : 'text-gray-500 active:bg-white/5'
            }`}
          >
            <t.Icon className="w-3.5 h-3.5" />
            {t.label}
          </motion.button>
        ))}
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4" style={{ scrollbarWidth: 'none' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
          >
            {tab === 'dashboard' && <DashboardTab myListCount={myList.length} featuredCount={featured.length} />}
            {tab === 'featured' && <FeaturedTab featured={featured} onAdd={addFeatured} onRemove={removeFeatured} />}
            {tab === 'users' && <UsersTab />}
            {tab === 'settings' && <SettingsTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── Dashboard Tab ─── */
function DashboardTab({ myListCount, featuredCount }: { myListCount: number; featuredCount: number }) {
  const stats = [
    { label: 'Featured Titles', value: featuredCount, Icon: Film, color: 'from-red-600 to-red-900' },
    { label: 'Watchlist Items', value: myListCount, Icon: Heart, color: 'from-pink-600 to-pink-900' },
    { label: 'Total Views', value: '12.4K', Icon: Eye, color: 'from-blue-600 to-blue-900' },
    { label: 'Trending Score', value: '94%', Icon: TrendingUp, color: 'from-green-600 to-green-900' },
  ];

  return (
    <div>
      <h2 className="text-white font-black text-lg mb-4">Overview</h2>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-white/5 border border-white/8 rounded-2xl p-4"
          >
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
              <s.Icon className="w-4 h-4 text-white" />
            </div>
            <p className="text-white text-2xl font-black">{s.value}</p>
            <p className="text-gray-500 text-[11px] font-medium mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-5 bg-white/5 border border-white/8 rounded-2xl p-4">
        <p className="text-white font-bold text-sm mb-2">System Status</p>
        <div className="space-y-2">
          {[
            { name: 'TMDB API', ok: true },
            { name: 'SmashyStream Player', ok: true },
            { name: 'Firebase', ok: isFirebaseConfigured },
          ].map(s => (
            <div key={s.name} className="flex items-center justify-between">
              <span className="text-gray-400 text-xs">{s.name}</span>
              <span className={`flex items-center gap-1 text-[10px] font-bold ${s.ok ? 'text-green-400' : 'text-yellow-400'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${s.ok ? 'bg-green-400' : 'bg-yellow-400'}`} />
                {s.ok ? 'Online' : 'Not configured'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Featured Tab (TMDB search + add/remove) ─── */
function FeaturedTab({ featured, onAdd, onRemove }: {
  featured: FeaturedItem[];
  onAdd: (item: Omit<FeaturedItem, 'id'>) => void;
  onRemove: (id: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ id: number; title?: string; name?: string; poster_path: string | null; media_type: string }[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await axios.get('https://api.themoviedb.org/3/search/multi', {
          params: { api_key: TMDB_KEY, query },
        });
        setResults(res.data.results.filter((r: { poster_path: string | null; media_type: string }) =>
          r.poster_path && (r.media_type === 'movie' || r.media_type === 'tv')
        ).slice(0, 9));
      } catch { /* ignore */ }
      setSearching(false);
    }, 400);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <div>
      <h2 className="text-white font-black text-lg mb-1">Featured Content</h2>
      <p className="text-gray-500 text-xs mb-4">
        {isFirebaseConfigured ? 'Firestore mein save hoga' : 'localStorage mein save hoga (demo)'}
      </p>

      {/* Search */}
      <div className="relative mb-4">
        <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="TMDB se movie/show search karo..."
          className="w-full bg-white/8 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-red-600 text-sm"
        />
      </div>

      {/* Search results */}
      {searching && (
        <div className="flex justify-center py-4">
          <Loader2 className="w-5 h-5 text-red-600 animate-spin" />
        </div>
      )}
      {results.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-5">
          {results.map(r => (
            <motion.button
              key={r.id}
              whileTap={{ scale: 0.93 }}
              onClick={() => {
                onAdd({
                  tmdbId: r.id,
                  title: r.title || r.name || '',
                  poster: r.poster_path,
                  type: r.media_type as 'movie' | 'tv',
                });
                setQuery('');
                setResults([]);
              }}
              className="relative group"
            >
              <div className="aspect-[2/3] rounded-xl overflow-hidden bg-gray-900 relative">
                <img
                  src={getImageUrl(r.poster_path, 'w185') || ''}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-active:opacity-100">
                  <Plus className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-gray-400 text-[9px] mt-1 truncate">{r.title || r.name}</p>
            </motion.button>
          ))}
        </div>
      )}

      {/* Featured list */}
      <p className="text-gray-400 text-xs font-bold mb-2 uppercase tracking-wider">
        Currently Featured ({featured.length})
      </p>
      {featured.length === 0 ? (
        <div className="text-center py-8 bg-white/3 rounded-2xl border border-dashed border-white/10">
          <Film className="w-8 h-8 text-gray-700 mx-auto mb-2" />
          <p className="text-gray-600 text-xs">Koi featured content nahi — upar search karke add karo</p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {featured.map(f => (
              <motion.div
                key={f.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-3 bg-white/5 border border-white/8 rounded-2xl p-2.5"
              >
                <div className="w-10 h-14 rounded-lg overflow-hidden bg-gray-900 flex-shrink-0">
                  {f.poster && (
                    <img src={getImageUrl(f.poster, 'w92') || ''} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-bold truncate">{f.title}</p>
                  <p className="text-gray-500 text-[10px] uppercase">{f.type} · TMDB {f.tmdbId}</p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => onRemove(f.id)}
                  className="w-8 h-8 rounded-full bg-red-600/10 flex items-center justify-center flex-shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

/* ─── Users Tab ─── */
function UsersTab() {
  const demoUsers = [
    { name: 'Rahul Sharma', email: 'rahul@gmail.com', status: 'active', joined: '2 din pehle' },
    { name: 'Priya Patel', email: 'priya@gmail.com', status: 'active', joined: '5 din pehle' },
    { name: 'Amit Kumar', email: 'amit@gmail.com', status: 'inactive', joined: '1 hafta pehle' },
  ];

  return (
    <div>
      <h2 className="text-white font-black text-lg mb-1">Users</h2>
      <p className="text-gray-500 text-xs mb-4">
        {isFirebaseConfigured
          ? 'Firebase Console → Authentication mein full list dekho'
          : 'Demo data — Firebase Auth connect karne pe real users dikhenge'}
      </p>

      <div className="space-y-2">
        {demoUsers.map((u, i) => (
          <motion.div
            key={u.email}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-center gap-3 bg-white/5 border border-white/8 rounded-2xl p-3"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {u.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-bold truncate">{u.name}</p>
              <p className="text-gray-500 text-[10px] truncate">{u.email} · {u.joined}</p>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold flex-shrink-0 ${
              u.status === 'active'
                ? 'bg-green-500/10 text-green-400'
                : 'bg-gray-500/10 text-gray-500'
            }`}>
              {u.status}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── Settings Tab ─── */
function SettingsTab() {
  return (
    <div>
      <h2 className="text-white font-black text-lg mb-4">Settings</h2>

      <div className="space-y-3">
        {/* Firebase status */}
        <div className="bg-white/5 border border-white/8 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🔥</span>
            <p className="text-white font-bold text-sm">Firebase</p>
            <span className={`ml-auto px-2 py-0.5 rounded-full text-[9px] font-bold ${
              isFirebaseConfigured
                ? 'bg-green-500/10 text-green-400'
                : 'bg-yellow-500/10 text-yellow-400'
            }`}>
              {isFirebaseConfigured ? 'Connected' : 'Pending'}
            </span>
          </div>
          {!isFirebaseConfigured && (
            <div className="text-gray-500 text-[11px] leading-relaxed space-y-1.5 mt-2">
              <p className="text-gray-400 font-semibold">Setup steps:</p>
              <p>1. <span className="text-gray-300">console.firebase.google.com</span> pe project banao</p>
              <p>2. Web app add karo → config copy karo</p>
              <p>3. <span className="text-gray-300">src/firebase.ts</span> mein paste karo</p>
              <p>4. Authentication → Email/Password enable karo</p>
              <p>5. Firestore Database create karo</p>
            </div>
          )}
        </div>

        {/* App info */}
        <div className="bg-white/5 border border-white/8 rounded-2xl p-4">
          <p className="text-white font-bold text-sm mb-3">App Info</p>
          {[
            ['App Name', 'StreamFlix'],
            ['Version', '1.0.0'],
            ['Metadata API', 'TMDB v3'],
            ['Player', 'SmashyStream'],
            ['Storage', isFirebaseConfigured ? 'Firestore' : 'localStorage'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between py-1.5 border-b border-white/5 last:border-0">
              <span className="text-gray-500 text-xs">{k}</span>
              <span className="text-gray-300 text-xs font-semibold">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
