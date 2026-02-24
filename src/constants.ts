// Pokemon TCG API Base URL
export const POKEMON_TCG_API = "https://api.pokemontcg.io/v2";

// Card types and rarities
export const CARD_TYPES = [
  "Colorless", "Darkness", "Dragon", "Fairy", "Fighting",
  "Fire", "Grass", "Lightning", "Metal", "Psychic", "Water"
];

export const RARITIES = [
  "Common", "Uncommon", "Rare", "Rare Holion", "Rare Ultra",
  "Rare Rainbow", "Rare Secret", "Rare Shiny", "Rare Shiny Rainbow"
];

// Theme colors for trainers
export const THEME_COLORS = [
  { name: "Red", value: "#ef4444", accent: "#fecaca" },
  { name: "Blue", value: "#3b82f6", accent: "#bfdbfe" },
  { name: "Green", value: "#22c55e", accent: "#bbf7d0" },
  { name: "Yellow", value: "#eab308", accent: "#fef08a" },
  { name: "Purple", value: "#a855f7", accent: "#e9d5ff" },
  { name: "Pink", value: "#ec4899", accent: "#fbcfe8" },
  { name: "Orange", value: "#f97316", accent: "#fed7aa" },
  { name: "Teal", value: "#14b8a6", accent: "#99f6e4" },
];

// Avatar options
export const AVATARS = [
  { id: 1, emoji: "🔥", name: "Charizard" },
  { id: 2, emoji: "💧", name: "Blastoise" },
  { id: 3, emoji: "🌿", name: "Venusaur" },
  { id: 4, emoji: "⚡", name: "Pikachu" },
  { id: 5, emoji: "👻", name: "Gengar" },
  { id: 6, emoji: "🐉", name: "Dragonite" },
  { id: 7, emoji: "🦁", name: "Lucario" },
  { id: 8, emoji: "🦅", name: "Skyran" },
];

// Default API settings
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_COLLECTION_SIZE = 10000;
