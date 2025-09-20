# Cashbook v13.1 (Clean) — Supabase + Prisma + DB Categories

## Setup (local)
1) Copy `.env.example` to `.env` and paste your Supabase Postgres `DATABASE_URL`.
2) `npm install`
3) `npx prisma migrate dev --name init`
4) `npm run dev` (http://localhost:3000)

## Deploy (Vercel)
- Set `DATABASE_URL` in Project → Settings → Environment Variables.
- Build will run `prisma generate && prisma migrate deploy` automatically.

## Features
- Email/password auth (hashed SHA256)
- Transactions with categories (DB-driven)
- Dashboard charts, search, add, delete, delete all
- Settings: Profile, Change Password, Exchange Rates, Converter, Manage Categories (Add + Delete with typed confirmation)
- Toasts, modals, guarded routes
