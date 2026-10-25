# Page brief: Authentication and onboarding

Status: draft for product review  
Audience: every new or returning Requote user

## Page story

Help a person enter Requote safely, understand what the platform needs to know, and reach a useful first experience without forcing them to choose only one permanent role.

## Goals

- Sign up, sign in, verify contact methods, and recover access.
- Establish a primary starting path while allowing later role switching.
- Collect only profile information needed to make the first action useful.
- Explain data use and consent in plain language.

## Screen sequence

1. Sign in or create account.
2. Verify email or phone according to the chosen auth provider.
3. Choose an initial path: client, provider, employer, professional, or investor/partner.
4. Capture minimum profile fields for that path.
5. Land in Home with a clear next action and completion checklist.

## Required content and controls

- Email/password or approved passwordless method.
- Full name and contact verification state.
- Path selection with a short explanation of what each path enables.
- Optional role additions and a visible role switcher after onboarding.
- Terms and privacy consent with linked policy pages.
- Password reset, verification resend, and support recovery paths.

## States

Loading, invalid credentials, duplicate email, expired verification, resend success, offline/API error, incomplete onboarding, and returning user.

## Endpoint contract to plan

- POST /api/auth/signup
- POST /api/auth/login
- POST /api/auth/logout
- POST /api/auth/recovery
- GET/PATCH /api/me
- POST /api/me/roles

Use the selected auth provider’s server-side session and avoid custom password storage.

## Acceptance criteria

- A user can complete the flow by keyboard and mobile screen reader.
- Consent is explicit and timestamped; marketing opt-in is separate.
- Choosing a path does not claim identity verification.
- Users can add/switch supported roles without duplicate accounts.
- Errors are actionable and do not disclose whether an arbitrary email exists unnecessarily.

## Decisions needed

- Supabase Auth or another provider; email, phone, or both.
- Whether phone verification is required at account creation or before a transaction.
- Minimum profile fields per path.
- Whether employer accounts require an organization record.
