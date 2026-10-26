# FE-02 — Account setup and multiple roles

Date: 25 October 2026. Branch: dev. Status: frontend preview implemented; live integration pending.

## What is ready

The approved quiet two-column setup composition is retained, with Hanken Grotesk headings, Plus Jakarta Sans controls, blue actions and pale neutral surfaces. The existing logo and profile/feed components are reused. Mobile shows one form step with five labelled step controls, readable inputs and a visible Save & leave action.

Five steps: About you → Professional overview → Roles & details → Email status → Review.

- Essentials: display name, city/country, optional headline and optional local photo. No location is guessed. Photos accept JPG/PNG/WebP up to 500 KB; they are decoded before preview and never uploaded.
- Overview: professional focus and level; optional bio and skills; availability and discoverability are explicit choices, off by default for fresh profiles.
- Multiple roles: Client/requester, Provider, Professional/employee, Employer and Investor. A separate primary role defines the starting context. All selected branches are preserved. Deselecting a role keeps its draft for later, but only selected branches enter the completed preview profile.
- Client: service interests and optional preferred location.
- Provider: individual/business context, conditional registered business name, services, categories, delivery areas and optional experience. No payout collection.
- Professional: skills, work interests, optional working arrangement and work history. No CV upload.
- Employer: company, industry, hiring needs, optional size and overview.
- Investor: sectors and interests, optional business stages and involvement. Not an investment account.
- Email: pending and confirmed preview states, refresh, truthful resend-unavailable feedback and cooldown. Expired/error illustrations are available in isolated preview mode. There is no in-setup confirmation toggle.
- Review: complete summary with section-specific Edit controls. Required fields and email status are checked again before finishing.

## State and navigation

`/account-setup?return=/home` is the normal local-account flow. Profile editing uses `/account-setup?return=/profile`. Existing signup and verification handoffs remain supported, without nesting account-setup return routes. External and unsafe destinations are rejected; home/profile completion overrides are removed on return.

Save progress and Save & continue persist a versioned draft scoped to the preview account email. Save & leave saves before navigating. Failed writes keep entries visible and do not navigate. Reload restores the saved step and every role branch. Unsaved browser exits warn before losing changes. Partial drafts do not mark the profile complete.

Completion re-reads the latest local account and email flag, refuses account changes, writes the local profile and returns to the workspace. It never sets name verification. Home uses the stored completion flag; own profile displays saved context, roles, skills and photo, and its editing links return to setup. Role switching is limited to selected roles and changes active context, not the primary role.

All of this remains a browser-only design preview. localStorage is not a trusted session, authorization mechanism, identity signal or cross-device persistence layer.

## Safe design review

Open `/account-setup?preview=1`. This uses a reserved `.invalid` fixture address and a separate draft, without writing the current member record. The email step links to pending/verified/expired/error fixtures. `?preview=1&emailStatus=verified` illustrates a confirmed email but does not verify an account. Completing this isolated flow shows an in-page preview summary, not an authenticated workspace handoff.

Preview fixture data can be edited and saved through the UI. It is independent of the real preview account. Do not put confidential details into local design fixtures.

## Integration still required

The roadmap lists profile, role and completion contracts as unverified. No backend endpoint has been invented or added in this batch. Before FE-02 can be accepted as integrated:

1. Confirm `GET/PATCH /api/v1/profile/me`, role-specific payloads and field validation with the backend engineer.
2. Replace local drafts with server-backed partial-save/resume and concurrency/version handling.
3. Consume server-derived completion/missing fields and invoke the validated completion action.
4. Connect real session email status, resend and callback/refresh handling. Remove demo verification writes from the existing auth preview when real auth lands.
5. Agree the media upload contract before persisting or serving profile photos.
6. Enforce profile visibility, identity status and role permissions on the server. Client query parameters must never grant access.

Banking/payouts, identity checks, portfolios, CVs, real investment services and subsequent profile/network features remain separate work. FE-01 real authentication is still outstanding; this does not mark FE-01 or FE-02 fully accepted.

## Validation

Automated helper tests cover all role branches, conditional fields, multi-role preservation, primary-role fallback, account-scoped save/resume, malformed storage, save failures, fresh-account verification checks, identity preservation and raster-photo constraints. Existing auth-return and feed-state regressions are also run.

Production build, TypeScript, ESLint and deterministic UI review are checked for this batch. The 21st catalog search required a login, so no catalog component or dependency was added; existing project primitives were extended. UI review advisory color findings are inherited/complementary neutral shades, not blocking findings.

Browser review covers validation focus, multi-role save/reload, conditional business fields, email states and isolated completion. Layouts at 320px, 390px, 768px and 1280px had no horizontal overflow. Desktop/mobile evidence is saved in `output/design-previews/`.

Final verification: all 35 Node helper/regression tests passed; ESLint and the production build (including TypeScript and all route generation) passed. The build retains an existing non-blocking warning about an ignored package lock outside this Git repository. No branch push was performed.
