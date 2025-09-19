
# Cashbook (No-Backend)

A modern personal cashbook app built with **Next.js (App Router)**, **TypeScript**, **Tailwind**, and **Chart.js**.

- Login with a local password (hashed in the browser)
- Track **income/expenses** with categories
- Full **transactions** table with inline edits & delete
- **Dashboard charts** (totals & by category)
- **Search** and date-range filters
- **CSV export** (see `lib/storage.ts:exportCSV()`)
- All data stored in **localStorage** (no backend, zero env vars)
- Dark/light toggle, modern UI

## One-click deploy flow
1. Create a **new, empty GitHub repo** and upload this folder (or the provided ZIP) as-is.
2. On Vercel: **Import** from that repo. No env vars needed.
3. Open the site → set your password → start tracking.

> Note: This is a personal tracker; the password is client-only and protects access on the current device. For multi-user or cloud sync, add a real backend later (e.g., Postgres + NextAuth).

## Scripts
```bash
pnpm dev  # or npm run dev / yarn dev
pnpm build
pnpm start
```

## Tech
- Next.js 14 (App Router)
- TailwindCSS
- Chart.js via react-chartjs-2
- TypeScript
