# Frontend Implementation Roadmap

## Goal

Move from local prototypes to a connected platform in a sequence the frontend and backend teams can review together. The first usable release should support real sign-in, profile setup, request publication, provider offers and requote acceptance. Messaging and social-network features follow their own backend readiness checks.

## Delivery order

| Phase | Tickets | Exit condition |
| --- | --- | --- |
| 0 Screen and contract alignment | FE-00 | Current screens, missing states and API gaps recorded with an agreed field map |
| 1 Account foundation | FE-01, FE-02, FE-03, FE-04 | Real session, resumable setup, profile views and authenticated shell |
| 2 Marketplace | FE-05, FE-06, FE-07, FE-08 | User publishes a request, receives offers, negotiates and accepts exact terms |
| 3 Account activity | FE-09 | Notification state, preferences and support connected to real services |
| 4 Communication and social activity | FE-10, FE-11 | Messaging and enabled social interactions work against approved backend contracts |
| 5 Release verification | FE-12 | End-to-end tests, accessibility, responsive checks and release handoff pass |

FE-09 can run earlier once the notification/support APIs are verified. FE-12 checks are also performed during each ticket; the final ticket coordinates the complete journey rather than postponing all QA.

## Ticket register

| Ticket | Assignment | Backend dependency | Suggested effort |
| --- | --- | --- | --- |
| FE-00 | Audit screens and reconcile contracts | Access to current backend docs and designs | 1 to 2 days |
| FE-01 | Real authentication and API session foundation | Auth foundation and Supabase configuration | 3 to 5 days |
| FE-02 | Resumable account setup and multiple roles | Profile, role and completion APIs | 3 to 5 days |
| FE-03 | Personal and public profiles | Profile visibility and edit APIs; media gaps resolved | 3 to 4 days |
| FE-04 | Authenticated shell and home account states | Auth/profile APIs; limited home data dependency | 2 to 3 days |
| FE-05 | In-app request creation and drafts | BE-02 requests and uploads | 3 to 4 days |
| FE-06 | Request browsing, management and detail | BE-02 lists, detail, activity and cancel | 3 to 4 days |
| FE-07 | Offer creation, comparison and provider list | BE-02 offers | 3 to 4 days |
| FE-08 | Requote history and acceptance | BE-02 negotiation and acceptance | 3 to 4 days |
| FE-09 | Notifications, preferences and support | Foundation notifications/support APIs | 3 to 4 days |
| FE-10 | Contextual messaging | Next messaging backend ticket; contract pending | 4 to 6 days after readiness |
| FE-11 | Social feed, search and network actions | Separate feed/search/follow/save contracts pending | 6 to 10 days after scope split |
| FE-12 | Integrated release verification | All features enabled for the release | 2 to 3 days plus fixes |

These are planning ranges for one engineer working sequentially on each ticket, not calendar dates or a fixed team allocation. Do not add the ranges into a delivery promise before FE-00 and backend readiness are reviewed. Split FE-11 into smaller assignable tickets after its enabled features and contracts are agreed.

## What can start before APIs are ready

Build layouts, accessible components, route navigation, validation and tests against fixtures that match agreed contracts. Clearly label preview environments. A fixture-backed ticket can be marked UI ready, but cannot be marked integration complete or release complete.

Use four statuses for tracking: planned, UI ready, API connected and accepted. Record each dependency separately. A backend endpoint listed in a document is not proof that it exists or behaves as specified.

## Contract and route decisions

Use the existing frontend paths `/login`, `/create-account`, `/account-setup`, `/profile`, `/profiles/[slug]`, `/home` and `/post-a-request`. Decide redirects/aliases in FE-00 if the designs say `/sign-up`; avoid duplicate signup implementations.

Use `/api/v1` for the separate NestJS API. Normalize older authentication/profile examples that used `/v1` only after checking deployed routes. Supabase Auth owns signup, password login, recovery and refresh; do not invent duplicate password-handling NestJS endpoints.

New frontend routes proposed in this pack are `/auth/callback`, `/reset-password`, `/requests`, `/requests/[requestId]`, `/offers`, `/offers/[offerId]`, `/activity`, `/settings`, `/support`, `/messages` and `/messages/[conversationId]`. These are navigation decisions to implement, not existing-route claims.

Translate role labels explicitly: Client corresponds to requester, Professional corresponds to employee, and Provider/Employer/Investor map to provider/employer/investor. Store stable backend role IDs, not UI display strings. Role switching changes presentation and context; it never grants a permission the backend has not authorized.

## Release boundaries

The first connected milestone ends at recorded acceptance of an offer. It does not claim payment, escrow, fulfillment or identity verification. A completed profile and a verified email are separate from verified identity.

An additional social-feed milestone is required for a live LinkedIn-style stream. Social posts, follows, comments and saved posts are not delivered by the request endpoints. Keep request publication distinct from publishing a social update.

Payments, deal rooms, full identity verification, AI request assistance and dedicated hiring/investment journeys remain future roadmap items. Design their entry states honestly without manufacturing working actions.
