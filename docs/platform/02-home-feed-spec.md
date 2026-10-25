# Page brief: Home and social activity feed

Status: revised draft for product review  
Route proposal: /home

## Product direction

Home should feel like a LinkedIn-inspired professional network feed: a user opens Requote, sees a continuous stream of useful posts, can publish an update or request, and can discover people, work, opportunities, and marketplace activity by scrolling.

This is a product pattern reference, not a visual copy of LinkedIn. Requote must preserve its own request-and-offer model, trust language, and documented-deal actions.

## Page story

Home is where the Requote network feels alive. It should answer:

- What is happening in my network?
- What opportunities or needs are relevant to me?
- What can I post or act on today?

The page should not be only a dashboard of the user’s own work. It is a personalized stream with marketplace actions built into the feed.

## Complete user story

### 1. Arrival

After sign-in, the user lands on Home. The header immediately shows the Requote logo, Home as the active destination, search, notifications, messages, and the user’s avatar. The page remembers the user’s active role and shows a small role label so the user understands why the feed looks the way it does.

If onboarding is incomplete, the first message is a useful profile-completion prompt rather than a blocking wall. The user can continue to browse, but important actions may ask them to finish the required profile fields.

### 2. Orientation

The user sees three things before scrolling:

1. Their identity and navigation on the left.
2. The composer and first feed items in the center.
3. Suggestions, reminders, or relevant actions on the right.

The page should make it obvious that Requote is both a professional network and a structured request-and-offer marketplace. A user can discover content socially, but formal work always moves through a request, offer, agreement, and deal flow.

### 3. Posting something

The user selects **Post an update**, **Post a request**, **Share an opportunity**, or **Add a work sample** from the composer.

- **Post an update** opens a lightweight post editor for text, approved media, category, visibility, and optional link to a profile or project.
- **Post a request** opens the Request Assistant at `/post-a-request`; the user can describe the need naturally, review extracted fields, answer missing questions, and fall back to the structured wizard.
- **Share an opportunity** opens an opportunity form for an employer or approved provider; if this feature is not enabled yet, the button leads to a clear “coming soon” or interest state.
- **Add a work sample** opens the profile/portfolio editor and lets the user publish the finished sample to the feed if they choose.

After publishing, the user sees a success state with **View post**, **Edit post**, and **Return to feed**. Publishing a social post must not be presented as publishing a formal marketplace request.

### 4. Scrolling and discovery

The user scrolls through a continuous feed. Each card gives enough context to decide whether to keep reading:

- who posted it and their active role;
- what type of post it is;
- when it was posted;
- the content or request summary;
- why it may be relevant, where appropriate;
- the next useful action.

When the user reaches the end of loaded content, the feed fetches the next page. The interface shows a loading boundary and never duplicates posts. If there is no more content, it shows a quiet end-of-feed message and suggestions for what to follow or do next.

### 5. Acting on a post

The user can open the post destination, react, comment, save, share, follow, or report depending on the post type and permissions.

The primary action changes by content:

- Request: **View request**, **Ask a question**, or **Make an offer**.
- Opportunity: **View opportunity**, **Apply/Express interest**, or **Contact through Requote** where approved.
- Work sample: **View profile**, **View work**, or **Follow**.
- Deal update: **Open deal room** or **Take action**.
- Educational/trust post: **Read more** or **Open Trust & safety**.

The user can open **More** on any card for Save, Not interested, Hide this post, Mute author, Report, or Block. Destructive or moderation actions require confirmation and provide a completion state.

### 6. Moving somewhere else

The Home page must provide these clear destinations:

| Visible control | Destination | Purpose |
|---|---|---|
| Logo | `/home` | Return to Home |
| Search | Search/results surface | Find people, requests, categories, or opportunities |
| Home | `/home` | Return to the feed |
| My network | `/network` | Followed people, providers, categories, and organizations |
| Requests | `/requests` | Browse and manage marketplace requests |
| Messages | `/messages` | View conversations and deal-related messages |
| Notifications | `/activity` | Review changes and actions needed |
| Profile card | `/profile` | View or complete the current profile |
| Post a request | `/post-a-request` | Start a structured request |
| Saved posts | `/saved` | Revisit saved posts and requests |
| Settings | `/settings` | Manage account, privacy, roles, and notifications |
| Trust & safety | `/trust-safety` | Understand agreements, evidence, and disputes |

Links to `/network`, `/saved`, or other future routes must have a planned empty state until those pages are implemented; they must not lead to broken routes.

