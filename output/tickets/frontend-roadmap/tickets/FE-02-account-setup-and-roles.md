# FE 02 Account Setup and Multiple Roles

Priority: P0. Owner: frontend engineer. Estimate: 3 to 5 working days. Depends on FE-01 and profile/role/completion APIs. Status: frontend design/local preview implemented 25 October 2026; backend contracts and integrated acceptance pending. See `docs/platform/13-account-setup-design-batch.md` for implementation scope and outstanding work. Existing downloadable ticket exports have not been regenerated.

## User story

As a member with an unfinished profile, I can understand what is required, save progress, select multiple roles and finish setup without repeating saved work.

## Screens and arrangement

Keep the current account-setup visual design. Maintain a clear step list and main form: About you, Professional overview, Roles and role details, Email status, Review. Show one focused step on mobile and a visible step indicator. Distinguish required fields from optional enhancement fields.

Basic identity includes name, location, headline and approved avatar input. Professional overview includes focus, level/experience, bio, skills, availability and visibility. Use role chips or checkboxes for multiple roles and a separate primary-role choice. Reveal selected role branches without erasing values in another selected branch.

Requester details cover service interests. Provider details cover services, categories, service areas and experience. Employee details cover skills, work history and work preferences. Employer details cover company context. Investor details cover interests and sectors. Use the backend-agreed minimal fields first; defer unsupported portfolio/CV uploads until their contracts exist.

## Interactions and API dependencies

Load and save through `/api/v1/profile/me`, roles and role-specific profile endpoints. Use the completion response for percentage, missing fields and next step. Save on explicit Save/Continue; label background saving truthfully if autosave is implemented. Failed saves keep entered values and explain retry.

Read email verification from the real session/account response. The email step supports resend and refresh status; remove the preview confirmation toggle. Finishing calls the validated completion action and returns to a safe home/profile/request destination.

## Deliverables

Reusable step forms, role-label adapters, partial-save/resume logic, review screen, completion-state integration and tests for multiple roles and failed saves.

## Acceptance criteria

Reload restores saved setup across sessions. Selecting requester and provider preserves both branches. Completion is server-derived. Completed users do not see mandatory setup banners on home. Identity verification remains separately unverified unless supported by real data. No bank or payout collection is introduced into basic setup.
