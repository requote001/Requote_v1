# FE 00 Screen and Contract Audit

Priority: P0. Owner: frontend engineer. Estimate: 1 to 2 working days. Dependency: access to current designs, local frontend and backend API documentation. Status: planned.

## User story

As the product team, we need one agreed mapping between visible screens, the intended story and real backend behavior so engineers do not build incompatible flows.

## Scope and arrangement

Walk through login, signup, verification, account setup, home, own/public profiles and the in-app request wizard on desktop and mobile. Compare the running UI with the latest supplied design. Record the actual route, form fields, primary/secondary actions, loading state and failure state for each screen.

Inspect backend evidence separately: endpoint documentation, successful development calls and relevant test results. Mark endpoints as verified, documented only, missing or conflicting. Include exact field and enum differences.

## Interactions and decisions

Trace landing to login/signup, verified and unverified sessions, incomplete and completed profiles, profile menu navigation, request draft save and publish. Confirm that Post a request from inside the platform returns to the platform rather than the waitlist.

Resolve known differences: single-role UI versus multiple-role model; Client/Professional versus requester/employee; prototype description/specifications versus outcome/scope; category labels versus category IDs; state/city versus country/city/private address; budget strings versus integer kobo; attachment names versus completed upload IDs.

## Deliverables

- Screen inventory with current, missing and proposed routes.
- Screen/action/API matrix with example payloads and required response fields.
- Agreed role mapping, profile completion requirements, signup return paths and request field adapter.
- Visual discrepancy list tied to specific screens and states, with design references where available.
- Refined implementation estimates and backend blockers for every following ticket.

## Acceptance criteria

Each visible action has a route, an API, or an explicitly unavailable state. Product and backend owners resolve conflicting required fields and route prefixes. The inventory distinguishes screens inspected visually from code-only inspection. No endpoint is marked available solely because it appears in a ticket.
