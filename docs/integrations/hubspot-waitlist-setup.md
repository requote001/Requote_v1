# HubSpot setup guide — Requote waitlist

Status: setup instructions; application sync code is not enabled yet  
Last reviewed: 2026-09-16

## Recommended design

Keep Supabase as the canonical waitlist database. HubSpot is a CRM mirror for follow-up, segmentation, and approved marketing. A successful waitlist submission must remain successful even if HubSpot is temporarily unavailable; failed syncs should be retried and observable.

Current app behavior: the browser posts to POST /api/waitlist, and the server upserts the row into public.waitlist_entries by email. The current route does not call HubSpot yet.

## What to prepare in HubSpot

### 1. Confirm the HubSpot account

Sign in to the Requote HubSpot account. Use a test contact first. Confirm the team has permission to manage private apps, contact properties, and lists/workflows.

### 2. Create contact properties

In Settings, open Data Management → Properties, select Contact properties, and create the following custom properties. HubSpot may show slightly different navigation labels as its UI changes.

| Label | Internal name suggestion | Type | Source |
|---|---|---|---|
| Requote role | requote_role | Dropdown select | requester, provider, employer, employee, investor, both |
| Requote profile interest | requote_profile_interest | Single-line text | Waitlist profile_interest |
| Requote waitlist source | requote_waitlist_source | Single-line text | source |
| Requote request intent | requote_request_intent | Dropdown select | general, draft, published |
| Requote city | requote_city | Single-line text | city |
| Requote waitlist joined at | requote_waitlist_joined_at | Date/time | created_at / first submission timestamp |
| Requote last waitlist update | requote_waitlist_updated_at | Date/time | updated_at |

Use lowercase internal option values that exactly match the API payload. Create any additional UTM properties only if the team intends to use them in HubSpot lists or reports (for example, requote_utm_source and requote_utm_campaign).

Map full_name to HubSpot firstname and lastname in the server. Map email to email and phone to phone. Do not overwrite unrelated CRM fields with blank values.

### 3. Create a least-privilege private app

In HubSpot Settings, open Integrations → Private Apps and create an app named “Requote Waitlist Sync”. Grant only the contact write scope needed to create/update contacts: crm.objects.contacts.write. Do not enable read scopes unless a later feature actually requires them.

Generate/copy the private app access token. Treat it like a password. Do not paste it into chat, source code, a screenshot, or a GitHub issue.

### 4. Store the token in deployment secrets

Add this server-only environment variable to the local ignored .env file and to the Vercel project’s Environment Variables for Preview and Production:

HUBSPOT_ACCESS_TOKEN=<private app token>

Never prefix it with NEXT_PUBLIC_. Do not commit .env. After changing a Vercel variable, redeploy so the running server receives it. Keep the Supabase URL/secret configured separately as they are today.

## Planned synchronization behavior

1. Validate the waitlist submission and save/upsert to Supabase.
2. Only after the Supabase write succeeds, queue or attempt a HubSpot contact upsert by email.
3. Send mapped fields: email, first/last name, phone when present, Requote role, profile interest, city, source, request intent, and selected UTM fields.
4. Keep Supabase as the source of truth. A HubSpot outage must not tell the visitor their waitlist entry failed after it was saved.
5. Record sync status and retry transient failures with backoff. Do not log access tokens or full contact payloads.
6. Ensure repeated submissions for the same email update the same HubSpot contact rather than creating duplicates.

For reliable retries, use a Supabase outbox/sync-status record (or an equivalent durable queue) instead of fire-and-forget work that may be lost when a serverless function exits. The exact implementation should be part of the backend task, not manual SQL run ad hoc.

## Privacy and consent

The existing consent_at and privacy_policy_version fields document acceptance of the privacy notice; they are not necessarily marketing-email consent. Do not enroll a contact in marketing emails unless the form captures separate, explicit marketing consent and that consent is mapped to the appropriate HubSpot subscription type. Keep role routing and operational waitlist updates separate from marketing subscriptions.

Send only the fields needed for early-access follow-up. Do not send passwords, authentication tokens, identity documents, dispute evidence, or payment information to HubSpot.

## Test checklist after the server integration is implemented

1. Use a new internal test email and submit the waitlist form.
2. Confirm the submission appears in Supabase first.
3. Find the same email in HubSpot Contacts and confirm the mapped role/source/interest fields.
4. Submit the same email with an updated role or interest; confirm one HubSpot contact is updated, not duplicated.
5. Temporarily use an invalid test token in Preview only; confirm Supabase still records the entry and the sync failure is visible to operators for retry.
6. Restore the valid Preview token and confirm retry succeeds.
7. Confirm no marketing subscription is enabled without explicit marketing consent.
8. Review Vercel logs to ensure tokens and personal data are not printed.

## What the Requote developer needs from you

- Confirmation that the correct HubSpot account is open.
- The access token added directly to Vercel and local .env (do not send it here).
- Confirmation that the listed custom contact properties exist, including their exact internal names.
- Confirmation of who should own new contacts and whether any workflow should notify the team.
- The exact wording and checkbox policy for optional marketing consent, if marketing emails are planned.

Once those steps are done, the next implementation task is the server-side sync with durable retry status and an end-to-end test. The token itself is not needed in the chat; the code reads it from environment configuration.
