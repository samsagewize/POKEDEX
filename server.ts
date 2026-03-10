import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("pokedex.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    theme_color TEXT DEFAULT 'red',
    avatar_id INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT,
    set_name TEXT,
    card_number TEXT,
    image_url TEXT,
    type TEXT,
    rarity TEXT,
    price REAL DEFAULT 0,
    scanned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS follows (
    follower_id INTEGER,
    following_id INTEGER,
    PRIMARY KEY (follower_id, following_id),
    FOREIGN KEY(follower_id) REFERENCES users(id),
    FOREIGN KEY(following_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER,
    receiver_id INTEGER,
    content TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(sender_id) REFERENCES users(id),
    FOREIGN KEY(receiver_id) REFERENCES users(id)
  );
`);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.post("/api/login", (req, res) => {
    const { username, avatarId } = req.body;
    if (!username) return res.status(400).json({ error: "Username required" });
    
    let user = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
    if (!user) {
      const result = db.prepare("INSERT INTO users (username, theme_color, avatar_id) VALUES (?, ?, ?)").run(username, 'red', avatarId || 1);
      user = { id: result.lastInsertRowid, username, theme_color: 'red', avatar_id: avatarId || 1 };
    }
    res.json(user);
  });

  app.get("/api/collection/:userId", (req, res) => {
    const cards = db.prepare("SELECT * FROM cards WHERE user_id = ? ORDER BY scanned_at DESC").all(req.params.userId);
    res.json(cards);
  });

  app.post("/api/collection/add", (req, res) => {
    const { userId, name, setName, cardNumber, imageUrl, type, rarity, price } = req.body;
    const result = db.prepare(
      "INSERT INTO cards (user_id, name, set_name, card_number, image_url, type, rarity, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    ).run(userId, name, setName, cardNumber, imageUrl, type, rarity, price || 0);
    res.json({ id: result.lastInsertRowid });
  });

  app.delete("/api/collection/:cardId", (req, res) => {
    db.prepare("DELETE FROM cards WHERE id = ?").run(req.params.cardId);
    res.json({ success: true });
  });

  // Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🎴 POKEDEX running on http://localhost:${PORT}`);
  });
}

startServer();
