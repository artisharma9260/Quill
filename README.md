# Quill - Blogging Platform (MERN Stack)

A full-stack blogging website where users can register, log in, write blog posts, save drafts, publish them, and manage their posts from a dashboard.

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Atlas)
- **Authentication:** JWT + bcrypt
- **Deployment:** Vercel (frontend), Render (backend)

## Features

- User registration and login
- Create, edit and delete blog posts (Markdown supported)
- Draft and published posts
- Search, category filter and pagination
- Personal dashboard
- Protected routes (only the author can edit or delete a post)

## Project Structure

```
client/    -> React frontend
server/    -> Express backend
```

## How to Run Locally

### 1. Backend

```bash
cd server
npm install
```

Create a `.env` file inside `server/` (copy from `.env.example`):

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=any_long_random_string
CLIENT_URL=http://localhost:5173
```

Start the server:

```bash
npm run dev
```

Optional: add demo data with `npm run seed`
(demo login: `sarah@example.com` / `password123`)

### 2. Frontend

```bash
cd client
npm install
```

Create a `.env` file inside `client/` (copy from `.env.example`):

```
VITE_API_URL=http://localhost:5000/api
```

Start the app:

```bash
npm run dev
```

Open http://localhost:5173

## Deployment

1. **Database:** Create a free cluster on MongoDB Atlas, add a user, allow access from `0.0.0.0/0`, and copy the connection string.
2. **Backend on Render:** New Web Service, Root Directory `server`, Build Command `npm install`, Start Command `npm start`. Add the environment variables `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`.
3. **Frontend on Vercel:** Import the repo, Root Directory `client`, add the environment variable `VITE_API_URL=https://your-backend.onrender.com/api`.
4. Copy the Vercel URL into `CLIENT_URL` on Render and redeploy the backend.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register a user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| GET | /api/blogs | Get all published blogs |
| GET | /api/blogs/mine | Get my blogs |
| GET | /api/blogs/:id | Get a single blog |
| POST | /api/blogs | Create a blog |
| PUT | /api/blogs/:id | Update a blog |
| DELETE | /api/blogs/:id | Delete a blog |

