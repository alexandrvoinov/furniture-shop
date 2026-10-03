# VEEMA ASTANA Frontend

Public frontend for a custom furniture workshop built with Next.js, React, TypeScript, SCSS, ESLint, Prettier, and Husky.

## Requirements

- Node.js 20+
- npm
- Running Python backend

## Environment

Create `.env.local` for local development:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
NEXT_PUBLIC_PHONE_DISPLAY=+7 778 652 68 72
NEXT_PUBLIC_WHATSAPP_URL=https://wa.me/77786526872
NEXT_PUBLIC_INSTAGRAM_URL=https://www.instagram.com/veema__astana/
NEXT_PUBLIC_CONTACT_EMAIL=hello@veema.kz
NEXT_PUBLIC_CONTACT_ADDRESS=Казахстан
```

For production:

```env
NEXT_PUBLIC_API_URL=https://api.example.kz
NEXT_PUBLIC_PHONE_DISPLAY=+7 778 652 68 72
NEXT_PUBLIC_WHATSAPP_URL=https://wa.me/77786526872
NEXT_PUBLIC_INSTAGRAM_URL=https://www.instagram.com/veema__astana/
NEXT_PUBLIC_CONTACT_EMAIL=hello@veema.kz
NEXT_PUBLIC_CONTACT_ADDRESS=Казахстан
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

## Backend Integration

- Public site content comes from backend `/site-content`.
- Project photos are read from `projects[].media` and displayed as portfolio cards/details.
- Hero and process videos are read from `production[].media` and loaded from `/media/...`.
- Client contact CTAs open WhatsApp directly; the frontend does not store requests or run an onsite estimate form.
- Money values are displayed as Kazakhstan tenge (`KZT`).
- This frontend contains only the public lead-generation website and backend API integration.
