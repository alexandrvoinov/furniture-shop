# Mebel Shop Frontend

Frontend for a furniture store built with Next.js, React, TypeScript, SCSS, ESLint, Prettier, and Husky.

## Requirements

- Node.js 20+
- npm
- Running Python backend

## Environment

Create `.env.local` for local development:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
AUTH_COOKIE_SECURE=false
```

For production, set the real API URL and secure cookies:

```env
NEXT_PUBLIC_API_URL=https://api.example.kz
AUTH_COOKIE_SECURE=true
```

`NEXT_PUBLIC_API_URL` is required during production builds.

## Scripts

- `npm run dev` - start the Next.js dev server
- `npm run build` - create a production build
- `npm run start` - start the production server
- `npm run lint` - run ESLint
- `npm run lint:fix` - fix ESLint issues where possible
- `npm run typecheck` - run TypeScript checks
- `npm run format` - format files with Prettier
- `npm run format:check` - check formatting

## Production Checklist

1. Run backend migrations with `python -m app.migrate`.
2. Create or promote the manager/admin user on the backend.
3. Set production frontend environment variables.
4. Run `npm ci`.
5. Run `npm run build`.
6. Start with `npm run start` or deploy through your hosting provider.

## Backend Integration

The frontend talks to the backend through `NEXT_PUBLIC_API_URL`.

- Auth routes proxy login, registration, logout, and current-session checks through the Next app.
- Product pages, cart, catalog, and manager screens expect real backend data.
- Money values are displayed as Kazakhstan tenge (`KZT`).
- Backend code is stored in a separate folder and should be changed only in the backend project.
