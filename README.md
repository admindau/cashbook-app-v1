
# Cashbook (v11.2)

Savvy Rilla–branded cashbook with multi-currency transactions, converter, reusable modal, toasts, and charts.

## New in v11.2
- Fresh rebuild with complete files and compile-safe TSX
- Fixed conditional typo in Transactions page (`&&` instead of `and`)
- Ensured logo + favicon in place, cleaned NavBar (Converter icon only)

## Features
- Per-transaction currency (SSP, USD, KES)
- Dashboard shows raw values in native currencies
- Converter page using manually managed exchange rates (set in Settings)
- Toasts for add/delete/rate updates; confirmation modals for deletes and reset
- Local password with “Forgot Password” (resets only password)

## Run
```bash
npm i
npm run dev
```
