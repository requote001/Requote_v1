# Page brief: Request detail and provider offer

Status: draft for product review  
Routes: /requests/[requestId] and /requests/[requestId]/offer

## Page story

The detail page lets a provider assess the actual need before committing. The offer flow lets them respond with a specific, comparable proposal. The client can compare offers against the same request and choose without losing the original scope.

## Request detail content

- Request title, category, status, location, posted date, timing, and budget if public.
- Full agreed-to-be-public scope, quantity, quality requirements, and attachments.
- Client profile summary with privacy-safe trust information.
- Offer deadline or request expiry if configured.
- Provider CTA to ask a question or submit an offer.
- Client controls to edit, close, or review offers.

## Offer composer

- Total price and currency.
- Delivery/service timeline and availability.
- Approach and included scope.
- Exclusions, assumptions, and materials.
- Logistics plan and quote validity.
- Optional milestones only if policy and payment support are approved.
- Review screen showing how the offer compares with the request.

## Offer comparison for client

Use consistent columns/sections for price, timeline, approach, exclusions, logistics, provider profile, and clarification history. Do not rank solely by lowest price or fabricate provider ratings.

## Endpoint contract to plan

- GET /api/requests/{requestId}/offers
- POST /api/requests/{requestId}/offers
- PATCH /api/offers/{offerId}
- POST /api/offers/{offerId}/withdraw
- POST /api/offers/{offerId}/accept

## Acceptance criteria

- Only eligible authenticated providers can submit an offer.
- Offers preserve their submitted version and timestamps.
- Acceptance prompts the parties to review terms before agreement lock.
- The client can reject/close an offer without exposing private data.

## Decisions needed

- Whether providers can revise an offer after submission.
- Offer expiration, cancellation, and response rules.
- Fee disclosure point and currency support.
- Whether clarifying questions use messages or a structured Q&A thread.
