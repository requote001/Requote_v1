# FE-03 — Personal and public profiles

Date: 26 October 2026. Branch: dev. Status: frontend preview implemented; live integration and visual acceptance pending.

## Where this fits

The frontend roadmap places FE-03 after account setup (FE-02), followed by the authenticated shell (FE-04), request creation/drafts (FE-05), request browsing/detail (FE-06), offers/comparison (FE-07), and requote/acceptance (FE-08). Account activity, messaging, and the live social layer follow their own API readiness checks. Existing screens do not establish that any of those backend contracts are connected.

The auth and account-setup previews already exist. Real authentication, server-backed profile persistence, and API acceptance remain outstanding; this batch does not skip or mark those integration dependencies complete.

## Page story

The owner opens `/profile` to review their professional context, roles, visibility and availability. Incomplete accounts keep their existing Continue setup handoff. Completed accounts can edit core details in a native modal without repeating onboarding. The quiet existing typography, two-column layout, compact controls and blue/neutral palette are retained.

The editor covers display name, headline, city/country, professional focus, overview and skills. Name, location and focus are required. Field limits match setup. Invalid submission focuses the first issue. Cancel/Escape asks before discarding unsaved changes; browser exits also warn. Failed storage writes retain the inputs and never show success. A changed account or concurrent profile edit blocks stale saves. The modal returns focus to its opener and restores body scroll when closed.

Availability and visibility changes persist in the existing local account record and survive reload. Role switching is limited to selected roles, preserves the primary role, and writes before changing the visible state. Storage events refresh the page when another tab changes the account. None of these local controls are authentication, authorization or server-enforced privacy.

Per-field edit timestamps keep newer saved profile details/preferences from being reverted when an older setup draft resumes. The merge preserves unfinished role details and respects a subsequently newer draft; it never changes completion or verification. This is local preview coordination, not a substitute for server-side version handling.

## Public view and privacy

`/profile?view=public` previews the current browser member using an explicit public-field adapter. It is not a public URL for sharing with another person. When visibility is off, it shows a private-profile state without identity details. When on, it shows the name, headline, location, overview, skills, availability and selected role context only. Private email/contact fields, setup drafts, unselected role branches, account/session facts and verification flags are excluded. A hidden registered-business name is excluded for independent providers. The preview contains no editing or account controls.

The owner's overview includes context for each selected role. Role changes and professional-level editing still use the approved setup screen. Work-sample uploads, payouts, identity checks and investment transactions are not implemented here.

## Other members

`/profiles/[slug]` resolves an explicitly known fixture rather than deriving a supposed identity from arbitrary text. All three feed authors and the three discovery-panel members have identity-preserving fixtures. Discovery fixtures have no invented work history. Unknown, inherited-object and missing slugs return the route's profile-not-found state.

All fixture profiles clearly identify sample data. Copy profile link copies that fixture's actual route at the current origin and reports clipboard failures. Work samples open an accessible detail modal with sample-context disclosures. Follow/Message are marked unavailable and explain their integration boundary instead of claiming a relationship or message was created. No follow, messaging or media API has been invented.

Profile tabs support Arrow Left/Right, Home/End, selected tab state and roving keyboard focus. Public and owner content panels have labelled tabpanel relationships.

## Integration gates still open

1. Confirm private/public profile lookup, immutable ID-to-slug mapping and field visibility contracts with the separate backend team.
2. Connect the real session and GET/PATCH `/api/v1/profile/me` contracts. Public lookup is still an unverified contract; fixture slugs are not production IDs.
3. Replace local saving with backend validation and concurrency/version handling. Consume completion and verification from backend facts, not query parameters or browser storage.
4. Agree media upload/create/remove contracts before implementing portfolios. Request-attachment uploads must not be repurposed for profile media.
5. Connect following and messaging only in their dedicated FE-11/FE-10 milestones. Keep unavailable actions truthful until then.

The `preview=1&verification=verified` name-badge illustration remains explicitly a fixture, never an identity verification operation. Plain query parameters cannot persist verification.

## Verification and handoff

Helper regressions cover allowlisted edits, required/length validation, persistence, storage failure, changed accounts, concurrent edits, private/public projection, role privacy, missing profiles and keyboard tab order. Component tests cover editor validation/save, discard protection, failed writes, stale edits, private/public output and keyboard focus.

Validation commands: `npm run test:helpers`, `npm run test:profile-ui`, `npm test` (helpers plus component coverage/JUnit), `npm run lint`, `npm run build`, and the deterministic 21st UI review. The profile-specific Vitest config excludes Node-native helper tests from Vitest discovery; helpers run with their own runner. Results are reported in the task handoff; a command listed here is not by itself a passing result.

The 21st UI build workflow guided reuse of the existing profile cards, type, compact controls and native-dialog approach. The catalog required an unavailable login; no catalog component or feature dependency was added.

Final automated results: 68 Node helper/regression tests and 7 jsdom component tests pass (75 total). ESLint and the production Next.js build, including TypeScript and route generation, pass. Deterministic UI review reports only an informational backdrop-color advisory. The existing ignored parent-directory package-lock build warning remains. Vitest/jsdom/coverage dependencies were already declared but missing locally; the lockfile was reconciled with that declaration without changing any existing locked package version. Generated test reports are ignored. Component coverage is not an end-to-end or whole-product quality guarantee.

Browser access was previously rejected by the app's security policy. No alternate browser or indirect live-page inspection was used. Actual desktop/mobile visual QA, native focus trapping, scroll locking and perceived layout quality still need acceptance in the live browser. jsdom tests are component checks, not that visual review.

No backend repository, live database, deployment or remote branch is changed by this local batch.
