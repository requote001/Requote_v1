# Requote Landing Page — Product and UI/UX Plan

## Context

Requote is a request-and-offer marketplace for products and services, launching in Nigeria. People explain what they need, providers submit offers, and the transaction follows a protected process: agree on the work, secure the funds, fulfill the request, confirm the outcome, and release payment or resolve a dispute.

The landing page is the public entry point. It should explain the product clearly enough for a first-time visitor to understand the value without needing marketplace knowledge.

## Logo and brand usage guidance

The supplied `requote-logo.pdf` is the current logo-system reference. It describes the mark as two diagonal rings crossing at a point of contact: one ring represents the client and the other represents the provider. The closing form also suggests a quotation mark and a successful match.

### Approved logo direction

- Use the Requote wordmark and mark as provided; do not redraw, stretch, skew, rotate, or add effects.
- Use the primary lockup on light backgrounds, especially the white/paper landing-page surfaces.
- Use the reversed lockup on the approved navy background when a dark section is needed.
- Use the stacked lockup only where the available space is compact, such as profile or small identity placements.
- Use the icon mark for the favicon, app icon, compact navigation contexts, and small supporting UI—not as a replacement for the full wordmark in the main desktop header when space permits.
- Preserve the logo’s proportions and keep sufficient clear space around it. The designer should define the final clear-space and minimum-size rules in the visual specification.
- At small sizes, prefer the simplified single-color or mark-only variants when the full-color mark loses legibility.

### Brand colors from the logo reference

- Ink Navy: `#12203D` — primary dark brand color and reversed-logo background candidate.
- Signal Blue: `#2F5FE0` — primary action and trust/product accent.
- Sky Tint: `#A9C1F5` — supporting tint, backgrounds, or secondary surfaces.
- Paper: `#F6F8FC` — soft light background.
- Ember: `#FF6A3D` — reserved accent for small highlights, status emphasis, or carefully selected moments; do not make it the dominant page color.

The designer should treat these values as the starting brand tokens. Any additional colors must support accessibility and be documented before implementation.

### Landing-page application

- The header should use the primary lockup on a light surface unless the approved design direction establishes a dark hero.
- The hero should use Signal Blue and Ink Navy as the dominant visual language, with Ember used sparingly for emphasis.
- The trust/escrow section may use the reversed lockup or mark on Ink Navy if contrast remains strong.
- Do not place the logo over busy photography, gradients, or backgrounds that reduce its silhouette.
- Do not use the Ember color as a substitute for trust/safety messaging or as a warning color without a semantic reason.
- Request the original SVG/vector logo assets before frontend implementation. The PDF is a brand reference and should not be treated as the production web asset.

## Primary objective

Convert visitors into one of two actions:

1. Post a request when they need a product or service.
2. Join as a provider when they can supply a product or service.

The page should make trust and clarity the main reasons to use Requote. It should not feel like a generic classifieds site or an empty directory.

## Primary audiences

- Requesters: people, households, businesses, and organizations looking for a reliable provider.
- Providers: artisans, tradespeople, farmers, fabricators, technicians, and digital-service professionals looking for legitimate work.
- Trust-sensitive visitors: people who need reassurance about payment, delivery, documentation, and disputes before they sign up.

## Recommended page structure

### 1. Header/navigation

- Requote logo and wordmark.
- Navigation anchors: How it works, For requesters, For providers, Trust and safety.
- Secondary action: Log in.
- Primary action: Post a request.
- Mobile navigation must collapse cleanly and keep the primary action prominent.

### 2. Hero section

Working message direction:

> Tell us what you need. Get trusted offers.

Supporting message should explain that Requote connects a person with capable providers and protects the agreed transaction through escrow.

Primary CTA: Post a request.

Secondary CTA: Become a provider.

The visual should communicate a real request becoming a protected deal. Avoid implying that Requote already has nationwide coverage, guaranteed delivery, or a large provider network unless those claims are verified.

### 3. Trust/value strip

Show the three core reasons to believe in Requote:

- Describe what you need.
- Compare offers from providers.
- Pay through a protected process.

This should be scannable and should not use unsupported statistics.

### 4. How Requote works

Use a simple six-step transaction explanation:

1. Post a request.
2. Receive offers.
3. Choose a provider.
4. Secure payment in escrow.
5. Receive the product or service.
6. Confirm delivery, release payment, or open a dispute.

The UI should make the deal phases feel understandable and trackable.

### 5. Requester section

Explain the requester journey in plain language:

- Describe the product or service, specifications, quantity, location, and optional budget.
- Review provider offers.
- Agree on the scope, price, timeline, and logistics.
- Keep funds protected until the agreed outcome is confirmed.

CTA: Post your first request.

### 6. Provider section

Explain the provider journey:

