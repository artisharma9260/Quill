# Quill – MERN Blogging Platform

React 19 + TypeScript + Vite + Tailwind v4 (client) · Node/Express + MongoDB Atlas + JWT (server).

```
client/   -> deploy to Vercel
server/   -> deploy to Render
```

## Features
Register / login (bcrypt + JWT) · create, edit, delete posts · drafts & published · markdown content ·
categories, tags, search, pagination · author dashboard · protected routes · rate-limited auth · CORS allow-list.

## Run locally
```bash
# 1. Server
cd server && cp .env.example .env     # set MONGODB_URI and JWT_SECRET
npm install
npm run seed                           # optional demo data (sarah@example.com / password123)
npm run dev                            # http://localhost:5000

# 2. Client (new terminal)
cd client && cp .env.example .env      # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev                            # http://localhost:5173
```

## Deploy

### 1. MongoDB Atlas
Create a free cluster → Database Access: add a user → Network Access: allow `0.0.0.0/0`
→ Connect → Drivers → copy the connection string (add a db name, e.g. `/quill`).

### 2. Backend on Render
1. Push this repo to GitHub.
2. Render → New → **Web Service** → pick the repo (or New → Blueprint; `render.yaml` is included).
3. Settings: **Root Directory** `server` · Build `npm install` · Start `npm start`.
4. Environment variables:

| Key | Value |
|---|---|
| `MONGODB_URI` | your Atlas string |
| `JWT_SECRET` | long random string |
| `CLIENT_URL` | your Vercel URL (add after step 3; comma-separate multiple origins) |
| `NODE_ENV` | `production` |

5. Deploy, then check `https://<your-api>.onrender.com/api/health`.
6. Optional seed: Render Shell → `npm run seed`.

### 3. Frontend on Vercel
1. Vercel → Add New Project → import the repo.
2. **Root Directory** `client` (framework Vite is auto-detected; build `npm run build`, output `dist`).
3. Environment variable: `VITE_API_URL` = `https://<your-api>.onrender.com/api`
4. Deploy, then put the Vercel URL into Render's `CLIENT_URL` and redeploy the API.

`client/vercel.json` rewrites all routes to `index.html` so deep links like `/blog/:id` work on refresh.

## Notes
- Render's free tier sleeps after ~15 min idle; the first request can take ~30–60 s.
- `VITE_API_URL` is baked in at build time — redeploy the client after changing it.
- Auth token is stored in `localStorage` (simple setup). For stricter security move to httpOnly cookies.

## API
`POST /api/auth/register` · `POST /api/auth/login` · `GET /api/auth/me`
`GET /api/blogs?search=&category=&page=&limit=` · `GET /api/blogs/mine?status=` · `GET /api/blogs/:id`
`POST /api/blogs` · `PUT /api/blogs/:id` · `DELETE /api/blogs/:id` · `GET /api/health`
