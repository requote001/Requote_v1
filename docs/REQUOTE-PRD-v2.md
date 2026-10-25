# Requote Product Requirements Document v2

Status: planning draft — expansion iteration  
Last reviewed: 2026-09-16  
Market entry: Nigeria, with future regional expansion

> BTEF is the earlier project name used in source roadmap documents. This PRD uses Requote throughout.

## 1. Product story

Requote helps people turn an economic need into a clear, documented request, then compare offers from people or businesses capable of fulfilling it. The platform makes the agreement visible, gives both sides a structured deal process, and provides a path for confirmation, payment release, correction, or dispute review.

Requote is not primarily a directory. Its core promise is: tell us what you need, get clearer offers, and move forward with a documented agreement.

The first platform release should prove one reliable loop:

Post request → receive offers → choose provider → agree terms → protect payment → fulfill → confirm or resolve.

The long-term product loop is:

Request → Understand → Match → Offer → Compare → Requote → Agree → Transact → Review.

AI should improve this loop. It should not become the product at the expense of request quality, provider fit, trust, or reliable transaction records.

The long-term product loop is:

Request → Understand → Match → Offer → Compare → Requote → Agree → Transact → Review.

AI should improve this loop. It should not become the product at the expense of request quality, provider fit, trust, or reliable transaction records.

## 2. Product principles

1. **The agreement is the source of truth.** Disputes are reviewed against the agreed scope, price, quality, timeline, and logistics.
2. **Trust is a process, not a badge.** Identity checks, profiles, evidence, payment protection, and dispute review solve different problems.
3. **Clarity before complexity.** Capture only what is needed for the next decision, then progressively reveal deeper fields.
4. **One account, multiple legitimate roles.** A user may request work, provide work, employ people, or explore partnerships; the product should not force duplicate accounts.
5. **Nigeria-first, extensible by design.** Categories, locations, currencies, logistics, and policies must be configurable.
6. **No unsupported promises.** Verification, escrow, refunds, fees, delivery coverage, and transaction guarantees must be labelled accurately as available, planned, or policy-pending.

## 3. Audiences and jobs

| Audience | Primary job | First useful action |
|---|---|---|
| Client/requester | Get a product or service fulfilled | Post a request |
| Provider | Find credible work and submit offers | Complete a provider profile or browse requests |
| Employer | Build a team or source project talent | Create a hiring or project brief |
| Professional | Find better-fit work opportunities | Complete a professional profile |
| Investor/partner | Understand and support the ecosystem | Join the investor/partner interest path |
| Trust/operator team | Keep transactions and users safe | Review requests, evidence, disputes, and risk flags |

The MVP marketplace loop is client/provider first. Employer/professional flows should be adjacent paths and may initially reuse request, profile, messaging, and offer primitives. Investor/partner interest remains an early-access path until a real product workflow is approved.

## 4. MVP scope

### In scope

- Account creation, sign-in, and role-aware onboarding.
- Home/feed showing relevant open requests and updates.
- Request creation, editing, publishing, and draft state.
- Request detail and offer submission.
- Client/provider profiles.
- Messaging or a deal-room conversation.
- Agreement summary with visible deal phases.
- Payment-provider integration research and a safe placeholder flow.
- Confirmation, evidence capture, and dispute-intake foundation.
- Notifications and activity history.
- Internal trust/admin views for early manual operations.

### Later or policy-dependent

- Full escrow custody and release rules.
- Milestone payments.
- Ratings and reviews.
- NIN or other identity verification.
- Platform-operated logistics.
- Employer hiring workflows beyond the shared request primitive.
- Investor portal and financial reporting.
- Buy-now-pay-later.
- Multi-country tax, compliance, and currency handling.

## 4A. Marketplace intelligence expansion

Requote should become progressively better at understanding demand, finding relevant supply, helping both sides compare and negotiate, and giving businesses useful operating insight. The first implementation should remain modular inside the existing Next.js/Supabase application. Separate services should be introduced only when scale, reliability, security, or model workloads justify them.

### Recommended release order

#### Release 1 — structured marketplace foundation

- Request schema and category/location/budget fields.
- Provider profiles, capabilities, availability, service area, and response history.
- Deterministic matching v1 using explicit fields and explainable rules.
- Comparable offer structure.
- Accept, decline, and request-a-requote actions.
- Negotiation history preserved inside Requote.
- Email/in-app activity notifications.
- Manual trust/risk review queue.

This release must work without an AI model. That gives Requote a dependable baseline and creates the data needed to evaluate intelligence features.

#### Release 2 — intelligence-assisted request and offers

