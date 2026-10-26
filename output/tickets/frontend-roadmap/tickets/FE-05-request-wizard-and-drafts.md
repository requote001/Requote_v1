# FE 05 In App Request Wizard and Drafts

Priority: P0. Owner: frontend engineer. Estimate: 3 to 4 working days. Depends on FE-01, FE-04 and BE-02 draft/publish/upload endpoints. Status: planned.

## User story

As a requester, I can describe a need, save a draft, resume it and publish a real brief while staying inside the platform.

## Screens and arrangement

Retain the current wizard at `/post-a-request` with an authenticated platform entry. Steps: Basics, Scope, Location and logistics, Budget and timing, Review. Make product/service type, outcome, category and remote/onsite choice explicit. Budget is optional; private address and private budget are labelled clearly.

Use a summary and step navigation on desktop; compact progress and sticky primary actions on mobile. Review shows submitted public fields separately from private details. Primary action is Publish request; secondary is Save draft. Back never discards successfully saved progress.

## Interactions and API dependencies

Create a real draft with POST `/api/v1/requests`, then PATCH its ID using expectedVersion. Store the returned ID/version and show savedAt only after success. Resume by ID from My requests. The browser may cache unsaved input, but this must not be labelled server-saved.

Translate existing prototype fields to the agreed API fields. Convert naira input to integer kobo with decimal-safe parsing, map category labels to IDs and attachments to completed upload IDs. Upload supports progress, rejection and retry. Follow signed upload/completion contracts and approved file limits.

Publish calls the actual publish action with a stable idempotency key for retries. On success open the real request detail. A validation error returns to the affected step with data intact. A version conflict explains that the draft changed and offers reload/reconciliation. Unverified users may save drafts but must verify before publishing.

## Deliverables and acceptance criteria

Connected wizard, field adapter, uploads, draft resume and real publication confirmation. Remove in-app waitlist redirects and local-only publish success. The published ID resolves after reload. Required field rules match BE-02; forms do not enforce obsolete six-character title or twenty-character description rules. Losing network preserves entered values and never claims a publication succeeded.
