# Waitlist refresh

Date: 26 October 2026. Target branch: dev.

## Direction

An editorial white canvas replaces the oversized joined-panel layout. The existing Requote logo, Hanken Grotesk / Plus Jakarta Sans type pairing, blue actions, and collaboration image are reused. The introduction is people-led, without fabricated member counts, testimonials, launch dates, verification claims, or live-investment promises.

Desktop pairs the introduction and photograph with a compact independent form. Tablet and phone use a short introduction above the form; the photograph and supporting story are omitted at those widths. Controls retain visible focus, native keyboard behavior, and reduced-motion support.

## Form behavior

- Full name and email remain required. Role selection covers client, provider, employer, professional, investor, and multiple roles, using the existing backend values unchanged.
- Optional location, phone and role-specific interest live in a native disclosure. Switching roles preserves each interest selection for that visit.
- Contact consent is explicit and unchecked by default. No password, payout or identity details are collected.
- Inline errors and an error summary focus the first missing field. Pending submissions disable inputs and guard against duplicate submits. An interrupted request can be retried with the same email.
- Confirmation appears only after the endpoint returns successful JSON. A blocked browser-storage marker cannot turn a successful server signup into an error.
- Existing source/UTM tracking, request intent, provider service category and honeypot values are preserved. Joining does not publish a request or create an account.

## Service boundary and safe QA

The live form still posts to `/api/waitlist`. No API route, database migration, secret or Supabase configuration changed.

`/waitlist?preview=1` is a labelled design fixture: submissions never call the endpoint or write a local marker. Add `state=error` to review retry feedback, or `state=success` to view the confirmation using a reserved example address. These fixtures cannot create a waitlist entry. Normal visitors do not see preview labels.

No live Supabase record was added for design testing. Request/response tests use stub senders, verify all role payloads against the current server validator, and cover attribution, error responses, invalid JSON, interrupted requests and blocked browser storage.

## Verification

Run `node --test lib/waitlist-form.test.mjs lib/account-setup.test.mjs lib/auth-preview.test.mjs lib/home-preview.test.mjs`, `npm run lint`, and `npm run build`. Browser QA covers role selection, optional context, validation/focus, isolated confirmation/error fixtures and responsive overflow. Screenshots are local review artifacts in `output/design-previews`.

The 21st workflow guided reuse and accessibility review. Catalog search required an unavailable login, so the design extends existing project assets and controls without adding packages.

Final checks: all 43 Node tests passed; ESLint and the production build, including TypeScript and all route generation, passed. The existing parent-directory package-lock warning remains non-blocking. Browser checks covered 320px, 390px, 768px and 1280px layouts without horizontal overflow, retained role context, validation focus, and isolated success/error states. No browser console errors were observed. The deterministic UI review reported only eight advisory color-token findings; existing brand tokens are used for the core palette, with local error-state colors.