- Create a profile and show relevant skills or work.
- Find requests that match the provider’s capabilities.
- Submit a clear offer.
- Complete the agreed work and receive payment after confirmation.

CTA: Join as a provider.

### 7. Trust, escrow, and disputes

This is the most important differentiator and should receive substantial visual emphasis.

Explain that escrow protects the documented agreement, not subjective buyer preference. The section should introduce:

- Identity and provider verification as the product matures.
- Funds held until the agreed delivery is confirmed.
- Evidence-based dispute review using the request, offer, messages, and delivery evidence.
- Possible outcomes such as completion, correction, partial release, refund, or renegotiation depending on the facts.

Avoid promising guaranteed refunds or presenting unresolved policy decisions as final policy.

### 8. Categories/use cases

Use representative categories from the roadmap:

- Agriculture.
- Welding and fabrication.
- Skilled trades.
- Technology and digital services.

The design should support more categories later without making the first launch feel overly broad.

### 9. Logistics explanation

Explain that the parties may use Requote logistics where available or agree on their own logistics arrangement. This should be clear but visually secondary to the core transaction flow.

### 10. FAQ

Initial questions:

- What is Requote?
- How does escrow work?
- What happens if the delivery is not what was agreed?
- Can I be both a requester and a provider?
- Who can become a provider?
- Does Requote provide delivery?
- What fees apply?

Questions whose answers are not yet decided should use carefully worded “coming soon” or “policy to be announced” language rather than invented details.

### 11. Final CTA

Reinforce the core promise with two paths:

- Need something? Post a request.
- Can provide something? Join Requote.

### 12. Footer

- Requote identity and short description.
- Product links.
- Trust and safety.
- Help/contact.
- Terms, privacy, and legal links when available.
- Social links only when official accounts exist.

## UX requirements

- A first-time visitor should understand Requote within the first viewport.
- The two primary user paths must remain visible throughout the page.
- Trust language must be specific and calm, not exaggerated.
- Do not use fake testimonials, fake provider counts, fake transaction metrics, or unsupported guarantees.
- Every CTA must have an intentional destination, even if the destination is initially a placeholder route.
- The page must be accessible by keyboard, use semantic headings, provide visible focus states, and maintain readable contrast.
- Mobile design is a first-class layout, not a compressed desktop page.
- The design must allow future localization and African-market expansion without depending on one city or category.

## Initial interaction scope

For the first landing-page build:

- Navigation links scroll to page sections.
- “Post a request” routes to the future request-entry flow or a temporary onboarding screen.
- “Become a provider” routes to provider onboarding or a temporary interest form.
- FAQ items expand and collapse.
- No live marketplace search, payments, escrow, provider matching, or account APIs are required by the landing page itself.

## Future endpoint implications

The landing page should not block on backend implementation. The first related backend contracts will likely be:

- `POST /auth/register` for requester/provider onboarding.
- `POST /requests` for the first request-entry flow.
- `POST /provider-interest` if provider onboarding begins as a waitlist or manual verification process.

These endpoints belong to later flow work and should not be invented or implemented as part of the static landing-page task.

## UI/UX designer task

### Task title

Design the Requote public landing page and responsive first-visit experience.

### Brief

Design a trustworthy, modern Nigerian marketplace landing page for Requote. The page must explain the request-and-offer model, show how escrow protects the agreement, serve both requesters and providers, and guide visitors toward posting a request or joining as a provider.

### Deliverables

- Desktop landing-page design.
- Mobile landing-page design.
- Header, navigation, buttons, cards, step indicators, FAQ accordion, and footer components.
- States for hover, focus, expanded FAQ, and mobile navigation.
- A compact visual direction covering typography, colors, spacing, icon style, imagery, and trust-related visual treatment.
- Notes identifying which copy is final, suggested, or dependent on a future business decision.

### Design constraints

- Do not imply features, coverage, statistics, fees, or guarantees that have not been approved.
- Prioritize clarity over visual complexity.
- The page should feel local and credible without relying on stereotypes or decorative “African” motifs.
- Design for extensibility as categories, cities, and countries expand.
- Keep the core action obvious: post a request or become a provider.

### Acceptance criteria

- The page has a clear first-viewport value proposition.
- Both user journeys are understandable without explanation.
- Escrow and dispute handling are explained accurately and responsibly.
- The complete page hierarchy is represented at desktop and mobile widths.
- All important interaction states are specified.
- The design can be implemented in the current React/Vite project without requiring an unapproved component framework.

## Decisions to confirm before visual design is locked

- First pilot city and initial category, if the landing page should name them.
- Requote logo, brand colors, and preferred tone of voice.
- Whether authentication begins with one account that supports both roles.
- Whether the initial provider CTA is open registration or a provider waitlist.
- Approved wording for escrow, refunds, disputes, verification, and logistics.
