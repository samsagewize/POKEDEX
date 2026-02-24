// Pokemon TCG API Client - No Gemini Required!

const API_BASE = "https://api.pokemontcg.io/v2";
const API_KEY = import.meta.env.VITE_POKEMON_TCG_API_KEY || "";

// Types
export interface PokemonCard {
  id: string;
  name: string;
  types: string[];
  rarity: string;
  set: {
    name: string;
    id: string;
  };
  number: string;
  images: {
    small: string;
    large: string;
  };
  tcgplayer?: {
    prices?: {
      normal?: { low: number; mid: number; high: number; market: number };
      holofoil?: { low: number; mid: number; high: number; market: number };
      reverseHolofoil?: { low: number; mid: number; high: number; market: number };
    };
  };
  cardmarket?: {
    prices?: {
      averageSellPrice: number;
      lowPrice: number;
      highPrice: number;
      trendPrice: number;
    };
  };
}

export interface SearchParams {
  query?: string;
  type?: string;
  rarity?: string;
  set?: string;
  page?: number;
  pageSize?: number;
}

// Search cards
export async function searchCards(params: SearchParams): Promise<{ data: PokemonCard[]; total: number }> {
  const queries: string[] = [];
  
  if (params.query) {
    queries.push(`name:"${params.query}"*`);
  }
  if (params.type) {
    queries.push(`types:${params.type}`);
  }
  if (params.rarity) {
    queries.push(`rarity:${params.rarity}`);
  }
  if (params.set) {
    queries.push(`set.id:${params.set}`);
  }

  const url = new URL(`${API_BASE}/cards`);
  url.searchParams.append("q", queries.join(" && ") || "*");
  url.searchParams.append("page", String(params.page || 1));
  url.searchParams.append("pageSize", String(params.pageSize || 20));
  url.searchParams.append("orderBy", "-set.releaseDate");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (API_KEY) {
    headers["X-Api-Key"] = API_KEY;
  }

  const response = await fetch(url.toString(), { headers });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const result = await response.json();
  return {
    data: result.data || [],
    total: result.totalCount || 0,
  };
}

// Get card by ID
export async function getCard(id: string): Promise<PokemonCard> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (API_KEY) {
    headers["X-Api-Key"] = API_KEY;
  }

  const response = await fetch(`${API_BASE}/cards/${id}`, { headers });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const result = await response.json();
  return result.data;
}

// Get all sets
export async function getSets(page = 1, pageSize = 50) {
  const url = new URL(`${API_BASE}/sets`);
  url.searchParams.append("page", String(page));
  url.searchParams.append("pageSize", String(pageSize));
  url.searchParams.append("orderBy", "-releaseDate");

  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

// Get price from TCGPlayer (for more accurate pricing)
export async function getCardPrice(cardId: string): Promise<number | null> {
  // This would need a TCGPlayer API key for real pricing
  // For now, return null and use Pokemon TCG prices
  return null;
}

// Search with fuzzy matching for scanned cards
export async function findCardByName(name: string): Promise<PokemonCard[]> {
  const result = await searchCards({ query: name, pageSize: 10 });
  return result.data;
}

// Get card image URL
export function getCardImage(card: PokemonCard, size: "small" | "large" = "large"): string {
  return card.images[size];
}

// Get best price available
export function getBestPrice(card: PokemonCard): number {
  // Try TCGPlayer first
  if (card.tcgplayer?.prices?.holofoil?.market) {
    return card.tcgplayer.prices.holofoil.market;
  }
  if (card.tcgplayer?.prices?.normal?.market) {
    return card.tcgplayer.prices.normal.market;
  }
  // Fall back to CardMarket
  if (card.cardmarket?.prices?.averageSellPrice) {
    return card.cardmarket.prices.averageSellPrice;
  }
  return 0;
}