### 7. Returning to Home

When the user returns, Home should preserve their active role, selected feed tab, and reasonable scroll position when technically possible. The user should see new content marked clearly, without losing their place. A **Refresh** control may appear when new posts are available.

### 8. Signing out or losing access

If the session expires, the user sees a clear sign-in prompt and the public parts of a post are not exposed accidentally. If a post or profile is deleted, private, blocked, or restricted, the card explains that the content is unavailable without leaking its details.

## User-visible control inventory

### Header controls

- Logo/home link.
- Search input or search button.
- Create/post button.
- Messages button with unread count.
- Notifications button with unread count.
- Active-role switcher.
- Avatar menu with Profile, Settings, Help, and Sign out.

### Feed controls

- Feed tabs.
- Composer buttons.
- Refresh/new-posts control.
- Post destination link.
- Reaction button and count when counts are real.
- Comment button and count when comments are enabled.
- Share/repost button when enabled.
- Save button.
- More menu.
- Load more or infinite-scroll boundary.

### Right-rail controls

- Follow/Unfollow person, provider, category, or organization.
- View profile.
- View request/opportunity.
- Dismiss suggestion.
- See all suggestions.
- Continue profile completion.
- Open deal/action reminder.

Every button needs a visible focus state, a disabled/loading state where applicable, and a success or error response after the action.

## Role-specific first screen

The same Home shell is used for every role, but the first prominent action changes:

- Client: **Post a request** or review received offers.
- Provider: **Browse requests** or complete the provider profile.
- Employer: **Share an opportunity** or create a hiring/project brief.
- Professional: **Complete your profile** or explore opportunities.
- Investor/partner: **Explore Requote updates** or submit partnership interest.

The user can switch roles without losing the feed state. Switching roles changes recommendations and primary actions; it does not create a second account.

## Post card story by type

Every card follows the same reading order: author → post type → content → context → primary action → secondary actions.

### Request card

The user sees what is needed, category, location, timing, budget visibility, and a short scope. A provider can select **View request** or **Make an offer**. A client sees **Manage request** or **View offers** for their own request.

### Opportunity card

The user sees who is seeking talent or support, the opportunity type, location/remote context, requirements, and deadline where available. The action is **View opportunity** or **Express interest**, never an unstructured public commitment.

### Professional update or work sample

The user sees the author’s role, capability context, text/media, category, and profile link. The actions are **View profile**, **View work**, **Follow**, Save, and permitted social interactions.

### Deal update

Only involved parties see private deal information. The card shows a safe summary, current phase, and **Open deal room** or **Take action**. Payment, dispute, and evidence details remain permission-controlled.

## What Home must not do

- It must not pretend to be populated with fake posts or engagement.
- It must not make a like equal an offer, application, agreement, or transaction.
- It must not expose private contact, payment, identity, or dispute information.
- It must not send users to routes that do not have a designed state.
- It must not claim that a person is verified, trusted, recommended, or matched without a defined source and policy.

## Desktop layout

Use a three-column authenticated shell:

### Left rail — identity and navigation

- Compact profile card with avatar, name, active role, location, and profile-completion progress.
- Primary links: Home, My network, Requests, Messages, Notifications, Profile.
- Role switcher: Client, Provider, Employer, Professional, or Investor/partner where enabled.
- Secondary links: Saved posts, Settings, Help, and Trust & safety.
- The left rail becomes a bottom/mobile navigation bar on small screens.

### Center column — scrolling feed

- Post composer at the top: “What are you working on?” with actions for Post an update, Post a request, Share an opportunity, or Add a work sample.
- Feed tabs: For you, Following, Requests, Opportunities, and My activity.
- Infinite or cursor-based scrolling with clear loading boundaries.
- One post per card with author header, timestamp, role/context label, body, media or request summary, and actions.
- Keep Post a request easy to reach on desktop and mobile.

### Right rail — discovery and context

- People or providers to discover, based on approved matching signals.
- Suggested requests or opportunities.
- Trending categories only when based on real data; otherwise omit.
- Upcoming actions: unanswered offer, agreement awaiting confirmation, evidence requested, or profile completion.
- Compact Requote trust reminder linking to Trust & safety.

On tablet, collapse the right rail first. On mobile, move discovery modules below the feed or expose them through horizontal sections.

## Feed post types

The feed should support distinct, labelled post types instead of one generic social post:

