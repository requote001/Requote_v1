# FE 06 Requests Browse Management and Detail

Priority: P0. Owner: frontend engineer. Estimate: 3 to 4 working days. Depends on FE-04, FE-05 and BE-02 request reads/actions. Status: planned.

## User story

As a member, I can browse open requests. As a requester, I can find my drafts and published requests, inspect responses and manage an open brief.

## Screens and arrangement

Add `/requests` with Browse requests and My requests views. Header: title, compact search/filter controls and Post a request. Cards show title, category, coarse location, scope excerpt, public budget where disclosed, timing, status and context-appropriate actions. Owner list includes draft/published/accepted/cancelled/expired filters.

Add `/requests/[requestId]`. Main column shows outcome, scope, quantity/constraints, logistics, attachments and timing. Side panel shows owner summary, public budget, lifecycle and next action. Owner controls include resume/edit draft, review offers and permitted cancellation; eligible providers see Make an offer. Use an accessible filter drawer on mobile.

## Interactions and API dependencies

Use GET requests, requests/mine, detail and activity. Debounce search and cancel outdated requests so earlier results cannot overwrite newer ones. Preserve filters in the URL and paginate using nextCursor without duplicates. Request activity must respect backend visibility.

Cancellation opens a confirmation with a reason and calls the version-aware action. Lock commercial edits once the API reports offers exist. Signed attachment download links come from the authorized API. Closed requests remain readable where allowed but cannot accept new offers.

## Deliverables and acceptance criteria

Two list views, responsive request detail, filters, pagination, cancellation, empty/error/restricted states and deep links. Empty discovery gives a useful next step, never fake posts. Private address and hidden budget are absent. Drafts are visible only to their owner. View request from home or a profile opens the correct ID and preserves reasonable back navigation.
