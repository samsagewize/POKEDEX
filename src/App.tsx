import { useState, useEffect } from "react";
import { searchCards, getSets, type PokemonCard } from "./pokemonApi";
import { THEME_COLORS, AVATARS, CARD_TYPES } from "./constants";

// Icons
const Search = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
  </svg>
);

const Plus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="M12 5v14"/>
  </svg>
);

const User = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const Cards = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/>
  </svg>
);

const MessageCircle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
  </svg>
);

const TrendingUp = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 7h-7"/><path d="M7 7h5"/><path d="M14 7h7"/><path d="m22 7-5 5-4-4-6 6"/>
  </svg>
);

type View = "home" | "search" | "collection" | "trading" | "chat" | "profile";

interface User {
  id: number;
  username: string;
  theme_color: string;
  avatar_id: number;
}

export default function App() {
  const [view, setView] = useState<View>("home");
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PokemonCard[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Collection state
  const [collection, setCollection] = useState<any[]>([]);
  
  // Active tab color
  const [themeColor, setThemeColor] = useState("#ef4444");

  useEffect(() => {
    // Check for stored user
    const stored = localStorage.getItem("pokedex_user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogin = async () => {
    if (!username.trim()) return;
    
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, avatarId: 1 }),
    });
    
    const userData = await res.json();
    setUser(userData);
    localStorage.setItem("pokedex_user", JSON.stringify(userData));
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const result = await searchCards({ query: searchQuery, pageSize: 20 });
      setSearchResults(result.data);
    } catch (err) {
      console.error("Search error:", err);
    }
    setLoading(false);
  };

  const addToCollection = async (card: PokemonCard) => {
    if (!user) return;
    
    const price = card.tcgplayer?.prices?.normal?.market || 
                  card.cardmarket?.prices?.averageSellPrice || 0;
    
    await fetch("/api/collection/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        name: card.name,
        setName: card.set.name,
        cardNumber: card.number,
        imageUrl: card.images.large,
        type: card.types?.[0] || "Colorless",
        rarity: card.rarity || "Common",
        price: price,
      }),
    });
    
    // Refresh collection
    const res = await fetch(`/api/collection/${user.id}`);
    const data = await res.json();
    setCollection(data);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: themeColor }}>
        <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-2">🎴 POKEDEX</h1>
          <p className="text-gray-500 text-center mb-6">The Ultimate Card Collector's App</p>
          
          <input
            type="text"
            placeholder="Choose your trainer name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-4 border-2 border-gray-200 rounded-xl mb-4 focus:border-yellow-400 focus:outline-none"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          
          <button
            onClick={handleLogin}
            className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-xl transition"
          >
            START JOURNEY
          </button>
        </div>
      </div>
    );
  }

  const currentAvatar = AVATARS.find(a => a.id === user.avatar_id) || AVATARS[0];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="p-4 flex items-center justify-between" style={{ backgroundColor: themeColor }}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{currentAvatar.emoji}</span>
          <div>
            <h1 className="font-bold text-lg">🎴 POKEDEX</h1>
            <p className="text-xs opacity-80">{user.username}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {THEME_COLORS.slice(0, 4).map((color) => (
            <button
              key={color.value}
              onClick={() => setThemeColor(color.value)}
              className="w-6 h-6 rounded-full border-2 border-white"
              style={{ backgroundColor: color.value }}
            />
          ))}
        </div>
      </header>

      {/* Search Bar */}
      <div className="p-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search cards... (e.g., Charizard, Pikachu)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 p-3 bg-gray-800 rounded-xl border border-gray-700 focus:border-yellow-400 focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="p-3 bg-yellow-400 text-black rounded-xl font-bold"
          >
            <Search />
          </button>
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="px-4 pb-4">
          <h2 className="font-bold mb-3 text-yellow-400">🔍 SEARCH RESULTS</h2>
          <div className="flex gap-3 overflow-x-auto pb-4">
            {searchResults.map((card) => (
              <div
                key={card.id}
                className="flex-shrink-0 w-40 bg-gray-800 rounded-xl overflow-hidden cursor-pointer hover:ring-2 ring-yellow-400 transition"
                onClick={() => addToCollection(card)}
              >
                <img src={card.images.small} alt={card.name} className="w-full" />
                <div className="p-2">
                  <p className="font-bold text-sm truncate">{card.name}</p>
                  <p className="text-xs text-gray-400">{card.set.name}</p>
                  <p className="text-xs text-yellow-400">#{card.number}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-400">Searching Pokemon TCG database...</p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="px-4 py-2 grid grid-cols-3 gap-2">
        <div className="bg-gray-800 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-yellow-400">{collection.length}</p>
          <p className="text-xs text-gray-400">Cards</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-green-400">$0</p>
          <p className="text-xs text-gray-400">Value</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-blue-400">0</p>
          <p className="text-xs text-gray-400">Trades</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-2 flex justify-around">
        <button onClick={() => setView("home")} className={`p-2 ${view === "home" ? "text-yellow-400" : "text-gray-400"}`}>
          <div className="flex flex-col items-center gap-1">
            <Cards />
            <span className="text-xs">Cards</span>
          </div>
        </button>
        <button onClick={() => setView("search")} className={`p-2 ${view === "search" ? "text-yellow-400" : "text-gray-400"}`}>
          <div className="flex flex-col items-center gap-1">
            <Search />
            <span className="text-xs">Search</span>
          </div>
        </button>
        <button onClick={() => setView("collection")} className={`p-2 ${view === "collection" ? "text-yellow-400" : "text-gray-400"}`}>
          <div className="flex flex-col items-center gap-1">
            <TrendingUp />
            <span className="text-xs">Collection</span>
          </div>
        </button>
        <button onClick={() => setView("chat")} className={`p-2 ${view === "chat" ? "text-yellow-400" : "text-gray-400"}`}>
          <div className="flex flex-col items-center gap-1">
            <MessageCircle />
            <span className="text-xs">Chat</span>
          </div>
        </button>
        <button onClick={() => setView("profile")} className={`p-2 ${view === "profile" ? "text-yellow-400" : "text-gray-400"}`}>
          <div className="flex flex-col items-center gap-1">
            <User />
            <span className="text-xs">Profile</span>
          </div>
        </button>
      </nav>
    </div>
  );
}
