# Requote waitlist — Supabase setup

The application is ready to write waitlist entries through the server-only
`POST /api/waitlist` endpoint. Complete these steps before testing submissions.

## 1. Create the database table

Open the Supabase dashboard, select the Requote project, and open **SQL Editor**.
Run the complete contents of:

`supabase/migrations/20260909000000_create_waitlist_entries.sql`

The migration creates the private `waitlist_entries` table, validation checks,
indexes, timestamp trigger, and restricted grants. Browser roles do not receive
direct table access.

## 2. Add server credentials locally

Copy `.env.example` to `.env.local` and replace the placeholders with:

- `SUPABASE_URL`: Project Settings → Data API → Project URL.
- `SUPABASE_SECRET_KEY`: Project Settings → API Keys → create or copy a secret
  key beginning with `sb_secret_`.
- `NEXT_PUBLIC_SITE_URL`: `http://localhost:3000` locally and
  `https://requote.cc` in production.

The secret key bypasses Row Level Security and must only exist in server
environment variables. Never prefix it with `NEXT_PUBLIC_`, paste it into
client-side code, or commit `.env.local`.

## 3. Add production variables in Vercel

In the Vercel project, open **Settings → Environment Variables** and add
`SUPABASE_URL`, `SUPABASE_SECRET_KEY`, and `NEXT_PUBLIC_SITE_URL` for Production
and Preview as appropriate. Redeploy after saving them.

## 4. Test

Submit `/waitlist` once as a requester and once as a provider. In Supabase,
open **Table Editor → waitlist_entries** and confirm both records. Submitting
the same email again updates that entry instead of creating a duplicate.

Before a larger public campaign, add a distributed rate limiter or Turnstile
verification to the endpoint. The first release already includes same-origin
checking, server validation, a payload limit, and a form honeypot.
