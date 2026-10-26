# Requote Home Feed — Stitch/UI Generation Prompt

Copy everything inside the prompt below into Stitch or another UI-generation tool.

## Prompt

Design a production-ready authenticated Home screen for Requote, a trust-first professional network and request-and-offer marketplace launching in Nigeria.

Requote helps people describe what they need, discover relevant providers or opportunities, receive structured offers, request a Requote, agree on terms, and move toward a documented transaction. The Home page should feel like a modern LinkedIn-inspired professional activity feed, but it must not visually clone LinkedIn. Preserve Requote’s own identity, marketplace actions, trust language, and blue/navy brand system.

The Home page is not only a dashboard. It is a continuous social and marketplace feed where users can scroll through useful posts, publish updates or requests, discover people and businesses, and act on relevant opportunities.

## Product story

When a user opens Home, they should immediately understand:

1. Who they are currently using Requote as.
2. What is happening in their professional network.
3. What marketplace opportunities or requests are relevant to them.
4. What they can do next: post an update, post a request, view an opportunity, make an offer, complete their profile, or respond to an active deal.

The main product loop is:

Request → Understand → Match → Offer → Compare → Requote → Agree → Transact → Review.

AI may assist the experience, but it must appear as a helpful suggestion layer—not as the main product identity.

## Brand and visual direction

Use a calm, credible, premium-but-accessible visual language.

- Ink Navy: #12203D for text, navigation, trust surfaces, and strong contrast.
- Signal Blue: #2F5FE0 for primary buttons, links, active states, and marketplace actions.
- Sky Tint: #A9C1F5 for soft accents and selected states.
- Paper: #F6F8FC for the application background.
- White: #FFFFFF for cards and surfaces.
- Ember: #FF6A3D only for small emphasis or status accents; do not make it dominant.
- Headings: Hanken Grotesk or a similar warm, modern grotesk.
- Interface text: Plus Jakarta Sans or a similar clean sans-serif.
- Use generous whitespace, restrained shadows, 12–18px card radii, thin neutral borders, and clear visual grouping.
- Do not use excessive gradients, glassmorphism, neon colors, fake statistics, fake activity, or decorative African stereotypes.
- Make the interface feel trustworthy, useful, and alive through real content hierarchy rather than visual noise.

## Desktop frame

Create a responsive desktop frame at approximately 1440px wide with a centered application shell and a light Paper background.

Use a three-column layout:

### 1. Global top header

Create a sticky white header approximately 68–76px high.

Left side:

- Requote wordmark/logo.
- Active Home indicator.

Center:

- Search field with placeholder: “Search people, requests, opportunities…”
- Search icon.
- Keyboard shortcut hint such as “/” if space permits.

Right side:

- Create/Post button using Signal Blue.
- Messages icon with a subtle unread badge.
- Notifications bell with a subtle unread badge.
- User avatar and dropdown chevron.

The header must feel compact and professional. Use visible focus states for every control.

### 2. Left navigation rail

Create a narrow left column approximately 230–260px wide.

At the top, show a compact profile summary card:

- Circular avatar placeholder.
- User name: “Amaka Okafor”.
- Active role label: “Client · Lagos”.
- Profile completion indicator: “68% complete”.
- Small link: “Complete profile”.

Below it, create the primary navigation list:

- Home — active with a pale blue background and blue icon.
- My Network.
- Requests.
- Messages.
- Notifications.
- Profile.

Below a divider, add:

- Saved posts.
- Settings.
- Help.
- Trust & safety.

At the bottom, show an active-role switcher button labeled “Switch role”. It should open a compact menu with Client, Provider, Employer, Professional, and Investor/partner. Do not imply every role is fully enabled if it is not.

### 3. Center feed column

Make the center column approximately 620–700px wide. This is the visual focus.

At the top, show a short greeting:

“Good morning, Amaka”

Supporting line:

“Here’s what’s moving in your network.”

#### Post composer card

Create a white card with a soft border and rounded corners.

Top row:

- User avatar.
- Input-like prompt: “What are you working on?”

Bottom action row:

- Post an update.
- Post a request — primary marketplace action.
- Share an opportunity.
- Add a work sample.

The Post a request action should be visually strongest and should communicate that it opens Requote’s natural-language Request Assistant. Include a small helper line or tooltip concept: “Describe what you need in your own words.”

Below the composer, show feed tabs:

- For you — active.
- Following.
- Requests.
- Opportunities.
- My activity.

Use a clean tab underline or pill treatment, not heavy segmented controls.

#### Feed content

Design at least four realistic feed cards using believable but clearly sample content. Do not use fake platform metrics or claim real users.

Card 1 — Request post:

- Author: “Chinedu Works Ltd.” with Provider/Business label.
- Timestamp: “2h”.
- Label: “REQUEST”.
- Title: “Need a photographer for a Lagos wedding in November”.
- Summary: “300 guests · Lagos · November · Budget disclosed”.
- Short scope preview.
- Primary action: “View request”.
- Secondary action: “Make an offer”.
- Social actions: Like, Comment, Save, More.
- Use an understated blue request accent.

Card 2 — Professional update/work sample:

- Author: “Fatima Bello”.
- Label: “WORK SAMPLE”.
- Copy about completing a custom fabrication project.
- Show a tasteful landscape image placeholder with rounded corners.
- Actions: View profile, View work, Follow, Save, More.

Card 3 — Opportunity post:

