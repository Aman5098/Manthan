# The Manthan School — News & Events + Admissions

Two-app repo:
- `/api` — Node.js + Express + MongoDB (Mongoose) backend
- `/web` — Next.js (App Router) frontend, including the `/admin` panel

## Local development

### 1. API

```
cd api
cp .env.example .env   # fill in MONGODB_URI, JWT_SECRET, CRM_WEBHOOK_URL
npm install
npm run seed:admin        # creates the admin user from ADMIN_SEED_EMAIL/PASSWORD in .env
npm run seed:news-events  # optional: seeds 7 demo news/events with a placeholder image
npm run dev               # http://localhost:5000
```

### 2. Web

```
cd web
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_URL
npm install
npm run dev            # http://localhost:3000
```

Admin panel: http://localhost:3000/admin/login

## Environment variables

### api/.env
- `PORT` — API port (default 5000)
- `MONGODB_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — secret for signing admin JWTs
- `CRM_WEBHOOK_URL` — webhook.site (or other) URL enquiries are pushed to
- `WEB_ORIGIN` — comma-separated allowed CORS origins for the web app
- `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD` — used only by `npm run seed:admin`

### web/.env.local
- `NEXT_PUBLIC_API_URL` — base URL of the deployed API, e.g. `https://api.example.com/api`

## Deployment notes

- Deploy `/api` and `/web` as separate Node apps/services on Hostinger.
- Point `MONGODB_URI` at the Atlas cluster; run `npm run seed:admin` once against production env vars to create the admin login.
- Set `NEXT_PUBLIC_API_URL` on the web app to the public URL of the deployed API.
- Ensure `/api/uploads` is served over HTTPS and persists across deploys (or swap for cloud storage if the host's filesystem is ephemeral).
