# Requote Platform Page Map

Status: planning draft  
Purpose: sequence platform work after the public landing page

## Recommended navigation

- Home
- Requests
- Messages
- Activity
- Profile

Contextual actions: post a request, switch role, save/bookmark, and view deal room.

## Page inventory

| Order | Page | Route proposal | Primary question | Depends on |
|---:|---|---|---|---|
| 1 | Auth and onboarding | /login, /create-account, /onboarding | How do I enter and set up my path? | Auth provider |
| 2 | Home/social feed | /home | What is happening in my network, and what can I act on? | User, profile, posts, requests |
| 3 | Profile | /profile, /profile/[username] | Who is this person and is there a credible fit? | User, profile, evidence |
| 4 | Requests browse | /requests | What opportunities or needs are open? | Requests, filters |
| 5 | Request detail | /requests/[requestId] | What exactly is needed and how can I respond? | Request, offers |
| 6 | Post a request | /post-a-request | How do I describe the need clearly? | Categories, draft storage |
| 7 | Offer composer | /requests/[requestId]/offer | What can I offer and on what terms? | Request, provider profile |
| 8 | Messages | /messages | What conversations need attention? | Users, requests |
| 9 | Deal room | /deals/[dealId] | What was agreed and what happens next? | Accepted offer, agreement |
| 10 | Activity/notifications | /activity | What changed and what must I act on? | Event system |
| 11 | Settings | /settings | How do I control account, privacy, and alerts? | User |
| 12 | Trust operations | /ops | What needs review or intervention? | Roles, audit trail |

## Release grouping

### Release A — usable account shell

Auth, onboarding, home, profile, settings, and empty states.

### Release B — marketplace loop

Requests browse, request detail, post request, offer composer, and messages.

### Release C — protected transaction loop

Deal room, agreement, evidence, confirmation, dispute intake, notifications, and operator review.

## Shared requirements for every page

- Define page story before UI layout.
- Identify the primary action and one safe secondary action.
- Include loading, empty, error, unauthorized, and mobile states.
- Identify endpoint contract and data ownership.
- Track meaningful events without collecting unnecessary sensitive data.
- Use Requote tokens and clear keyboard focus states.
- Never use fake activity, reviews, provider counts, or trust badges.

## Review order

1. 01-auth-onboarding-spec.md
2. 02-home-feed-spec.md
3. 03-profile-page-spec.md
4. 04-requests-and-posting-spec.md
5. 05-request-detail-and-offer-spec.md
6. 06-messages-and-deal-room-spec.md
7. 07-activity-settings-and-trust-ops-spec.md
8. 08-marketplace-intelligence-spec.md

The first page to build after approval should be Home/feed, but only after account and profile data contracts are agreed.
