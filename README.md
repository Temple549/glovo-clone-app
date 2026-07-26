## Food Delivery Platform

This repository contains a full-stack food delivery platform with a Node/Express backend and a Next.js frontend. The project is split into two top-level folders:

- `backend/` — Express + TypeScript API, MongoDB models, auth, and admin/vendor features.
- `frontend/` — Next.js app (React + TypeScript) that consumes the backend API.

**Quick Start**

- Install dependencies for both packages:

	- Backend

		```bash
		cd backend
		npm install
		```

	- Frontend

		```bash
		cd frontend
		npm install
		```

- Run the backend (development):

	```bash
	cd backend
	npm run dev
	```

- Run the frontend (development):

	```bash
	cd frontend
	npm run dev
	```

**Environment variables**

- Backend (`backend/.env`) — required keys include:
	- **MONGODB_URI**: MongoDB connection string
	- **FRONTEND_URL**: Frontend origin (used for CORS)
	- **AUTH_TOKEN_SECRET**: JWT signing secret (min 32 chars)
	- **AUTH_TOKEN_EXPIRES_IN**: Token TTL (default `7d`)
	- **AUTH_COOKIE_NAME**: Cookie name for auth session (default `food_delivery_session`)

- Frontend — set `NEXT_PUBLIC_API_URL` in the environment (Vercel/Netlify) to your backend base URL (including `/api`), e.g. `https://api.example.com/api`. If not set, the project defaults are used for local development.

**Notes about API base URL**

- The frontend uses `frontend/services/api-client.ts` to compose requests. In production the app must call the backend host (not the frontend host). Set `NEXT_PUBLIC_API_URL` in your hosting provider to the backend origin (including `/api`) so requests target the correct server.

**Routes (examples)**

- Auth: `/api/auth/*` — login, register, logout, `GET /api/auth/me` (requires cookie-based auth)
- Vendors: `/api/vendors` — list and vendor details

**Testing and Type Checking**

- Run frontend type checks:

	```bash
	cd frontend
	npm run typecheck
	```

**Deployment tips**

- Backend: Ensure environment variables are configured on your provider (MongoDB URI, JWT secret, FRONTEND_URL) and the server listens on the production port.
- Frontend (Vercel): Set `NEXT_PUBLIC_API_URL` to your backend base URL (including `/api`). Redeploy after updating env vars.

**Troubleshooting**

- Network errors calling `/api/*` from the production frontend usually indicate an incorrect `NEXT_PUBLIC_API_URL` or CORS misconfiguration. Verify the frontend is pointing to the backend hostname and that `FRONTEND_URL` is listed in the backend CORS config.

**Where to look in the repo**

- Backend entry: [backend/src/app.ts](backend/src/app.ts#L1)
- API routes: [backend/src/routes/index.ts](backend/src/routes/index.ts#L1)
- Frontend API client: [frontend/services/api-client.ts](frontend/services/api-client.ts#L1)


