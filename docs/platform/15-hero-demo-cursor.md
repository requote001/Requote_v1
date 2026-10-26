# Hero demo cursor choreography

Date: 26 October 2026. Branch: dev. Status: implemented locally; visual browser QA outstanding.

## Experience

The current hero illustration, brand palette, type and Request / Compare / Requote screens stay intact. A small blue decorative cursor scans the example, glides to its existing button, displays a click pulse and advances the illustrative stage. After Requote, it moves to the Request step and repeats.

When a real mouse/trackpad pointer enters the card, the decorative cursor disappears immediately and pending automatic transitions are cancelled. Visitors can use the buttons themselves. Leaving restores the cursor at its last position with a short wake-up wiggle and starts a fresh reading period before the next click. No sound is played.

The cursor shares the card’s transform and targets the actual controls’ local layout offsets. A pointer-transparent, clipped overlay keeps it inside the illustration without intercepting real interaction or clipping the card shadow. Automatic stage changes use local React state; no synthetic DOM clicks, focus changes, navigation, provider messages or requests occur.

## Controls and accessibility

- A compact Pause demo / Play demo control lives beside the illustration’s logo. An explicit pause persists until Play is chosen; it is not undone by moving the pointer away.
- Keyboard focus and keyboard interaction with the example steps stop playback. Escape explicitly pauses. Mouse clicks do not leave playback permanently paused merely because a button retains focus.
- The demo automatically starts after client mount on desktop and touch devices, once it is visible and not being interacted with. Touching the example pauses it again.
- At the product owner's request, the one-time `enableMotionOnLoad` function initializes demo playback even when reduced motion is preferred. This is a deliberate demo-only exception, not visitor consent or a change to OS/browser settings. The owner also requested removal of the Disable motion button: no playback button is shown while reduced-motion autoplay is enabled. Escape and touch interaction can still pause it; Enable motion is available afterward. Pause demo remains available for other visitors. Nothing is stored, and the rest of the landing page retains reduced motion. A later change to the device’s motion preference clears the override. Hover, keyboard focus, offscreen and hidden-tab safeguards still apply. Visibility/pointer updates never re-run initialization or undo an explicit pause.
- Playback stops when the card is mostly outside the viewport or the document is hidden. Event listeners, observers and scheduled beats are cleaned up on unmount.
- The cursor is decorative, aria-hidden and pointer-transparent. Automatic content changes are not an aria-live announcement stream.

## Validation

The dependency-free timing engine has deterministic tests for action ordering, interruption before a pending click, restart from a manually selected phase, stale-action protection, complete loop order, timer cleanup, reduced motion and touch opt-in. Existing account, auth, waitlist and feed tests are also run.

Browser inspection was attempted but rejected by the app’s browser access policy. No alternate browser or indirect inspection was used. Exact cursor alignment, hover/focus transitions and perceived motion quality therefore still need a live visual review; passing timing tests is not a substitute for that review.

Manual review on `/`: wait for an automatic example change; move onto the illustration and confirm it stops; choose any stage; move out and observe the wiggle and continued sequence. Check explicit Pause/Play, Tab navigation, Escape, phone interaction, reduced motion, scrolling away and returning, and a hidden tab.

The 21st workflow guided reuse of the existing illustration and restrained motion styling. Reference search required an unavailable login, so no generated component or runtime dependency was added. This change has not been pushed or deployed.

Follow-up tests cover automatic startup with either motion preference and pointer type, conditional playback controls, disabling/restarting playback, and preservation of interaction/visibility safeguards. All 56 Node tests pass. Automated verification also uses ESLint and a production build. Browser visual QA remains outstanding as described above. The existing parent-directory package-lock build warning is unchanged.
