# Page brief: Requote marketplace intelligence layer

Status: product expansion draft  
Purpose: define the intelligence capabilities around the marketplace core

## Product thesis

Requote should not be just a place where people post requests. It should gradually understand what a person needs, identify relevant providers, help both sides reach a clear agreement, and help businesses improve their performance.

The core product remains the Request → Matching → Offers → Requote loop. Intelligence is a layer that makes each step faster and clearer.

## Capability 1 — Request Assistant

### User story

The user describes a need naturally, for example: “I need a photographer for my wedding in Lagos in November. About 300 guests and my budget is ₦600k.” Requote extracts likely fields, shows the interpretation, and asks only for missing or ambiguous details.

### Requirements

- Accept free-text input and optionally voice/transcription later.
- Extract category, subcategory, location, date, quantity, budget, quality, constraints, and desired outcome.
- Show extracted fields for review and editing before saving.
- Ask a small number of high-value follow-up questions.
- Fall back to the structured form when confidence is low or the user prefers it.
- Preserve the original user wording as part of the request record.

### First-release boundary

Start with extraction and clarification, not autonomous publishing. The user must confirm the final request.

## Capability 2 — Smart Provider Matching

### Matching inputs

- Category and service capability.
- Location/service area.
- Availability and timing.
- Budget range where disclosed.
- Profile completeness and trust status.
- Response history and cancellation history.
- Relevant completed jobs and reviews once those systems exist.

### Rules

1. Apply eligibility filters first.
2. Rank only among eligible providers.
3. Explain the main match reasons.
4. Give providers control over availability and category data.
5. Never imply a provider is verified, safe, or guaranteed solely because a model ranked them.

## Capability 3 — AI Offer Comparison

### User story

After receiving multiple offers, the customer sees a consistent side-by-side comparison of price, timeline, scope, exclusions, warranty/aftercare, logistics, and provider history where available.

### Requirements

- Normalize offer fields before comparison.
- Show missing fields clearly.
- Link each comparison claim to the original offer.
- Separate factual extraction from AI-written explanation.
- Let the customer open the full offer before deciding.

AI may say “Offer A includes delivery while Offer B does not specify delivery” when those facts exist. It must not invent a warranty, infer quality, or declare a winner without an approved policy.

## Capability 4 — Requote negotiation engine

### User story

The customer can Accept, Decline, or Request a Requote. A Requote creates a new version in the same negotiation history instead of moving the conversation to an untracked channel.

Example:

Original offer: ₦1.2m  
Customer counter: ₦900k  
Provider requote: ₦1.05m

### Requirements

- Preserve every version and actor timestamp.
- Highlight exactly what changed: price, scope, date, logistics, warranty, or exclusions.
- Require explicit confirmation before terms become the agreement.
- Prevent silent changes to an accepted offer.
- Notify the other party of a new requote.

## Capability 5 — Trust and risk system

### Signals

- Identity/business verification status when available.
- Completed-job history.
- Response rate and response time.
- Cancellation and dispute history, shown carefully and according to policy.
- Reviews and ratings when launched.
- Spam, duplicate, suspicious-payment, or unusual-activity flags.

Risk signals should route to review queues. They must not automatically ban, deny payment, or resolve a dispute.

## Capability 6 — Provider business assistant

### Useful questions

- How many opportunities did I receive this month?
- How many offers did I win?
- Which requests have I not answered?
- Help me prepare an offer for this customer.
- Which services are generating the most business for me?

The assistant may summarize permissioned business data and draft an offer, but the provider must review and submit the final offer. Analytics should distinguish recorded facts from generated recommendations.

## Capability 7 — Communication layer

Initial channels:

- In-app notifications.
- Transactional email.

Later channels:

- WhatsApp or other approved messaging integrations, subject to consent, templates, delivery rules, and privacy review.

Example events:

- New matching request.
- New offer received.
- Requote received.
- Agreement awaiting confirmation.
- Evidence requested.
- Deal phase changed.

Every notification must link to the correct Requote context and avoid exposing sensitive details in previews.

## Capability 8 — Marketplace intelligence

Over time, Requote can learn from aggregated marketplace events:

- Demand by category and location.
- Supply gaps.
- Typical response times.
- Offer ranges and acceptance patterns.
- Repeat business and provider performance.

Use these insights only when there is enough data to avoid exposing individuals or businesses. Never reveal a competitor’s private offer or commercial performance.

## Data and module boundaries

Keep the first version modular in Next.js/Supabase:

- `request-assistant`: extraction and clarification orchestration.
- `matching`: eligibility filters and explainable ranking.
- `offers`: normalized offer fields and comparison.
- `requote`: versioned negotiation history.
- `trust`: verification/risk signals and review cases.
- `communications`: notification events and delivery attempts.
- `analytics`: aggregated, permissioned metrics.

Split a module into a separate service only when it needs independent scaling, queue processing, model isolation, or stronger security boundaries.

## Initial endpoint plan

- POST /api/requests/interpret
- POST /api/requests/{requestId}/clarify
- GET /api/requests/{requestId}/matches
- GET /api/requests/{requestId}/offer-comparison
- POST /api/offers/{offerId}/requote
- POST /api/negotiations/{negotiationId}/accept
- POST /api/negotiations/{negotiationId}/decline
- GET /api/providers/me/insights
- POST /api/assistant/offer-draft
- GET /api/notifications

AI endpoints should return structured data, confidence/uncertainty where useful, source fields, and a versioned prompt/model identifier for internal observability—not model internals to end users.

## Success measures

- Lower time from free-text need to publishable request.
- Higher percentage of requests with complete, decision-useful scope.
- Higher match-to-offer response rate.
- Lower time for customers to compare offers.
- Requote-to-agreement conversion.
- Provider repeat usage and response quality.
- No increase in unsafe, unfair, or unexplained outcomes.

## Build order

1. Structured request and offer fields.
2. Deterministic matching v1.
3. Versioned Requote negotiation.
4. Notification events and email.
5. Request Assistant extraction.
6. Factual offer comparison.
7. Trust/risk review signals.
8. Provider assistant and aggregated intelligence.
