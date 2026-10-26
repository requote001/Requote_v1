# Screen Action and API Mapping

## Contract status

This is the target integration map. BE-02 endpoints are documented contracts pending implementation verification. Foundation authentication/profile endpoints must be checked against actual deployment and normalized to `/api/v1`. Messaging, social, active-role persistence and profile-media contracts still need explicit backend agreement.

| Screen and action | Data or API capability | Ticket and readiness |
| --- | --- | --- |
| Login/create account/recovery | Supabase Auth methods and callbacks | FE-01; provider configuration required |
| Verify email/resend | Supabase verification state; approved resend path | FE-01; replace current waitlist redirect |
| Signed-in identity | GET /api/v1/auth/me | FE-01; verify foundation response |
| Setup load/save/finish | GET/PATCH /api/v1/profile/me; completion GET and complete POST | FE-02; foundation contract |
| Select multiple roles | Role list/add/remove and per-role GET/PATCH | FE-02; map display labels to role IDs |
| Own/public profile | Private profile and GET /api/v1/profiles/:id | FE-03; slug resolution contract needed |
| Avatar/portfolio upload | Profile-specific media sign/create/remove | FE-03; contract gap, not request attachment API |
| Home complete/incomplete state | Auth/profile completion data | FE-04; real account state |
| Home role switch | Persist selected active role among granted roles | FE-04; endpoint/response agreement needed |
| Create/save request | POST /api/v1/requests; PATCH /api/v1/requests/:id | FE-05; BE-02 expectedVersion and idempotency |
| Request upload | POST /api/v1/uploads/sign; POST uploads/:id/complete | FE-05; BE-02 file purpose and ownership |
| Publish request | POST /api/v1/requests/:id/publish | FE-05; BE-02 verified eligibility |
| Browse and owner requests | GET /api/v1/requests; GET requests/mine | FE-06; BE-02 filters/cursors |
| Request detail/activity/cancel | GET requests/:id; GET activity; POST cancel | FE-06; BE-02 visibility and version |
| Submit offer/compare | POST requests/:id/offers; GET same route | FE-07; BE-02 requester/provider permissions |
| Own offers and detail | GET /api/v1/offers/mine; GET offers/:id | FE-07; BE-02 latestRevision |
| Withdraw/decline offer | POST offers/:id/withdraw or decline | FE-07; actor-specific BE-02 action |
| Request/resolve requote | Proposal create/withdraw/decline and provider revision POST | FE-08; BE-02 linked IDs and state rules |
| Negotiation history | GET offers/:id/revisions and requote-requests | FE-08; BE-02 private participant history |
| Accept and reload terms | POST offers/:id/accept; GET requests/:id/acceptance | FE-08; BE-02 exact revision and replay safety |
| Notifications/read count | Notification list/count/read/read-all | FE-09; foundation APIs plus BE-02 events |
| Preferences/help | Notification preferences and support ticket/message APIs | FE-09; verify actual foundation endpoints |
| Contextual messages | Conversation/message/read/unread contracts | FE-10; next backend ticket, pending |
| Feed/posts/reactions/comments | Social feed and post contracts | FE-11; separate backend scope, pending |
| Follow/network/save/search | Follow graph, saves and entity-search contracts | FE-11; pending; request search is available separately via BE-02 |

## Existing prototype to API field map

| Existing prototype | Target handling |
| --- | --- |
| role as one display string | Stable selected role IDs plus separate active role; agreed single source of truth |
| name/location text | Profile schema and structured country/city where required |
| professionalFocus/professionalLevel/professionalOverview | Explicit map into headline/focus/experience/bio fields agreed with backend |
| description and specifications | Map to outcome/scope/constraints without dropping user input |
| category display label | Resolve enabled categoryId; use one agreed category source |
| location.state/city/address | Retain meaningful region data through the agreed schema; country/city public, address private |
| budget.minimum/maximum strings | Parse decimal naira safely to minAmountMinor/maxAmountMinor; display currency and visibility |
| attachmentNames | Replace with server-owned completed upload IDs and returned metadata |
| neededBy/timelineFlexible | targetDate/dateFlexible with validation |
| logistics selection | Agree request logistics field with backend; preserve provider/self/discuss choices and gate unavailable platform logistics |
| local profileComplete/emailVerified | Server-derived completion and verified email state |
| fake saved request ID or preview persisted=false | Actual backend request ID, version, savedAt and published status |

Category source, region retention, profile field mapping and request logistics are FE-00 contract decisions. If a field is present in the screen but absent from BE-02, resolve it with the backend engineer before integration. Do not silently drop it or add an undocumented payload property.
