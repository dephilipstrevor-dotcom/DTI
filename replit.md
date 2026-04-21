# GradRoute

Study-abroad advisor app with a React (Vite) frontend and an Express/Node backend.

## Project layout
- `gradroute-frontend/` — React 19 + Vite 8 + Tailwind 3
- `backend/` — Express API (Supabase + Gemini)

## Local dev (Replit)
- Frontend workflow `Start application` runs `npm run dev` in `gradroute-frontend/` on port **5000** (host `0.0.0.0`, all hosts allowed).
- Backend workflow `Backend` runs `node index.js` in `backend/` on port **3001** (localhost).
- Vite dev server proxies `/api` to `http://localhost:3001`. Frontend uses `VITE_API_URL=/api` (set in `gradroute-frontend/.env`).

## Required secrets (set as env vars when used)
- Backend: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`, `GEMINI_API_KEY`, `SUPABASE_JWT_SECRET`
- Frontend: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_GOOGLE_CLIENT_ID`

### Backend secret notes
- `SUPABASE_JWT_SECRET` — **required**. Used by `backend/middleware/auth.js` to cryptographically verify incoming Supabase access tokens locally (HS256) on every authenticated request. Copy it from Supabase dashboard → Project settings → API → JWT Settings → JWT Secret. If missing, every authenticated route returns `500 AUTH_MISCONFIGURED` by design (fail-closed).
- `PRODUCTION_ORIGIN` — required before flipping DNS. Sets the single frontend origin allowed through CORS outside local dev (e.g. `https://gradroute.yourdomain.com`). Defaults to the placeholder `https://gradroute.example.com`, which will block real traffic.
- `NODE_ENV` — CORS dev origins (`http://localhost:5000`, `http://localhost:5173`) are only allow-listed when `NODE_ENV === 'development'` is set **explicitly**. Any other value (including unset, `production`, `test`, `staging`, typos) collapses the allow-list to `PRODUCTION_ORIGIN` alone — i.e. the allow-list fails closed, so a forgotten `NODE_ENV` in prod can never leak localhost through CORS. Local dev must therefore export `NODE_ENV=development` (Replit and most cloud runtimes already do).

## Deployment (autoscale)
- Build: `cd gradroute-frontend && npm install && npm run build`
- Run: `cd backend && npm install --omit=dev && PORT=5000 node index.js`
- The Express server serves the built frontend from `gradroute-frontend/dist` and exposes `/api/*` routes.
