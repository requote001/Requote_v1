# FE 08 Requote Negotiation and Acceptance

Priority: P0. Owner: frontend engineer. Estimate: 3 to 4 working days. Depends on FE-07 and BE-02 requote/acceptance contracts. Status: planned.

## User story

As a requester or provider, I can negotiate changes without losing previous terms. As a requester, I can deliberately accept one exact final revision.

## Screens and arrangement

Extend offer detail with a Current terms summary, negotiation timeline and available actions. Distinguish provider quotes from requester counterproposals using text labels as well as visual treatment. Each entry shows author, time, amount, scope and delivery changes.

Request a requote opens a focused dialog with proposed price, optional scope/timing change and a message. Provider response opens a complete revision form prefilled from the previous quote. Acceptance opens a confirmation showing the exact provider revision, full price, scope, exclusions and delivery.

## Interactions and API dependencies

Connect proposal creation, proposal withdrawal/decline, provider revisions, both history lists and exact-revision acceptance. Pass baseRevisionId and requoteRequestId as required. A pending proposal blocks acceptance; requester can withdraw it before accepting the still-valid previous quote.

Use stable idempotency keys on proposal/revision/acceptance retries. On STALE_REVISION or ALREADY_ACCEPTED, refresh server state and ask the user to review the actual result. Do not optimistically mark acceptance before the API confirms it. Retrieve the acceptance snapshot for reload and direct-link views.

## Deliverables and acceptance criteria

Accessible negotiation dialogs, timeline, revision composer, confirmation and recorded terms screen. Earlier quotes remain readable and unchanged. Double-click/network retry cannot produce duplicate client actions. An expired offer is not acceptable. The accepted request displays selected terms and closed competitors correctly. No acceptance copy claims payment, escrow protection or work commencement.
