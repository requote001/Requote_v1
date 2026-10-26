# Page brief: Activity, settings, and trust operations

Status: draft for product review

## A. Activity and notifications

### Story

Give each user a reliable, chronological place to see meaningful changes and act on them.

### Content

- New offer, offer accepted/declined, message, agreement action needed, deal phase change, evidence request, dispute update, and account/security events.
- Read/unread state, timestamp, linked request/deal, and one clear action.
- Email/push preferences and digest settings where supported.

### Endpoint contract

- GET /api/notifications?cursor=...
- POST /api/notifications/{id}/read
- POST /api/notifications/read-all
- GET/PATCH /api/me/notification-preferences

### Acceptance

Notifications are idempotent, permission-scoped, actionable, and do not expose sensitive details on lock screens by default.

## B. Account settings

### Story

Let users manage access, profile visibility, contact methods, active roles, and communication preferences without losing control of their account.

### Sections

- Account/contact and verification state.
- Password/session/security controls.
- Role and organization management.
- Privacy/profile visibility.
- Notification preferences.
- Data export and account closure request.

### Endpoint contract

- GET/PATCH /api/me/settings
- POST /api/me/sessions/revoke
- POST /api/me/export
- POST /api/me/close-account

### Acceptance

Sensitive changes require re-authentication where appropriate; destructive account actions explain consequences and recovery limits.

## C. Trust operations console

### Story

Allow authorized Requote staff to resolve early-market issues consistently with a complete audit trail, without giving operators unnecessary access to unrelated data.

### Work queues

- Reported profiles/requests.
- Identity checks only if a verification vendor exists.
- Deals awaiting manual intervention.
- Disputes with agreement, evidence, chronology, and party submissions.
- Risk flags and duplicate/fraud indicators.

### Operator actions

- Assign/reassign case, request more evidence, record decision, pause an action where policy allows, and escalate.
- Capture reason, evidence references, timestamp, operator identity, and any user communication.
- Decision outcomes must follow approved policy; UI must not invent refund or release rules.

### Endpoint contract

- GET /api/ops/cases
- GET /api/ops/cases/{caseId}
- POST /api/ops/cases/{caseId}/assign
- POST /api/ops/cases/{caseId}/request-evidence
- POST /api/ops/cases/{caseId}/decision

### Acceptance

Role-based access, audit logging, least privilege, and clear separation between recommendation and irreversible payment action are mandatory.

## Decisions needed

- Notification channels and delivery provider.
- Data export/deletion and retention requirements.
- Staff roles and case access policy.
- Dispute policy, response times, and escalation path.
