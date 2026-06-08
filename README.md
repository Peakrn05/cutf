# CUTF — Barbershop Queue System

Production-ready queue management system for hair salons and barbershops.

## Quick Start

### Frontend (Next.js)

```bash
cd C:/Users/Rattanbaan_N/Desktop/cutting/cutf

npm install

# Create .env file
cp .env.example .env

# Edit .env to point backend URL
# NEXT_PUBLIC_API_URL=http://localhost:3001

# Run development server
npm run dev

# App at http://localhost:3000
```

### Backend (NestJS + PostgreSQL)

```bash
cd "C:/Users/Rattanbaan_N/Desktop/cut backend/cut-back"

npm install

# Create .env
cp .env.example .env

# Update .env with PostgreSQL credentials
# DATABASE_HOST=localhost
# DATABASE_USER=postgres
# DATABASE_PASSWORD=postgres
# DATABASE_NAME=cutf_queue

# Create database
createdb cutf_queue

# Run server
npm run start:dev

# API at http://localhost:3001
```

## Architecture

Frontend → Zustand Store → Queue Service (HTTP) → Backend API → PostgreSQL

## Routes

- `/` — Customer home
- `/queue/[number]` — Token status
- `/display` — TV display board
- `/admin` — Dashboard
- `/admin/settings` — Configuration

## API (10 endpoints)

All endpoints return `{ success: boolean, data: T }`

### Shop
- `GET /api/shop` — Fetch config
- `PATCH /api/shop` — Update config

### Queue
- `GET /api/queue/summary` — Queue stats
- `GET /api/queue/tokens` — All tokens
- `GET /api/queue/tokens/:number` — Single token
- `POST /api/queue/tokens` — Take token
- `PATCH /api/queue/tokens/:id/cancel` — Cancel
- `PATCH /api/queue/tokens/:id/skip` — Skip (no-show)
- `POST /api/queue/call-next` — Call next
- `POST /api/queue/complete` — Complete + call next

## Features

- Real-time queue tracking
- Estimated wait calculation
- Admin dashboard with controls
- Fullscreen TV display
- Dark theme with gold accent
- Mobile responsive
- Type-safe (full TypeScript)
- No emoji (clean UI)
- Production database with migrations

## Building

```bash
# Frontend
npm run build
npm run start

# Backend
npm run build
npm run start:prod
```

## Documentation

See `CLAUDE.md` for full system documentation.
