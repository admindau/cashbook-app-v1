# Cashbook (v11.9.2)

Savvy Rilla–branded cashbook with email+password auth, protected routes, reusable modal, toasts, charts, search, and multi-currency with embedded converter in Settings.

## Key Features
- Email + Password auth (signup & login)
- Logout → /login (email pre-filled)
- Route guards + NavBar guards with **toast** (“Please log in first.”)
- Signup success toast (“Account created successfully.”)
- Login success toast (“Welcome back!”)
- Transactions with per-transaction currencies (SSP, USD, KES)
- Dashboard charts (Chart.js)
- Search
- Settings: Profile (update email & change password), Exchange Rates, Converter, Danger Zone (reset with modal)
- Savvy Rilla logo + favicon

## Run
```bash
npm i
npm run dev
```

## Build
```bash
npm run build && npm start
```