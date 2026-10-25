# Page brief: Browse requests and post a request

Status: draft for product review  
Routes: /requests and /post-a-request

## Page story

The requests surface turns real needs into useful work opportunities. Clients can publish a structured brief; providers can discover requests that match their capabilities and respond with a clear offer.

## Browse requests

- Search by plain-language need, category, and location.
- Filter by category, budget disclosure, date, and service/delivery location.
- Each card shows title, category, location, posted date, scope excerpt, and status.
- Hide client private contact details.
- Save/bookmark request; report suspicious or inappropriate request.
- Show an honest empty state and onboarding action if there are no requests.

## Post-request steps

1. Need: title, product/service, category, and concise outcome.
2. Scope: specifications, quantity, quality, attachments, and constraints.
3. Location and logistics: pickup/delivery/service location; own or platform logistics only where available.
4. Timing and budget: optional budget, target date, and flexibility.
5. Review: summary, visibility, edit controls, save draft, publish.

## Validation and safeguards

- Explain what makes a useful brief with examples, not pre-filled claims.
- Mark optional fields clearly.
- Validate file type/size and remove sensitive EXIF where appropriate.
- Warn about phone/email/payment details in public descriptions.
- Preserve draft locally or server-side only with explicit truthful messaging.
- Publishing requires authentication; never imply a draft is saved to the cloud if it is only local.

## States

Draft, autosaving/saved, publish confirmation, validation error, upload progress/failure, request published, request closed, and empty browse results.

## Endpoint contract to plan

- GET /api/requests with filters and pagination
- POST /api/requests
- GET /api/requests/{requestId}
- PATCH /api/requests/{requestId}
- POST /api/requests/{requestId}/publish
- POST /api/uploads/sign

## Acceptance criteria

- A client can review all terms before publishing.
- A provider can find enough public scope information to decide whether to respond.
- Private fields are not exposed in the browse API.
- Errors preserve entered data and identify the field to fix.

## Decisions needed

- Request edit rules after offers arrive.
- Required category-specific fields for launch categories.
- Attachment limits and moderation workflow.
- Public budget visibility and request expiration rules.
