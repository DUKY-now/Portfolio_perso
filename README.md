# 🧠 Perso — Projet BDD Jeux / Séries / Films

Test de base de données pour :

* jeux vidéo
* séries / films
* gestion des états (wishlist, en cours, terminé)

📅 Début : **11/05/26**

---

# 📁 Structure du projet

```txt
/site
│
├── assets/
│   ├── css/style.css
│   └── js/app.js
│
├── public/
│   ├── index.html
│   ├── games.html
│   └── movies.html
│
├── functions/
│   └── api/
│       ├── games.js
│       └── movies.js
│
├── schema.sql
├── wrangler.toml
└── package.json
```

---

# 📚 Docs utiles

* D1 Database → [https://developers.cloudflare.com/d1/](https://developers.cloudflare.com/d1/)
* Workers API → [https://developers.cloudflare.com/workers/](https://developers.cloudflare.com/workers/)
* Pages Functions → [https://developers.cloudflare.com/pages/functions/](https://developers.cloudflare.com/pages/functions/)
* Wrangler CLI → [https://developers.cloudflare.com/workers/wrangler/](https://developers.cloudflare.com/workers/wrangler/)
* SQLite → [https://www.sqlite.org/docs.html](https://www.sqlite.org/docs.html)

---

# 🚀 PLAN GLOBAL

---

# 🟢 PHASE 0 — Setup

## Outils

* Node.js → [https://nodejs.org/](https://nodejs.org/)
* Git → [https://git-scm.com/](https://git-scm.com/)

```bash
node -v
npm -v
git --version
```

## Comptes

* GitHub → [https://github.com/](https://github.com/)
* Cloudflare → [https://dash.cloudflare.com/](https://dash.cloudflare.com/)

## Wrangler

```bash
npm install -g wrangler
wrangler login
```

---

# 🧠 PHASE 1 — Architecture

```txt
Navigateur
  ↓
Frontend (HTML/CSS/JS)
  ↓ fetch()
API (Cloudflare Worker)
  ↓ SQL
D1 Database
```

---

# 🏗 PHASE 2 — Projet

```bash
npm create cloudflare@latest
```

Options :

* Framework : none
* TypeScript : no
* Git : yes

---

# 🎨 PHASE 3 — Frontend

## Pages

* index.html
* games.html
* movies.html

## CSS

Apprendre :

* flexbox
* grid
* responsive
* variables CSS

## JS

Apprendre :

* DOM
* events
* fetch()
* async/await

---

# 🗄 PHASE 4 — BDD (D1)

## Créer DB

```bash
wrangler d1 create my-database
```

## wrangler.toml

```toml
[[d1_databases]]
binding = "DB"
database_name = "my-database"
database_id = "ID_ICI"
```

## schema.sql

```sql
CREATE TABLE games (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  platform TEXT,
  status TEXT,
  rating INTEGER,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

## Apply

```bash
wrangler d1 execute my-database --file=schema.sql
```

---

# ⚡ PHASE 5 — API

## GET games

```js
export async function onRequestGet(context) {
  const { results } = await context.env.DB
    .prepare("SELECT * FROM games")
    .all();

  return Response.json(results);
}
```

## Test

```bash
npm run dev
```

URL :
[http://localhost:8788/api/games](http://localhost:8788/api/games)

---

# ➕ PHASE 6 — POST data

* JSON
* INSERT SQL
* form HTML

```js
fetch("/api/games")
```

---

# 📦 PHASE 7 — Frontend data

```js
const res = await fetch('/api/games');
const games = await res.json();
```

→ génération de cards dynamiques

---

# 🔁 PHASE 8 — CRUD

| Action | SQL    |
| ------ | ------ |
| Create | INSERT |
| Read   | SELECT |
| Update | UPDATE |
| Delete | DELETE |

---

# 🧱 PHASE 9 — BDD structure

Tables :

* games
* movies
* series
* platforms
* genres
* statuses

---

# 🔍 PHASE 10 — Filtres

SQL :

* WHERE
* LIKE
* ORDER BY

---

# 🖼 PHASE 11 — Images

Option simple : URLs

Option avancée : Cloudflare R2
[https://developers.cloudflare.com/r2/](https://developers.cloudflare.com/r2/)

---

# 🎨 PHASE 12 — UI

* animations
* dark mode
* cards
* modals

Option : Tailwind
[https://tailwindcss.com/](https://tailwindcss.com/)

---

# 🚀 PHASE 13 — Deploy

```bash
git init
git add .
git commit -m "init"
git push
```

Cloudflare Pages → connect GitHub

---

# 🎬 PHASE 14 — APIs externes

🎮 Jeux : [https://rawg.io/apidocs](https://rawg.io/apidocs)

🎬 Films : [https://developer.themoviedb.org/](https://developer.themoviedb.org/)

---

# 🔐 PHASE 15 — Auth simple

* login unique
* page protégée

---

# 📊 PHASE 16 — Features

* stats
* wishlist
* tags
* favoris
* export JSON

---

# 🧹 PHASE 17 — Clean

* séparation JS
* refactor CSS
* optimisation API
