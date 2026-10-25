# FE 01 Authentication and API Session Foundation

Priority: P0. Owner: frontend engineer. Estimate: 3 to 5 working days. Depends on FE-00 and verified Supabase/Auth configuration. Status: planned.

## User story

As a new or returning member, I can create an account, verify my email, sign in, recover access and return to the page I intended to use.

## Screens and layout

Retain the approved auth shell and login/create-account switch. Routes are `/login`, `/create-account`, `/forgot-password`, `/reset-password`, `/verify-email` and `/auth/callback`. Use clear labels, one primary submit action, relevant recovery links and inline validation. Keep terms/privacy links visible during signup. Enable social sign-in only for configured providers.

## Interactions and API dependencies

Replace local mock authentication with Supabase signup, sign-in, verification callback, resend, recovery and logout. Passwords go only through the auth provider. Use the Supabase session to call the NestJS `/api/v1/auth/me` contract after confirming the actual route and response in FE-00.

Signup leads to the verification state; the verification screen must stop redirecting to the waitlist. Show masked email, resend with cooldown, pending/expired/invalid link states and recovery help. After verification, continue setup or the validated intended route. Recovery links open the dedicated reset page and produce real success/failure states.

Create a shared API client with configurable backend URL, normalized errors, abort support and authenticated requests. Refresh expired access safely once; stop loops on failure. Validate return URLs as local allowed destinations. Enforce authentication in server-controlled routes or data access as well as navigation; browser state is not authorization.

## Deliverables

Connected auth pages, session-aware API adapter, authenticated route boundary, real logout, field error mapping and meaningful auth-flow tests. Preserve the existing production waitlist entry policy; agree where signup is enabled rather than globally switching the public site during development.

## Acceptance criteria

An actual development account can sign up, verify and log in. Reload preserves a valid session. Invalid/expired credentials show useful errors. Email verification comes from Supabase state, not a local toggle. Logout clears account-scoped caches and protects private routes. Forged localStorage and URL parameters cannot grant account access. No service-role secret enters the browser bundle.
