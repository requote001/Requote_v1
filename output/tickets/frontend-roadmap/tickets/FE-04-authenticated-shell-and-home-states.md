# FE 04 Authenticated Shell and Home Account States

Priority: P0. Owner: frontend engineer. Estimate: 2 to 3 working days. Depends on FE-01 and FE-02. Status: planned.

## User story

As a signed-in member, I can navigate the platform, understand my account state and reach my next useful action from home.

## Screens and layout

Use the established three-column desktop home shell: identity/navigation left, composer/content center and relevant context right. Collapse the right rail first, then use a single-column mobile layout and compact navigation. Maintain small consistent card-action typography and aligned dropdown chevrons.

Use actual name, avatar, role and location. For an incomplete profile, show a clear setup card and Continue setup. For a completed profile, remove the complete-profile prompts and account-setup rail module; show the profile summary and useful enabled content instead. Do not replace missing account data with a guessed completed state.

## Interactions and dependencies

Header avatar opens an aligned keyboard-accessible menu with Profile, Settings, Help and Sign out. Outside click and Escape close it; focus returns to the trigger. Post a request routes into the authenticated wizard. Other navigation must open working routes or explicit unavailable states.

Use auth/profile state from the API. Existing `?profile=true/false` preview controls may remain in isolated design/demo environments, but must not override real completion or permissions in a connected release. Active-role switching is limited to selected roles and requires an agreed persistence contract.

Search shows a small anchored results panel while typing, with pending, results, no-results and error states. Until a search API exists, provide a clearly limited request-only search once FE-06 lands or an unavailable message; do not claim a successful empty search against no service.

## Deliverables and acceptance criteria

Reusable authenticated shell, real account summary, menu behavior, completed/incomplete states and safe navigation. Keyboard and mobile navigation work. Signed-out redirects preserve safe intended destinations. No fake unread counts or sample feed content appear as real activity. FE-11 separately delivers the social stream.
