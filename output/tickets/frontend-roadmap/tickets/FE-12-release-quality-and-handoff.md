# FE 12 Integrated Release Quality and Handoff

Priority: P0 release gate. Owner: frontend engineer with project review. Estimate: 2 to 3 working days plus fixes discovered. Depends on all tickets included in the selected release milestone. Status: planned.

## User story

As a member, I can complete the enabled platform journeys across desktop and mobile with clear feedback when an action is unavailable or fails.

## Scope

Verify real signup/verification/login, incomplete and completed setup, own/public profile, request draft resume/publish, provider offer, requester requote and exact-revision acceptance. Include notifications, support, messaging and social actions only if their milestones are enabled and connected.

Test keyboard navigation, focus restoration in dialogs/menus, labels, error announcements, colour contrast, reduced motion and layout at narrow mobile, tablet and desktop widths. Compact text buttons still need usable touch targets. Check long names, long titles, missing images, large amounts and long histories.

Test direct links, reload, logout/login as a different user, expired sessions, slow/offline responses, double submit, stale drafts and concurrent backend changes. Keep public-site and authenticated navigation correct. Clear account-specific caches on logout.

Run Next.js production build as well as lint and meaningful tests. Any route using useSearchParams must have the appropriate Suspense boundary and be checked through the production build. Confirm private pages are excluded from public indexing and user-specific data is not shared across sessions through caching.

## Deliverables

End-to-end test evidence, responsive/accessibility review, production build result, environment setup notes, release scope matrix, known-issue list and an implementation demo. Document which backend version/environment was used and which features remain gated.

## Acceptance criteria

The enabled release completes against actual services, not preview fixtures. No broken core buttons, false verification or local-only publication remains. Failing tests and material accessibility defects are resolved or explicitly removed from release scope by the project lead. The handoff differentiates completed integration from UI-ready future tickets.
