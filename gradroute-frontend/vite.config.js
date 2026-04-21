import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// Factory-default Vite config. No explicit `server` block: Vite falls back to
// its defaults (host `localhost`, port `5173`). The previous config pinned
// host `0.0.0.0` + port `5000` + `allowedHosts: true` + a `/api` → `:3001`
// proxy so the app would bind correctly inside Replit's container. Outside
// Replit those values cause ERR_CONNECTION_REFUSED / hostname-rejection on
// Vercel and plain `localhost` dev — hence the revert.
//
// Implications elsewhere:
//   • `gradroute-frontend/.env` (VITE_API_URL=/api) still works for prod
//     because the Express server in `backend/index.js` serves the built
//     frontend from `gradroute-frontend/dist` and owns both `/api/*` and
//     the SPA fallback on the same origin.
//   • For local dev you need the Express backend reachable at the same
//     origin the frontend talks to (e.g. set VITE_API_URL=http://localhost:3001
//     in `gradroute-frontend/.env.local`), or re-introduce a narrower proxy
//     scoped to your local workflow only.
//   • `http://localhost:5173` is already on the backend CORS allow-list in
//     dev (see `backend/index.js`), so Vite's default port Just Works once
//     NODE_ENV=development is exported on the backend side.
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ]
})
