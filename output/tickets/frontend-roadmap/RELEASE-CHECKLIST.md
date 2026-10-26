# Shared Frontend Acceptance Checklist

## Every ticket

- [ ] Identify the user story, route and visible controls being delivered.
- [ ] Preserve approved minimalist design and consistent compact action styles.
- [ ] Document backend dependency status with a successful call or test evidence where connected.
- [ ] Implement loading, empty, success, validation, permission and network-error states as relevant.
- [ ] Keep entered form values when a recoverable request fails.
- [ ] Give keyboard focus and accessible names to every control.
- [ ] Check dialog focus trapping/return, Escape and outside-click behavior where appropriate.
- [ ] Verify desktop, tablet and narrow mobile layout with realistic content.
- [ ] Keep user identity, verification and permission decisions server-authoritative.
- [ ] Distinguish preview fixtures from persisted production behavior.
- [ ] Add meaningful behavior tests for the flow, without treating a no-tests pass as coverage.
- [ ] Record API/schema differences and resolve them before marking integration complete.

## Marketplace milestone demo

1. Create a real account and verify the email.
2. Save partial setup, reload and finish it with two selected roles.
3. Confirm the home setup prompts disappear after server-confirmed completion.
4. Edit the own profile and open another member's public profile.
5. Create a request draft, leave, reopen and publish it.
6. Submit offers as two different providers and compare them as the requester.
7. Request a requote, respond as provider and inspect the unchanged history.
8. Accept one exact latest revision and reload the saved terms.
9. Show a real notification and prove a competitor cannot read the private negotiation.
10. Log out, sign in as a different account and verify no private cached content carries over.

## Final handoff

Provide PR links, enabled-feature list, backend environment/version, API examples, test and production-build results, visual review notes and outstanding backend/design decisions. Record each ticket as UI ready, API connected or accepted accurately. Defer deployment until the team's release process authorizes it.