- Natural-language Request Assistant that extracts category, location, timing, budget, quantity, and requirements.
- Follow-up questions only for missing or ambiguous information.
- AI-assisted provider matching layered on top of deterministic eligibility rules.
- Offer comparison that summarizes only factual differences already present in offers.
- Suggested requote prompts that the user explicitly accepts or edits.

AI outputs must be editable, explainable, and clearly labelled as suggestions. Users remain responsible for the final request, offer, and agreement.

#### Release 3 — trust and provider operating assistant

- Requote Verified identity/business status when real verification exists.
- Completed-job, response, cancellation, and review signals.
- Suspicious-activity and spam-risk flags routed to human review.
- Provider assistant for opportunities, response history, offer preparation, and performance summaries.
- Better notifications across email, in-app, and approved messaging channels.

#### Release 4 — marketplace intelligence

- Demand by category and location.
- Supply gaps and provider opportunity insights.
- Pricing and response-time benchmarks with privacy protection and sufficient data volume.
- Business analytics and recommendations.

These insights must use aggregated, permissioned data and must not expose one business’s private commercial information to another.

### Intelligence safety boundaries

- AI must not automatically reject users, deny payment, release funds, resolve disputes, or label a person fraudulent.
- Matching must begin with hard eligibility constraints before ranking or model suggestions.
- Offer comparison must point back to source offer fields and distinguish fact from interpretation.
- Negotiation suggestions must never silently change price, scope, delivery date, or liability.
- Sensitive data must be minimized before model processing, and prompts/outputs must have retention rules.
- Every AI-assisted action must have a human-readable explanation and an edit/undo path where possible.

## 5. Core entities

- **User:** authentication identity and account-level preferences.
- **Profile:** public identity, roles, location, biography, skills, categories, evidence, and availability.
- **Request:** a need posted by a client or employer, with category, scope, location, budget, timing, attachments, and status.
- **Offer:** a provider response with price, timeline, approach, exclusions, logistics, and validity.
- **Agreement:** accepted request/offer terms frozen for a deal.
- **Deal:** operational lifecycle from accepted offer to completion, release, or dispute.
- **Evidence:** files, messages, delivery records, and confirmations linked to a request or deal.
- **Message:** conversation item linked to users and optionally to a request/deal.
- **Notification:** an event a user needs to see or act on.
- **Dispute:** a structured claim tied to the agreement and evidence.
- **Organization:** optional future employer/company identity.

## 6. Core states

### Request

Draft → Published → Receiving offers → Offer accepted → In progress → Completed.

Alternative endings: cancelled, expired, or disputed.

### Deal

Agreement pending → Terms locked → Payment pending → Funded → Fulfillment → Awaiting confirmation → Released.

Alternative outcomes: correction requested, renegotiation, refunded, disputed, or cancelled.

### Profile

Started → Basic complete → Role complete → Trust ready → Published.

“Trust ready” must not imply verified identity until a verification service and policy exist.

## 7. Trust and dispute requirements

Every accepted deal must preserve the original request, accepted offer, final agreed scope and price, delivery expectations, relevant messages, evidence and timestamps, and confirmation/correction/release/dispute actions.

The dispute experience must explain that Requote reviews the documented agreement and evidence. It must not promise automatic refunds or guaranteed outcomes before the policy is approved.

## 8. Early success measures

- Percentage of visitors who understand and choose a path.
- Completed profiles and published requests.
- Time to first relevant offer.
- Offer-to-agreement conversion.
- Agreement-to-confirmation conversion.
- Deals with complete documentation.
- Dispute rate and resolution time.
- Repeat request or provider return rate.

Do not publish counts, trust claims, or coverage metrics until backed by production data.

## 9. Decisions required before payment launch

- Pilot city and first category pair.
- Account model and role-switching rules.
- Fee model.
- Payment/escrow provider and Nigerian regulatory approach.
- Identity-verification threshold.
- Dispute reviewer, service target, evidence rules, and appeal path.
- Logistics responsibility and liability.
- Cancellation and custom-work policy.
- Employer/professional workflow boundary.

## 10. Build sequence

1. Authentication and onboarding foundation.
2. Home/feed and navigation shell.
3. Profile page and profile completion.
4. Request creation and request detail.
5. Offers and messaging.
6. Agreement/deal room.
7. Notifications and activity.
8. Trust operations/admin.
9. Payment, escrow, logistics, and policy-controlled release.

Intelligence work is introduced across this sequence, not as a separate first milestone:

10. Deterministic matching and structured offer comparison.
11. Request Assistant and explainable matching suggestions.
12. Requote negotiation history and communication automation.
13. Trust/risk signals, provider assistant, and aggregated marketplace insights.

Each step should ship with its endpoint contract, empty/loading/error states, responsive design, accessibility checks, and analytics events.
