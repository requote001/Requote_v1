# FE 11 Social Feed Search and Network Actions

Priority: P1. Owner: frontend engineer. Estimate: 6 to 10 working days after scope and API agreement; split into smaller tickets at that point. Depends on FE-04 and separate social/feed/search contracts. Status: product and backend contract pending.

## User story

As a member, I can scroll through a useful professional feed, publish enabled content, discover people and requests, and return to saved content.

## Screens and arrangement

Extend `/home` into the intended continuous professional feed, preserving the approved Requote design. Each card reads author, content type, time, content, relevant context and compact actions. Keep formal request cards distinct from social updates and work samples.

Add approved post detail, network and saved-content routes when their backend models are confirmed. Search uses an anchored result panel with groups for enabled entities and a clear full-results destination. Do not advertise opportunity/application or investor workflows merely because those roles exist.

## Required scope split

Break this group into feed read/pagination, post composer/detail, comments/reactions, follow/network, saved content and global search. Each subtask needs an agreed contract, visibility rules and independent acceptance evidence. Social post APIs, profile-media APIs and follow APIs are separate from BE-02 marketplace endpoints.

## Interactions and dependencies

Load feed pages with stable cursor ordering and no duplicates. Preserve tab and reasonable return position. Composer supports only enabled post types; a formal request opens FE-05. Follow/Unfollow, Save, Comment and reactions persist after reload and recover from API errors. Search cancels stale queries and announces result state accessibly.

Do not show fabricated posts, popularity counts, recommendations or follow success. Report/block/hide controls require approved moderation contracts before becoming operational. Network/private content errors use truthful unavailable states.

## Deliverables and acceptance criteria

Accepted subtask contracts, real feed, enabled composers and social controls, network/saved/search surfaces and integration tests. A new network can have a helpful empty state. Publishing an update never creates a formal marketplace request accidentally. Private offer, payment or dispute information never enters public cards. Deferred controls are omitted or clearly unavailable rather than quietly simulated.
