# Roaman (Web)

Roaman is a real-time, location-based accommodation platform designed to solve the problem of finding same-day and last-minute stays.

The product is built around the idea that truthful availability can only exist if hotels actively manage their rooms on the system. Roaman is delivered across three tightly connected applications—web, mobile, and desktop—all powered by a single backend infrastructure using Supabase as the central source of truth. Each application serves a distinct role while sharing the same availability logic, data integrity rules, and business constraints.

This folder (`roaman-web`) contains the Next.js web application.

## What this app includes

- Public, no-login experience for discovery and booking
- Hotel operator dashboard (authenticated)
- Platform admin dashboard (authenticated)
- Thin API layer (Next.js Route Handlers) over Supabase
- Real-time propagation of room availability via Supabase Realtime

## Architecture overview

### Clients

- Web (this app): Next.js App Router
- Mobile: React Native + Expo (planned / not pushed yet)
- Desktop: Electron (planned / not pushed yet)

### Backend (Supabase)

Supabase is the backbone of the entire ecosystem:

- Supabase Auth manages authentication for hotel staff and administrators
- PostgreSQL stores core entities (hotels, rooms, bookings, pricing rules, audit logs)
- Row Level Security (RLS) protects public views and enforces multi-tenant access rules
- Supabase Realtime synchronizes availability instantly across all clients
- Database views and functions encapsulate the “availability truth” and booking integrity

## Product flows

### Public (no account)

1. User opens the site and grants location permission
2. The app fetches nearby hotels with available rooms
3. User selects a hotel and room type
4. User books by providing minimal guest details (name/email/phone)
5. Booking confirmation is available via booking reference

### Hotel operations (authenticated)

Hotel operators can:

- Manage rooms and room status (available/occupied/reserved/maintenance)
- Update availability in real time
- Handle walk-in bookings
- Configure pricing rules
- View booking history and guest information

### Platform admin (authenticated)

Admins can:

- Onboard/manage hotels
- Monitor platform activity and audits
- Manage staff/admin accounts
- Oversee disputes and platform-wide configuration

## Codebase tour

### Routes

- Public pages: `app/(public)/...`
- Hotel dashboard: `app/hotel/...`
- Admin dashboard: `app/admin/...`
- Auth pages: `app/auth/...`
- API routes: `app/api/...`

### Supabase helpers

- Server client: `lib/supabase/server.ts`
- Browser client: `lib/supabase/client.ts`
- Session update + protected-route redirects: `lib/supabase/proxy.ts`

### Realtime

- Room updates subscription: `lib/hooks/use-realtime-rooms.ts`

### Database scripts

Supabase SQL scripts are in `scripts/`:

- `001-create-database-schema.sql`
- `002-create-rls-policies.sql`
- `003-create-views-and-functions.sql`
- `004-seed-sample-data.sql`

Notable database logic:

- `public_hotel_availability` view for safe/fast public browsing
- `get_nearby_hotels(...)` RPC for distance-based nearby search
- `reserve_room(...)` RPC for atomic booking creation with conflict checks

## Authentication & route protection

This app uses Supabase Auth for hotel operators and admins.

Protected routes:

- `/hotel/*` requires an authenticated user
- `/admin/*` requires an authenticated user

The middleware redirects unauthenticated users to:

- `/auth/hotel/login`
- `/auth/admin/login`

Implementation:

- Middleware entry: `middleware.ts`
- Middleware delegates to: `proxy.ts`
- The underlying session/redirect logic lives in: `lib/supabase/proxy.ts`

## Local development

### Prerequisites

- Node.js (modern version)
- pnpm
- A Supabase project

### Environment variables

Copy `.env.example` to `.env.local` and set these values:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Your Google Maps API key
- `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` (optional) - Custom redirect URL for development

**Getting your keys:**

- Supabase: https://app.supabase.com/project/_/settings/api
- Google Maps: https://console.cloud.google.com/google/maps-apis

### Install and run

```bash
pnpm install
pnpm dev
```

### Build

```bash
pnpm build
pnpm start
```

## Supabase configuration

### Email authentication setup

For hotel sign-up emails to work properly:

1. Go to Supabase Dashboard → Authentication → Email Templates
2. Customize the "Confirm signup" template if needed
3. Go to Authentication → Settings
4. **Enable email confirmations** (turn OFF "Disable email confirmations" if it's on)
5. Configure SMTP settings (or use Supabase's default email service)

**Note:** If email confirmations are disabled in Supabase, accounts will be auto-confirmed but users won't receive verification emails.

### Database setup

Run the SQL scripts in order:

```bash
# In Supabase SQL Editor, run these in sequence:
1. scripts/001-create-database-schema.sql
2. scripts/002-create-rls-policies.sql
3. scripts/003-create-views-and-functions.sql
4. scripts/004-seed-sample-data.sql (optional, for development)
```

## Deployment (Vercel)

This repo is a monorepo.

In Vercel, configure the project with:

- Root Directory: `roaman-web`
- Framework Preset: Next.js (auto-detected)
- Environment Variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

## Notes

- `roaman-mobile/` and `roaman-desktop/` exist in the repo but are not pushed yet.
- The root-level documentation should link to this file (recommended).
