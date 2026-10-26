# Page brief: User profile

Status: draft for product review  
Route proposal: /profile and /profile/[username]

## Page story

Profiles help people understand who they may work with and whether the person’s stated experience fits the request. The profile must distinguish self-reported information from evidence and verified facts.

## Goals

- Let account owners build role-specific profiles.
- Help clients assess provider fit; help providers present capability.
- Support employer and professional profiles without pretending their workflows are already live.
- Make privacy and visibility understandable.

## Profile sections

- Name, profile photo/avatar, location, and short introduction.
- Active roles and profile completeness.
- Provider: skills, categories, services, service area, availability, portfolio/evidence, preferred work.
- Client: optional organization/context and prior public requests only if explicitly enabled.
- Employer: organization and hiring/project needs when supported.
- Professional: skills, experience summary, work interests, availability, and portfolio.
- Trust panel: verification status only when backed by a real verification source; otherwise show “not verified” or omit.
- Public/private visibility controls and profile preview.

## Actions

Edit profile, add work sample, update availability, change visibility, copy profile link, report profile, and contact only through an allowed Requote context.

## States

New profile, incomplete profile, public profile, private profile, missing portfolio, verification pending/failed (only if integration exists), and profile not found.

## Endpoint contract to plan

- GET /api/profiles/{profileId}
- PATCH /api/me/profile
- POST /api/me/profile/media (signed upload flow)
- DELETE /api/me/profile/media/{mediaId}
- PATCH /api/me/profile/visibility

## Acceptance criteria

- Users control what is public; private contact details are never exposed by default.
- Every trust claim has a source and status.
- Media upload validates type/size and supports removal.
- Profile editing works on mobile and preserves unsaved work warnings.

## Decisions needed

- Public profile URL and discoverability policy.
- Which fields are public by default.
- Portfolio limits, supported media, and moderation rules.
- Whether reviews launch in MVP or remain out of scope.
