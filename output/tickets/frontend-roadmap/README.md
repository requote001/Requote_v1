# Requote Frontend Roadmap

This pack turns the existing Requote screen stories and local prototypes into assignable frontend implementation tickets. The roadmap follows the backend foundation and BE-02 requests, offers and requote work.

Start with `ROADMAP.md`, then complete `tickets/FE-00-screen-and-contract-audit.md` before committing delivery dates. Each ticket includes the user story, routes, layout, interactions, backend dependencies, deliverables and acceptance criteria. `SCREEN-API-MAP.md` links the page actions to API dependencies; `RELEASE-CHECKLIST.md` defines shared quality checks.

The Word document contains the full roadmap and tickets. The ZIP beside this folder includes all editable Markdown files and the Word copy. Assign these tickets to the frontend team in dependency order. Estimates describe one engineer's implementation effort and must be refined after FE-00; they are not promised dates.

## Evidence and current status

Planning snapshot: 18 October 2026. Existing screen source, route files, page stories and the BE-02 contract were inspected. The latest Figma designs and deployed pages have not received a fresh visual walkthrough. FE-00 explicitly owns that reconciliation.

The local checkout contains mocked signup/login, locally saved account setup with simulated email confirmation, prototype home and profile pages, and a request wizard with preview behavior. `/verify-email` currently redirects to the waitlist. A working preview screen does not prove the corresponding backend feature exists.

This pack specifies future implementation. It does not modify the frontend application, verify the engineer's latest backend work, or claim the listed APIs are deployed. The frontend repository remains separate from `Requote_v1_Backend`.

## Design direction

Preserve the approved Requote visual direction: minimalist layouts, restrained blue accents, rounded professional typography, compact consistent action buttons and generous but purposeful spacing. Improve states and interactions using existing components. Large visual redesigns need a concrete design review under FE-00 rather than silently replacing the approved screens.