1. **Request post:** a client or employer describes a need and can receive offers.
2. **Opportunity post:** a provider or employer shares a legitimate work opportunity.
3. **Professional update:** a user shares work, progress, a project, or a capability.
4. **Work sample:** a profile-linked portfolio item or completed work evidence.
5. **Deal update:** a permission-safe status update from a request/deal the user is involved in.
6. **Educational/trust post:** Requote guidance about clear briefs, agreements, safety, or disputes.

Every post must display its type and destination. A request post should make the action “View request” or “Make an offer,” not only “Like.”

## Post card interactions

- Like or acknowledge, only if approved as a useful signal.
- Comment or ask a public question where appropriate.
- Share/repost with attribution if approved.
- Save/bookmark.
- Follow a person, provider, category, or organization where supported.
- Report post, hide post, mute author, and block user according to moderation policy.
- Open the full request, profile, deal, or work sample.

Reactions must never replace structured marketplace actions. A provider responds to a request through an offer flow; a like does not count as interest or acceptance.

## Role-aware feed behavior

### Client/requester

Prioritize relevant providers, useful work samples, own request activity, received offers, and deal updates.

### Provider

Prioritize relevant client requests, category/location opportunities, provider education, saved requests, own offer activity, and work-sample visibility.

### Employer

Prioritize professional/talent posts, project opportunities, employer updates, and the shared request primitive for hiring/project briefs.

### Professional

Prioritize relevant opportunities, employer posts, work samples, professional updates, and profile-completion prompts.

### Investor/partner

Prioritize approved ecosystem updates, company/product progress, partnership interest, and investor information. Do not mix private marketplace or user deal data into this feed.

## Feed ranking and safety rules

- Start with a transparent, deterministic order: followed content, relevant recent content, and sponsored/featured content only if explicitly introduced and labelled.
- Do not infer sensitive attributes for targeting.
- Explain why a recommendation appears where practical: category, location, role, or followed person.
- Do not fabricate engagement counts, provider counts, reviews, or activity.
- Respect blocked, muted, private, closed, expired, and deleted content.
- Permission-check every post server-side; feed filtering is not a security boundary.
- Keep private messages, phone numbers, payment data, and dispute evidence out of public cards.

## Empty and first-use experience

If the network is new or the user follows nobody:

- Show a helpful empty state, not a fake feed.
- Offer three actions: complete profile, follow categories/people, and browse approved request surfaces when available.
- Show Requote-authored educational posts only if they actually exist in the database.
- Explain how to create the first post or request.

## Responsive behavior

- Mobile begins with a compact header, active-role indicator, notification icon, and primary post button.
- Stack the composer and feed cards in one column.
- Use a bottom navigation bar with Home, Network/Requests, Post, Messages, and Profile.
- Make media responsive and keep all touch targets at least 44px.
- Preserve post context when opening comments or the full request.

## States

First-time empty feed, no matching content, loading skeleton, pagination/loading-more, stale content, network error with retry, deleted/hidden post, signed-out redirect, account/profile incomplete, and restricted/private content.

## Endpoint contract to plan

- GET /api/home/feed?tab=for-you&cursor=...
- GET /api/home/suggestions?type=people|requests|opportunities
- GET /api/home/matches?cursor=...
- POST /api/posts
- GET /api/posts/{postId}
- POST /api/posts/{postId}/reactions
- POST /api/posts/{postId}/comments
- POST /api/posts/{postId}/save
- POST /api/posts/{postId}/report
- POST /api/follows
- PATCH /api/me/active-role

Request-specific actions remain separate:

- GET /api/requests?status=open&category=...&location=...
- POST /api/requests/{requestId}/offers

Use cursor pagination, stable ordering, idempotent reaction/save actions, and server-side authorization.

## Acceptance criteria

- Home is a genuine scrollable feed with useful post cards, not only a dashboard.
- The composer makes posting an update, request, opportunity, or work sample understandable.
- Users can distinguish social engagement from formal marketplace actions.
- The layout works as three columns on desktop, two/one column at smaller widths, and bottom navigation on mobile.
- Empty states are truthful and still give the user a next step.
- Every card has an accessible author, content type, timestamp, destination, and keyboard-reachable actions.

## Decisions needed

- Which post types are enabled for the first authenticated release.
- Whether comments, reactions, reposts, and follows launch together or in stages.
- Whether My network is a people graph, category follows, or both.
- Initial ranking signals and moderation ownership.
- Whether employers/professionals use the same post model as clients/providers.
