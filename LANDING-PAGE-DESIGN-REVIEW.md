# Requote Landing Page — Design Review and Corrections

## Review status

This review is based on the current `Page 1 / Desktop view` structure and visible copy in the linked Requote Figma file. The original designer work should be preserved. These are corrections and improvement instructions, not a request to discard the whole direction.

## Overall assessment

The page has a strong foundation: it understands the two-sided marketplace, communicates trust, includes the requester/provider split, and presents the six-step transaction flow. The main work needed is refinement and production readiness:

- Make the hero promise sharper and more specific.
- Improve hierarchy and reduce small, dense copy.
- Standardize the brand system across every section.
- Treat the page as a responsive product surface, not only a desktop canvas.
- Convert repeated visual patterns into reusable components.
- Add the missing states and page sections required for a complete public landing page.

## Priority corrections

### P0 — Must correct before implementation

#### 1. Replace the hero headline

Current direction:

> Connect with trusted providers and get things done, safely.

Recommended direction:

> Tell us what you need. Get trusted offers.

Supporting copy:

> Describe a product or service, compare offers from capable providers, and keep the agreed transaction protected from payment through delivery.

Reason: the current headline is safe but generic. The recommended version explains Requote’s request-and-offer model immediately and gives the visitor a clear reason to continue.

#### 2. Strengthen the hero visual hierarchy

- The headline should be the dominant object in the first viewport.
- Keep the supporting paragraph to approximately two or three readable lines on desktop.
- Make `Post a request` the primary button.
- Keep `Become a provider` as the secondary button.
- Use consistent capitalization and button sizing.
- Ensure the hero artwork does not compete with the headline or become a decorative placeholder.

#### 3. Create a real mobile design

The inspected file contains a `Desktop view`, but the landing page also needs a complete mobile frame before development begins.

Define at minimum:

- Mobile header and menu-open state.
- Mobile hero layout.
- Stacked CTAs.
- Single-column requester/provider sections.
- Horizontal or vertical treatment for the six-step process.
- Mobile FAQ accordion.
- Mobile footer.

Do not leave responsive behavior for developers to infer.

#### 4. Use the real Requote logo asset

The logo should be inserted as the approved vector/SVG lockup, not as a loosely sized rectangle or an embedded raster placeholder. Provide:

- Primary light-background lockup.
- Reversed navy lockup.
- Mark-only icon for small sizes.
- Clear-space and minimum-size guidance.

The logo must use the approved palette from the style board.

#### 5. Convert repeated patterns into components

The current structure contains many generic names such as `Frame 1`, `Frame 2`, `Rectangle 37`, and `Frame 24`. Before implementation, rename and componentize the repeated patterns:

- `Button / Primary`.
- `Button / Secondary`.
- `Trust Benefit`.
- `Process Step`.
- `Requester Feature Card`.
- `Provider Feature Card`.
- `Trust & Safety Card`.
- `FAQ Item`.
- `Navigation`.

This will make the design understandable and reduce implementation errors.

## Section-by-section corrections

### Header

Current navigation content is directionally correct: How it works, For requesters, For providers, Trust & Safety, Log in, and Post a request.

Corrections:

- Use the approved logo rather than a manually sized placeholder.
- Keep the primary CTA visually dominant.
- Define hover, focus, active, and mobile-menu states.
- Use a consistent maximum content width with the hero and all following sections.
- Make all navigation targets real anchors or approved future routes.

### Hero

- Use the sharper request-and-offer headline.
- Avoid excessive empty space between headline, copy, and CTAs.
- Keep the two CTAs aligned and visually distinct.
- Make the trust benefits below the hero a deliberate three-item group with equal spacing and consistent icon treatment.
- Avoid using tiny 11–12px text for important trust claims.

### Trust benefits

The current benefits—clear agreements, protected payments, and fair dispute review—are valuable.

Corrections:

