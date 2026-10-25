# FE 10 Request Linked Messaging

Priority: P1. Owner: frontend engineer. Estimate: 4 to 6 working days after contract readiness. Depends on FE-01, FE-04, FE-06 and the next messaging backend ticket. Status: backend contract pending.

## User story

As a requester or provider, I can discuss a specific request or offer and keep its context visible while reading and sending messages.

## Screens and arrangement

Add `/messages` and `/messages/[conversationId]`. Desktop layout: conversation list left, thread center and collapsible request/offer context right. Mobile opens the list, then a focused thread with Back; context opens a drawer. Conversation rows show participant, request title, last safe message, time and real unread state.

Thread header links to the participant profile and request. Timeline distinguishes messages from backend-created system events. Composer has a labelled text input, send state and attachment control only when supported. The context panel links to current offer/requote detail rather than duplicating acceptance logic inside generic chat text.

## API contract gate

Agree conversation create/list/detail, message list/send, mark-read and unread-count endpoints with the backend owner. These are expected capabilities, not verified endpoints. Confirm request/offer linkage, client message IDs for safe retries, pagination order, attachment policy and read semantics before connecting.

Polling is acceptable for the first release if agreed; online, typing, delivery/read receipts and live presence must not be displayed without real supporting events. No WebSocket implementation is implied by this frontend ticket.

## Deliverables and acceptance criteria

Inbox, thread, context drawer, sending/retry, pagination, unread integration and request/profile navigation. Opening Message from an eligible profile or offer finds/creates the correct contextual conversation without duplicate threads. Failed sends remain visibly retryable. Scroll position is preserved when older messages load. No conversations or messages are manufactured to hide an empty inbox. Permission errors never expose private message content.
