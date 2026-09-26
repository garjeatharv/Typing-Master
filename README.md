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

1. Create a `.env` file in the project root (see [Environment](#environment) below). This file is gitignored—never commit it.

2. Install and seed (requires MongoDB running locally, or use Atlas in `MONGODB_URI`):

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

This app is a **Node/Express server** (Handlebars + API routes), not a static site. Netlify runs it via `netlify/functions/server.js`. **Netlify cannot connect to `127.0.0.1:27017`** — you must use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) (free tier is fine).

### One-time Atlas setup

1. Create a free **M0** cluster.
2. **Database Access** → add a database user (remember username + password).
3. **Network Access** → **Add IP Address** → allow **`0.0.0.0/0`** (required for Netlify serverless).
4. **Connect** → **Drivers** → copy the connection string (`mongodb+srv://...`).
5. Replace `<password>` in the URI with your user’s password (URL-encode special characters).

### Netlify environment variables

In **Site configuration → Environment variables**, add **only these two** (do not add `PORT` or `NODE_ENV` in Netlify—they trigger false positives in secrets scanning and are not required):

| Variable | Value |
|----------|--------|
| `MONGODB_URI` | Your full Atlas `mongodb+srv://...` string (set only in Netlify, never commit it) |
| `JWT_SECRET` | A **new** long random string (32+ chars), unique to Netlify—not your local `.env` value if that was ever committed. |

Netlify sets `NODE_ENV=production` automatically during builds.

Run locally before pushing:

```bash
npm test
npm run verify:netlify
```

Then **Deploys → Trigger deploy → Deploy site** (env changes do not apply until you redeploy).

Word categories **seed automatically** the first time the app connects to an empty database. You do not need to run `npm run seed` on Netlify if Atlas is configured correctly.

If env vars are missing or Atlas blocks the connection, the site shows a **setup help page** instead of a generic function crash. Fix the variables above and redeploy.

Local `netlify dev` reads from your gitignored `.env` in the project root.

## Environment

Create `.env` in the project root (not committed to git):

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/LoginFormPractice
JWT_SECRET=your-local-dev-secret
NODE_ENV=development
```

For local dev with Atlas, set `MONGODB_URI` to your `mongodb+srv://...` string instead.

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
