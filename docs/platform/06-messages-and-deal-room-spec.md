# Page brief: Messages and deal room

Status: draft for product review  
Routes: /messages and /deals/[dealId]

## Page story

Messages help the parties clarify scope before agreement. Once an offer is accepted, the deal room becomes the shared record of what was agreed and what each party must do next.

## Messages inbox

- Conversation list with request/deal context, participant, last message, unread state, and time.
- Search/filter and unread view.
- Report/block controls and safety reminders.
- Empty/loading/error states.

## Deal room structure

1. Deal summary: parties, request, accepted offer, agreed price and dates.
2. Phase tracker: terms locked, payment status, fulfillment, confirmation, outcome.
3. Agreement panel: scope, exclusions, quality, logistics, milestones if approved.
4. Conversation timeline with attachments and system events.
5. Evidence panel for completion/delivery proof.
6. Role-aware next action and support/dispute entry.

## Trust rules

- Agreement versions are immutable after both parties confirm; edits create a proposed change requiring both confirmations.
- Show payment status only from the payment provider’s verified server event.
- Do not label funds “escrowed” until legally and technically true.
- Preserve messages/evidence required for dispute review with clear retention policy.

## Endpoint contract to plan

- GET /api/messages/conversations
- GET /api/deals/{dealId}
- GET /api/deals/{dealId}/messages
- POST /api/deals/{dealId}/messages
- POST /api/deals/{dealId}/agreement/confirm
- POST /api/deals/{dealId}/changes
- POST /api/deals/{dealId}/evidence

## Acceptance criteria

- Each message is associated with the correct request/deal context.
- Permission checks prevent unrelated users from reading conversations or evidence.
- System events are distinguishable from user messages.
- Agreement changes require explicit acknowledgement by both sides.

## Decisions needed

- Realtime provider and message retention policy.
- Attachment scanning and storage limits.
- Exact conditions for locking, changing, or cancelling an agreement.
- Which deal actions are available before payment integration is live.
