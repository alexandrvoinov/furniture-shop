# Mebel Shop Frontend

Frontend foundation for a furniture store built with Next.js, React, TypeScript, and SCSS.

## Scripts

- `npm run dev` - start the Next.js dev server
- `npm run build` - create a production build
- `npm run start` - start the production server
- `npm run seed:demo` - create reusable demo CRM data through the backend API
- `npm run lint` - run ESLint
- `npm run typecheck` - run TypeScript checks
- `npm run format` - format files with Prettier

## Backend

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_API_URL` when the Python backend is ready.

The shared HTTP client lives in `src/shared/api`, and product integration placeholders live in `src/entities/product`.

## Manager Cabinet

- `/manager` reads the local FastAPI backend through `NEXT_PUBLIC_API_URL`.
- `/login` protects the manager cabinet with a temporary frontend session cookie.
- Connected read models: dashboard, orders, clients, payments, drawings, metadata.
- Money values are displayed as Kazakhstan tenge (`KZT`).
- Backend code lives outside this frontend project and should not be modified from here.

## Auth

The current login is a frontend-only development layer.

- Admin demo credentials are configured with `AUTH_DEMO_EMAIL` and `AUTH_DEMO_PASSWORD` and
  default to `admin@mebel.kz` / `admin12345`.
- Customer demo credentials are configured with `AUTH_CUSTOMER_DEMO_EMAIL` and
  `AUTH_CUSTOMER_DEMO_PASSWORD` and default to `client@mebel.kz` / `client12345`.

This does not replace backend security. When the Python backend gets real auth, replace the demo
check in `src/entities/auth/server.ts` with a backend login call and keep the UI/middleware flow.

## Demo Data

Run `npm run seed:demo` while the backend is available at `NEXT_PUBLIC_API_URL`.
The script creates demo clients, orders, payments in tenge, and uploaded drawing files through public API endpoints.
It reuses existing demo records when possible, so repeated runs should not create duplicate demo rows.
