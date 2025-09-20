
# Cashbook (v11.3)

Savvy Rilla–branded cashbook with **email+password auth**, multi-currency transactions, **converter in Settings**, reusable modal, toasts, and charts.

## New in v11.3
- **Email + Password** at signup; **Email + Password** at login.
- **Logout** ends session and redirects to `/login` with email pre-filled.
- **Settings** adds a **Profile** section (update email, change password), plus **Exchange Rates**, **Converter**, and **Danger Zone**.
- NavBar cleaned: **Settings** link added; **Converter icon removed**.

## Run
```bash
npm i
npm run dev
```


## New in v11.4
- Added route guards: Dashboard, Transactions, Add, Search, and Settings now redirect to /login if no active session.


## New in v11.5
- NavBar buttons now check session state before navigating. If logged out, users are redirected to /login immediately.


## New in v11.6
- NavBar guard now shows a toast message ('Please log in first.') when redirecting to /login.


## New in v11.7
- Route guards now also show a toast message ('Please log in first.') when redirecting to /login.
