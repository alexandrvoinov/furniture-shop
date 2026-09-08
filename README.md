# Mebel Shop Frontend

Frontend foundation for a furniture store built with Next.js, React, TypeScript, and SCSS.

## Scripts

- `npm run dev` - start the Next.js dev server
- `npm run build` - create a production build
- `npm run start` - start the production server
- `npm run lint` - run ESLint
- `npm run typecheck` - run TypeScript checks
- `npm run format` - format files with Prettier

## Backend

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_API_URL` when the Python backend is ready.

The shared HTTP client lives in `src/shared/api`, and product integration placeholders live in `src/entities/product`.
