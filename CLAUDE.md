# CUTF — Barbershop Queue System

## Project overview

A mobile-first queue management system for a hair salon / barbershop.
Customers take a numbered token, track their position live, and are called when it's their turn.
The admin manages the queue in real time from a dashboard.
A fullscreen display board shows the current serving number on a TV.

Four routes:
- `/`              Customer home — take a token, check queue stats
- `/queue/[number]`  Customer queue status — live position + wait time
- `/display`       TV display board — fullscreen, auto-refreshes every 3s
- `/admin`         Admin dashboard — call next, complete, skip, stats
- `/admin/settings` Admin settings — shop name, tagline, avg service time

---

## Tech stack

| Tool | Version | Purpose |
|------|---------|---------|
| Next.js | 15.3.3 (App Router) | Framework |
| React | 19 | UI |
| TypeScript | 5 (strict) | Types |
| Tailwind CSS | 3.4 | Styling |
| Zustand | 5 | State management |
| Geist | 1.3 | Typography (from `geist` npm package) |
| clsx + tailwind-merge | latest | Conditional class names via `cn()` |

---

## Design system

### Colors (defined in `tailwind.config.ts`)

| Token | Value | Usage |
|-------|-------|-------|
| `bg-base` | `#090909` | Page background |
| `bg-surface` | `#111111` | Cards, inputs |
| `bg-elevated` | `#181818` | Elevated cards, secondary inputs |
| `bg-overlay` | `#222222` | Modals, tooltips |
| `line` | `#222222` | Borders |
| `line-focus` | `#C8A86A` | Focus / selected borders |
| `ink-primary` | `#F0F0F0` | Primary text |
| `ink-secondary` | `#7A7A7A` | Secondary text |
| `ink-muted` | `#4A4A4A` | Muted/placeholder text |
| `gold` | `#C8A86A` | Primary CTA, accent, prices |

### Typography

- Body: `GeistSans` via CSS variable `--font-geist-sans`
- Token numbers / display: `GeistMono` via CSS variable `--font-geist-mono`, class `font-mono`
- Token number tracking: `tracking-token` (0.2em) and `tracking-display` (0.25em)

### Components

All base UI components are in `src/components/ui/`:
- `Button` — variants: `primary | secondary | ghost | destructive`, sizes: `sm | md | lg`, `loading` prop
- `Badge` — variants match `TokenStatus` type plus `neutral`
- `Card` + `CardSection` + `CardDivider` — variants: `default | elevated | flat | highlighted`
- `Input` — label, error, helper text
- `Spinner` — sizes: `sm | md | lg`

---

## Architecture

### Data flow (current — mock)

```
Pages / Hooks
  → useQueueStore (Zustand)
    → queue.service.ts (mock in-memory)
```

### Data flow (after backend)

```
Pages / Hooks
  → useQueueStore (Zustand)
    → queue.service.ts (real HTTP via api.ts)
      → Backend REST API
        → WebSocket (optional, for push updates)
```

### Key files

| File | Purpose |
|------|---------|
| `src/types/queue.ts` | All domain types (`QueueToken`, `Service`, `Shop`, etc.) |
| `src/types/api.ts` | API request/response envelope types |
| `src/services/queue.service.ts` | ALL data operations — currently mock, ready to swap |
| `src/store/queue.store.ts` | Zustand store — calls service, manages loading/error state |
| `src/hooks/usePolling.ts` | `setInterval`-based polling hook |
| `src/hooks/useQueue.ts` | Domain hooks that combine store + polling |
| `src/lib/api.ts` | Fetch wrapper — unused now, wired up when backend ready |
| `src/lib/utils.ts` | `cn()`, `formatTokenNumber()`, `formatWait()`, etc. |

---

## Connecting the backend

The contract is already defined in `src/types/api.ts`. The only file that needs to change is `src/services/queue.service.ts`.

### Required REST endpoints

```
GET    /api/shop                      → Shop
PATCH  /api/shop                      → Shop
GET    /api/queue/summary             → QueueSummary
GET    /api/queue/tokens              → QueueToken[]
GET    /api/queue/tokens/:number      → QueueToken | null
POST   /api/queue/tokens              body: { serviceId, customerName? } → QueueToken
PATCH  /api/queue/tokens/:id/cancel   → void
POST   /api/queue/call-next           → QueueToken | null
POST   /api/queue/complete            → void
PATCH  /api/queue/tokens/:id/skip     → void
```

All responses wrap in `{ success: boolean, data: T, message?: string }`.

### Environment variable

Set in `.env.local`:
```
NEXT_PUBLIC_API_URL=https://your-api.com/api
```

### WebSocket (optional, for real-time push)

The polling in `usePolling.ts` can be replaced with a WebSocket listener.
The display board polls every 3s; customer queue page polls every 4s.
Replace `setInterval` in `usePolling.ts` with a WS subscription for lower latency.

---

## Daily token reset

Currently the token number is stored in the mock service as `nextTokenNumber`.
On the backend, this should reset to 001 at midnight each day (shop timezone).
The `QueueToken.displayNumber` field is always a zero-padded 3-digit string.

---

## Running locally

```bash
npm install
npm run dev        # http://localhost:3000
```

Pages:
- Customer: http://localhost:3000
- Queue:    http://localhost:3000/queue/043
- Display:  http://localhost:3000/display   (open on TV, fullscreen with F11)
- Admin:    http://localhost:3000/admin

---

## Deployment checklist

- [ ] Set `NEXT_PUBLIC_API_URL` in production environment
- [ ] Add admin authentication (protect `/admin/*` routes via `middleware.ts`)
- [ ] Set up daily token counter reset in backend (midnight cron)
- [ ] Configure `next.config.ts` image domains if shop logo is added
- [ ] Replace `window.confirm` in queue cancel with a proper modal component
- [ ] Test display board at 1080p and 4K (it uses `clamp()` for font sizing)
- [ ] Add PWA manifest so customers can "Add to Home Screen"

---

## Known limitations (pre-backend)

- All state is in-memory — a page refresh on a different tab starts fresh (Zustand is not persisted)
- Admin authentication is not implemented — add `middleware.ts` before production
- `window.confirm` used for cancel confirmation — replace with a modal
- No push notifications when token is called — implement via Web Push API or SMS after backend