- Use one visual pattern for all three benefits.
- Give each benefit a short title and one concise explanation.
- Use the same icon size, card spacing, and text hierarchy.
- Phrase payment language carefully: communicate a protected process without promising a legally final escrow/refund policy before it is approved.

### How Requote works

The six-step flow is one of the strongest parts of the current concept.

Corrections:

- Make the six steps visually equal in width and importance.
- Use the same number container, icon scale, title style, and body style for every step.
- Ensure the connector line does not break or become unreadable on tablet/mobile widths.
- Keep the copy short enough to scan.
- Use the exact sequence: post request → receive offers → choose provider → secure payment → fulfillment → confirm/release/dispute.

### Requester and provider sections

The current split is useful, but the cards contain too much small text and too many nested elements.

Corrections:

- Give each audience a clear headline, short explanation, four-step mini-flow, and one CTA.
- Make the requester and provider panels visually related but not identical.
- Keep one strong illustrative object per panel.
- Avoid presenting detailed form fields as if the landing page itself is already the request screen.
- Use `Post your first request` and `Join as a provider` as the primary section CTAs.

### Trust & Safety

The current section has the right principle: the agreement comes first.

Corrections:

- Keep the sentence that disputes are judged against the documented agreement.
- Use three clear trust cards: documented agreement, protected payment process, evidence-based review.
- Avoid overpromising guaranteed refunds or automatic outcomes.
- Distinguish escrow, identity verification, delivery evidence, and dispute review instead of presenting them as one vague trust feature.
- Give the section enough contrast and spacing to feel like the product’s core differentiator.

### Categories and use cases

Add or strengthen a compact category section using the roadmap categories:

- Agriculture.
- Welding and fabrication.
- Skilled trades.
- Technology and digital services.

Keep the categories extensible. Do not make unsupported claims about the number of providers or nationwide availability.

### FAQ, final CTA, and footer

Confirm that the final design includes these sections. If they are not already below the inspected area, add them:

- FAQ accordion covering Requote, escrow, disputes, provider registration, logistics, and fees.
- Final two-path CTA: post a request or become a provider.
- Footer with support, trust and safety, terms, privacy, and contact links.

Unresolved business policies should be marked as pending rather than invented in the copy.

## Visual and accessibility corrections

- Use the Requote style board tokens consistently: Ink Navy `#12203D`, Signal Blue `#2F5FE0`, Sky Tint `#A9C1F5`, Paper `#F6F8FC`, and restrained Ember `#FF6A3D`.
- Use Signal Blue for primary actions and Ink Navy for trust/reading hierarchy.
- Reserve Ember for small emphasis; do not use it as the dominant brand color.
- Increase any body or trust copy that is currently close to 12px; public-facing explanatory text should generally be at least 16px on desktop and mobile.
- Verify text contrast for every text/background pairing.
- Define visible keyboard focus states for buttons, links, FAQ items, and the mobile menu.
- Use touch targets of at least 44px for mobile controls.
- Do not rely on color alone to communicate status or interaction.

## Developer handoff corrections

Before implementation, Precious should provide:

- Desktop and mobile frames.
- Component names and variants.
- Spacing and typography tokens.
- Approved logo SVGs.
- Image/icon source information and usage rights.
- Hover, focus, active, disabled, expanded, and mobile-menu states.
- Notes for content still awaiting business approval.

The development team should not have to infer responsive layout, component states, or which generic Figma rectangles are meant to be buttons, cards, icons, or separators.

## Recommended message to Precious

> Precious, the landing-page direction is strong and the core story is correct. Before implementation, please refine the hero so the request-and-offer model is immediately clear, add a complete mobile version, replace placeholder logo treatment with the approved vector lockups, standardize the trust/process cards, and convert repeated patterns into named reusable components. Please also confirm the FAQ, final CTA, footer, accessibility states, and all content that is still pending business decisions. I’ve listed the detailed corrections in `LANDING-PAGE-DESIGN-REVIEW.md`.
