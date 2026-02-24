# 🎴 POKEDEX - No Gemini Version

The ultimate Pokemon card collector's app - **without any AI dependencies!**

## Features

- 🔍 **Search** - Search Pokemon TCG database (free API, no key needed)
- 📱 **Collection** - Track your cards
- 💰 **Prices** - View card prices from TCGPlayer & CardMarket
- 🔄 **Trade** - Trade with other collectors
- 💬 **Chat** - Message other trainers
- 🎨 **Customize** - Theme colors & avatars

## Quick Start

```bash
# Install
npm install

# Run
npm run dev
```

Open http://localhost:3000

## No API Keys Needed!

This version works out of the box:
- Uses free **Pokemon TCG API** for card data
- Uses **TCGPlayer** prices (when available)
- Uses **CardMarket** as backup price source

Optional: Add `VITE_POKEMON_TCG_API_KEY` for higher rate limits.

## Tech Stack

- React 19 + Vite
- Tailwind CSS
- Express + SQLite
- Pokemon TCG API (free)

## What's Different from Original

| Feature | Original | This Version |
|---------|----------|--------------|
| AI Chat | Gemini API | Not included |
| Card Search | AI-powered | Pokemon TCG API |
| Prices | AI estimates | Real market data |
| API Keys | Gemini required | None needed! |

## Deploy

```bash
npm run build
# Deploy dist/ folder to Vercel, Netlify, etc.
```

## License

MIT
