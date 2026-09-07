# Requote

A request-and-offer marketplace connecting clients with capable providers in Nigeria.

Requote lets people describe what they need, compare provider offers, and manage a protected transaction from agreement through delivery.

## Local development

    npm install
    npm run dev

## Quality checks

    npm run lint
    npm run build

## Stack

- Next.js 16 App Router
- React 19
- TypeScript

## Product routes

- `/` — landing page
- `/how-it-works` — transaction journey
- `/trust-safety` — verification, protection, and disputes
- `/post-a-request` — five-step request builder
- `/login` and `/create-account` — authentication handoff screens
- `/forgot-password` and `/verify-email` — account support screens
- `/terms`, `/privacy`, and `/cookies` — working legal policies

## Preview behavior

The request flow is functional as a product prototype. Drafts are saved in the browser and the preview API validates draft or publish submissions. Login and registration create a browser-only preview session; they do not create a real identity, send email, charge a payment method, notify providers, or persist data to a production database.

Before launch, connect a production authentication provider, database, file storage, notification service, and licensed payment/escrow partner. The working legal pages also require review by qualified Nigerian counsel.

## Environment

Set `NEXT_PUBLIC_SITE_URL` to the production origin when it differs from `https://requote.cc`. This is used to generate canonical and social metadata.
