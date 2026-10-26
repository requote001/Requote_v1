# Auth design batch status

Date: 24 October 2026. Branch: dev. Scope: frontend designs for the account-access portion of the roadmap.

## Inspection and decisions

The local auth, home, profile, account-setup and request-wizard sources were inspected against the roadmap. The first design batch covers login, signup, email verification, recovery, password reset and callback handoff. It reuses AuthShell, the Requote logo/mark, Hanken Grotesk and Plus Jakarta Sans, blue primary actions, navy and existing surface tokens.

The auth forms use shorter headings, compact controls and visible field errors. Role selection is deferred to account setup, consistent with the roadmap. On tablet and phone widths the form is shown immediately, rather than after a long marketing panel. Desktop retains the two-panel composition.

The current backend integrations and latest Figma screens have not been verified. This is a local implementation and visual review of the first auth design batch, not completion of the full FE-00 audit or FE-01 real-auth integration.

## Screen inventory

| Route | Implemented design states | Integration status |
| --- | --- | --- |
| /login | Default, field validation, pending submit, example service error, provider-unavailable feedback | Local preview only |
| /create-account | Default, validation, pending, consent, verification handoff | Local preview only; roles belong to setup |
| /verify-email | Pending, resend/cooldown, verified illustration, expired and error | No longer redirects to waitlist; no real emails |
| /forgot-password | Email form, validation, recovery confirmation and resend | No recovery email sent |
| /reset-password | Expired/invalid default, ready form, mismatch validation, completion | No passwords sent or saved |
| /auth/callback | Error and successful-handoff illustration | No live provider callback exchange |

Use Explore design states on each screen to inspect the alternate designs. Query parameters choose visual fixtures only and do not establish real verification or authorization. Preview actions remain explicitly labelled. The existing account-setup local preview may be reached after the verification preview; server authentication is still outstanding.

## Return navigation and privacy

All auth entry links preserve a validated local next path. Signup passes that destination through verification and setup. Protocol-relative, external, backslash and control-character paths fall back to home. The password is used only for local form validation and is never persisted or transmitted. A different preview email does not inherit another local preview account's profile data.

Provider buttons explain that the provider is not connected instead of silently fabricating a social-login account. Verification addresses are masked in confirmation copy.

## Remaining roadmap dependencies

- FE-00: inspect the latest supplied designs and confirm actual backend contracts with the engineer.
- FE-01: connect Supabase Auth and the backend identity response, real email and callback handling, server-controlled account access and session lifecycle.
- FE-02: multiple-role setup and role-specific frontend forms are now implemented as a local preview; see `13-account-setup-design-batch.md`. Server-backed drafts and completion remain outstanding.
- FE-03 onward: profiles, shell/home, requests and subsequent roadmap features remain separate implementation batches.

The 21st component search was attempted but required an unavailable login. Existing project primitives were used. Its deterministic review ran successfully with advisory color-token findings, without blocking accessibility findings. No dependency package or backend endpoint was added for these designs.

## Verification performed

- npm run lint passed.
- npm run build passed, including TypeScript and all route generation.
- The built-in Node test runner passed 12 cases covering preserved request return paths, unsafe return-path rejection and masked confirmation addresses. Command: node --experimental-strip-types --test lib/auth-preview.test.mjs.
- Browser checks at 1280px desktop, 390px mobile and 320px narrow mobile found no horizontal overflow in the inspected screens.
- Manual interaction checks covered signup validation and focus, verification resend cooldown and state navigation, recovery confirmation with a masked sample address, reset password mismatch and completion.
- Desktop login and narrow-mobile signup screenshots were saved under output/design-previews.

Design status: first auth batch ready for product review. Integration status: preview only. Neither FE-00 nor FE-01 should be marked fully accepted until the remaining backend/design checks above are complete.
