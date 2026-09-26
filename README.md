# TypingMaster

Interactive typing practice with accounts, saved sessions, word-count and timed tests, and a personal stats dashboard.

## Features

- JWT auth with httpOnly cookies (signup, login, logout)
- Word lists by category from MongoDB (Coding, Animals, Things, Places)
- **Word count** tests (3–100 words) and **30s / 60s** timed tests
- Live WPM and accuracy while typing
- Session history and aggregate stats (best WPM, averages)
- Docker and GitHub Actions CI

## Quick start (local)

1. Copy environment file:

   ```bash
   cp .env.example .env
   ```

2. Install and seed (requires MongoDB running locally):

   ```bash
   npm install
   npm run seed
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000), sign up, and start a test.

## Theming

Edit colors in [`public/css/theme.css`](public/css/theme.css). Other stylesheets use CSS variables from that file.

## Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Run production server |
| `npm run dev` | Run with nodemon (hot reload on `src/`, `templates/`, `public/`) |
| `npm run seed` | Populate word categories |
| `npm test` | Unit + API tests |

## Docker

```bash
docker compose up --build
```

Then seed words inside the app container (one time):

```bash
docker compose exec app npm run seed
```

## Netlify

This app is a **Node/Express server** (Handlebars + API routes), not a static site. Netlify runs it via a serverless function (`netlify/functions/server.js`). The repo includes `netlify.toml` so routes like `/` and `/login` are rewritten to that function instead of Netlify’s static 404 page.

**Before the site works in production:**

1. In [Netlify Site settings → Environment variables](https://docs.netlify.com/environment-variables/overview/), set:
   - `MONGODB_URI` — use [MongoDB Atlas](https://www.mongodb.com/atlas) (Netlify cannot reach `localhost`)
   - `JWT_SECRET` — a long random secret
   - `NODE_ENV` — `production` (Netlify often sets this automatically)

2. Seed word categories once against the same database (from your machine):

   ```bash
   set MONGODB_URI=your-atlas-connection-string
   npm run seed
   ```

3. In **Site configuration → Build & deploy**, prefer settings from `netlify.toml` (build command `npm ci`, publish directory `public`, functions directory `netlify/functions`). Trigger **Deploy site** after pushing.

4. Open the site root URL — you should see **Log In**, not Netlify’s generic “Page not found”.

## Environment

| Variable | Description |
|----------|-------------|
| `PORT` | HTTP port (default `3000`) |
| `MONGODB_URI` | Mongo connection string |
| `JWT_SECRET` | Secret for signing auth tokens |
| `NODE_ENV` | `development` or `production` |

## Project layout

- `src/` — Express app, routes, services, models
- `public/` — Static assets and client typing engine
- `templates/` — Handlebars views
- `tests/` — Node test runner + Supertest
