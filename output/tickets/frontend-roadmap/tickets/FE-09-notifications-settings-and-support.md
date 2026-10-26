# FE 09 Notifications Preferences and Support

Priority: P1. Owner: frontend engineer. Estimate: 3 to 4 working days. Depends on FE-01, FE-04 and verified foundation notification/support endpoints. Status: planned.

## User story

As a member, I can see relevant updates, control notification preferences and ask for help when an account or marketplace action fails.

## Screens and arrangement

Use a compact header notification panel plus `/activity` for the full list. Each notification shows title, safe summary, timestamp, read state and action destination. Add All/Unread filters and Mark all read. Settings at `/settings` includes notification preferences and approved account/privacy controls. Support at `/support` includes common help topics, a contact form, own-ticket list and conversation detail.

## Interactions and API dependencies

Use notifications list/unread count, mark-one/read-all and preference GET/PATCH endpoints under `/api/v1`. Update read state after success or roll it back if optimistic behavior is used. Keep header count and list synchronized. Follow a notification only after resolving an allowed internal action destination.

Use support create/list/detail/message endpoints from the foundation contract. Offer category, subject and message fields, plus reference to the failed action where appropriate. Do not include access tokens or private logs in support submissions. Use persisted settings rather than switches that reset after reload.

## Deliverables and acceptance criteria

Notification panel/page, real count, settings form and support request flow with loading/empty/error states. Security notifications remain mandatory. Marketing consent is separate from transactional preferences. Another user's support ticket stays inaccessible. Return a real support reference after submission. If a backend area is missing, record it as blocked rather than showing a false success notice.
