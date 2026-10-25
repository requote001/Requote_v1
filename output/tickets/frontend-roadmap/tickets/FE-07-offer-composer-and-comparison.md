# FE 07 Offer Composer and Comparison

Priority: P0. Owner: frontend engineer. Estimate: 3 to 4 working days. Depends on FE-06 and BE-02 offer endpoints. Status: planned.

## User story

As a provider, I can submit clear complete terms and track my offers. As a requester, I can compare providers on scope, delivery and price.

## Screens and arrangement

Use `/requests/[requestId]/offer` for composition, an Offers section on request detail and `/offers` for the provider's list. Use `/offers/[offerId]` for a deep-linked offer detail shared with FE-08.

Composer fields: amount/currency, delivery days, proposal, included scope, exclusions, assumptions, logistics and validity. Show request context beside the form and a full review before submission. Comparison presents consistent columns on desktop and aligned provider cards on mobile. Never force a wide comparison table to overflow the viewport.

## Interactions and API dependencies

POST to the request's offers endpoint with a stable idempotency key. GET received offers is requester-only; GET offers/mine is provider-only. Read latestRevision and available actions from detail. The same owner must not see Make an offer on their own request.

Show success only after an actual response. Duplicate offer errors link to the existing thread where available. Withdrawal/decline require confirmation and call the correct actor-specific action. Submitted terms are read-only; do not implement unrestricted in-place editing. FE-08 provides requote revisions.

## Deliverables and acceptance criteria

Composer, review, comparison, provider list, offer detail and error mapping. Monetary display accurately converts minor units. An above-budget quote is not automatically rejected. Expired/closed requests disable submission with an explanation. No invented ratings, verified badges or competitor proposal data appear. Provider refresh restores actual submitted terms and terminal states.
