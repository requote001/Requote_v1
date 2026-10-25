# Signed-in home dashboard refinement

## Scope

Improves the existing `/home` frontend preview. The existing mock authentication and in-platform request journey remain intact. This does not connect production authentication, feed, messaging, offers, notifications, or social-post APIs.

## Layout and behavior

- Retains the established Requote typography, blue/navy palette, three-column desktop feed, and compact card actions.
- Adds consistent SVG icons, clearer typography, restrained card styling, and a real illustrative workshop photograph.
- At intermediate widths, the support rail moves below the feed; phones and small tablets use a centered single-column feed with fixed bottom navigation.
- The avatar disclosure is available on mobile and desktop: profile, profile editing/setup, account-settings availability, support, saved posts, preview-role selection, and sign out.
- Completed accounts show the profile summary without setup prompts. Incomplete accounts get contextual setup links. Missing completion data is not treated as completed.
- Existing explicit design instances remain: `/home?profile=false` shows completed; `/home?profile=true` shows incomplete. These are preview overrides, not authorization controls.
- Feed filters, Following, Save/Unsave, and the Saved posts view work with in-memory example content. These actions reset on page reload and do not claim server persistence.
- Search displays an anchored no-results/unavailable panel while typing, with explicit disclosure that live search is not connected. Escape and outside interaction dismiss it.
- Request, work-sample, and opportunity actions open contextual preview dialogs. Escape closes them and restores focus to the invoking control. Unconnected offer, messaging, and notification actions explain availability rather than pretending to send something.
- Requests navigation filters the example feed. Post a request still opens `/post-a-request?journey=request&source=home`, not the landing-page journey. The request header now uses workspace navigation for that handoff, with Home feed, Your profile, and Back to feed instead of public signup actions.
- Profile and portfolio links continue to use the existing profile routes. Example content and images are labelled; fabricated unread-message counts and completion percentages are removed.

## Verification

- Automated coverage: 10 home-state/filter tests, plus the 12 existing auth-return/verification-preview tests.
- ESLint and Next.js production build.
- Browser checks: desktop, tablet, and phone layouts; 320px narrow-screen overflow; search disclosure; avatar menu and Escape; dialog focus return; follow/filter behavior; bookmarks and saved view; both explicit profile states.
- The 21st review reports no errors or warnings; informational color-token advisories remain for scoped illustration/surface colors. Component search was unavailable without 21st sign-in, so the implementation extends existing project components and tokens without importing a new UI dependency.

Screenshots are saved in `output/design-previews/dashboard-desktop.png` and `dashboard-mobile.png`. Changes are local, not pushed or deployed.
