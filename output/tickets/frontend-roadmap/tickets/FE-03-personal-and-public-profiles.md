# FE 03 Personal and Public Profiles

Priority: P0. Owner: frontend engineer. Estimate: 3 to 4 working days. Depends on FE-02 and public/private profile contracts. Status: frontend preview implemented; API integration and acceptance pending.

Implementation record: `docs/platform/16-profile-design-batch.md` (26 October 2026). Local editing, saved preview preferences, a private/public-view adapter, fixture identity resolution, real missing-profile states and keyboard tabs are implemented. This does not mark real authentication, profile APIs, media management or release acceptance complete.

## User story

As an owner, I can view and maintain my profile. As another member, I can assess a person's experience from their public information without seeing private account details.

## Screens and arrangement

Keep `/profile` for the signed-in user and `/profiles/[slug]` for public views. Header: cover/avatar, name, headline, location, selected roles and actual verification states. Below: overview, services/skills, work samples and enabled activity tabs. Own profile shows Edit profile and Continue setup when appropriate. Public profile shows context-appropriate actions.

Resolve slug to the canonical API profile ID using an agreed backend lookup; do not invent an ID from the label. Preserve each person's identity when clicking an author in home, requests or offers. A missing profile gets a genuine not-found state rather than a fabricated recurring placeholder.

## Interactions and dependencies

Connect GET/PATCH private profile and public profile detail contracts. Edit opens a form/dialog, saves approved fields, displays success and handles conflicts/errors. Update availability and privacy through persisted server state. Copy profile link copies the actual canonical URL.

Display email and name verification separately. A name-verification action is unavailable or informational until its backend workflow exists. Follow and Message remain gated by FE-11 and FE-10. Portfolio management is gated by media create/remove contracts that FE-00 must verify; do not reuse request_attachment purpose for profile media without backend agreement.

## Deliverables

Owner and public profile data adapters, edit flow, role-aware sections, real profile linking, privacy states and responsive/accessibility checks.

## Acceptance criteria

Private email/phone/address never appear in another member's profile response or rendered view. Completion and verification come from backend facts. Editing updates the owner page and persists after reload. Slugs resolve consistently. Missing work samples show helpful add-work guidance for the owner and a quiet empty section for viewers.
