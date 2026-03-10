# 🎴 POKEDEX

The ultimate Pokemon card collector's app - **no AI dependencies!**

## Features

- 🔍 **Search** - Search Pokemon TCG database (free API)
- 📱 **Collection** - Track your cards with full CRUD
- 💰 **Prices** - View card prices from TCGPlayer & CardMarket
- 🎨 **Themes** - Customize your trainer profile
- 🗑️ **Manage** - Remove cards from collection
- 📊 **Filters** - Filter by type and rarity

## Quick Start (Local)

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Running with Backend

For full collection persistence, run the Express server:

```bash
npx tsx server.ts
```

Open http://localhost:3000

## Deploy to Vercel

1. Push to GitHub
2. Import in Vercel
3. Deploy!

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- Express + SQLite (backend)
- Pokemon TCG API (free)

## API

This version uses the free Pokemon TCG API - no keys needed!