- Author: “Lagos Build Collective”.
- Label: “OPPORTUNITY”.
- Title: “Looking for two experienced welders for a commercial project”.
- Show location, estimated timeline, and required capability.
- Primary action: “View opportunity”.
- Secondary action: “Express interest”.

Card 4 — Requote educational/trust post:

- Author: “Requote”.
- Label: “TRUST & SAFETY”.
- Copy: “A clear agreement protects both sides. Confirm scope, price, timing, and logistics before work begins.”
- Action: “Read trust guide”.

Each post card must use this reading order:

Author → post type → content → context → primary action → secondary actions.

Keep the content scannable. Use 16px or larger body text where content is explanatory. Avoid dense tiny text.

### 4. Right discovery rail

Create a right column approximately 280–320px wide.

Module 1 — “Complete your profile”:

- Show progress at 68%.
- Copy: “A clearer profile helps the right people understand your work.”
- Button: “Continue profile”.

Module 2 — “People to discover”:

Show 3 compact people/provider rows with avatar, name, role/category, and actions:

- Follow.
- View profile.

Module 3 — “Relevant requests”:

Show 2 compact request rows with category, location, and a “View request” link.

Module 4 — “Your next actions”:

Show one or two truthful reminders, such as:

- “You have 2 unanswered messages.”
- “An agreement is awaiting your confirmation.”
- “Complete your provider service categories.”

Module 5 — “Why Requote?”:

Short trust reminder:

“Keep the request, offer, agreement, and delivery evidence together so both sides know what was agreed.”

Link: “Trust & safety”.

Do not show fake trends, fake counts, fake testimonials, or invented provider statistics.

## Interactions and destinations

Design the following interaction states and destinations:

- Logo → Home.
- Search → search/results surface.
- Home → /home.
- My Network → /network.
- Requests → /requests.
- Messages → /messages.
- Notifications → /activity.
- Profile card → /profile.
- Post a request → /post-a-request, beginning with the Request Assistant.
- Continue profile → /profile/edit.
- View request → /requests/[requestId].
- Make an offer → /requests/[requestId]/offer.
- View opportunity → opportunity detail.
- View profile → public profile.
- Open deal room → /deals/[dealId].
- Trust & safety → /trust-safety.
- Saved posts → /saved.
- Settings → /settings.

Create hover, focus, pressed, disabled, loading, and success states for buttons and post actions. Include a More menu with Save, Not interested, Hide, Mute, Report, and Block.

Social reactions must not be confused with marketplace intent. A Like is not an offer, application, acceptance, or agreement.

## Request Assistant entry state

Also create a secondary state or modal preview for the “Post a request” action.

Show a simple assistant panel with:

- Heading: “Tell us what you need.”
- Supporting text: “Describe it naturally. Requote will organize the important details before you publish.”
- Large input placeholder: “I need a photographer for my wedding in Lagos in November…”
- Button: “Continue”.
- Secondary link: “Use the structured form instead”.
- Small privacy note: “Review every detail before your request is published.”

After the user submits text, show extracted fields as editable chips or rows:

- Category.
- Location.
- Date.
- Quantity.
- Budget.
- Requirements.

Show one missing-information question and a clear “Edit details” action. Never show the AI assistant as if it can publish without user confirmation.

## Mobile frame

Create a separate mobile frame approximately 390px wide.

- Compact sticky header with logo, notifications, messages, and avatar.
- Search opens as a full-width screen or expandable control.
- Hide the desktop left and right rails.
- Show profile completion and role in a compact horizontal card below the header.
- Keep the composer visible near the top.
- Stack feed cards in one column.
- Use a sticky bottom navigation bar with Home, Network/Requests, Post, Messages, and Profile.
- Make Post a request a prominent circular or pill button in the bottom navigation.
- Use horizontal scroll modules for People to discover and Relevant requests.
- Maintain at least 44px touch targets.
- Make comments, More menus, and action sheets mobile-friendly.

## Required states

Design these states in addition to the populated feed:

1. First-time user with an incomplete profile.
2. Empty feed with no followed people or available matching content.
3. Loading feed with skeleton cards.
4. Loading more content at the bottom.
5. Network error with a Retry button.
6. New posts available with a Refresh control.
7. Hidden, deleted, private, or restricted post.
8. Signed-out session-expired state.
9. Active role switcher open.
10. Mobile navigation open.
11. Post composer open.
12. Request Assistant extraction/review state.

## Accessibility and product constraints

- Use semantic headings and landmarks.
- Every icon button needs an accessible label.
- Provide visible keyboard focus states.
- Do not communicate status through color alone.
- Keep contrast accessible across Paper, white, navy, and blue surfaces.
- Respect prefers-reduced-motion.
- Do not create fake activity, fake reviews, fake provider counts, or unsupported verification badges.
- Make social actions visually secondary to real marketplace actions such as View request and Make an offer.
- The interface should be implementable in Next.js/React with reusable components.

## Deliverables

Produce:

1. Desktop Home feed frame.
2. Mobile Home feed frame.
3. Active role switcher state.
4. Mobile navigation-open state.
5. Post composer-open state.
6. Request Assistant entry and extracted-fields state.
7. Empty, loading, error, and restricted-content states.
8. Reusable components for Header, LeftRail, FeedTabs, PostComposer, PostCard, RightRailModule, RoleSwitcher, ActionMenu, BottomNav, and RequestAssistant.

Use clear component names and variants. Keep the design polished, calm, and highly usable. The final visual impression should be: “This is a professional network where Requote helps the right work and opportunities find the right people.”

## End prompt
