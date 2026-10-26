# Landing experience redesign

## Direction

Requote's blue/navy brand extended into a spacious editorial landing page, with photographic categories and a limited lime accent. The page is built in the existing Next.js frontend, with scoped CSS and no new runtime dependencies.

## Interactive sections

- Hero: pointer-responsive product scene, three selectable request examples, and clickable Request / Compare / Requote stages.
- Product story: a sticky desktop preview changes as each chapter enters the viewport. Chapter links support direct navigation. Mobile uses an inline preview for each chapter.
- Audience: five role choices update the story, image, and role-specific waitlist link.
- Categories: a touch/trackpad-friendly horizontal rail with previous/next controls and disabled edge states.
- FAQ: native, keyboard-operable expandable disclosures.
- Navigation: reading progress, section links, a responsive menu, Escape-to-close, outside-click dismissal, and visible focus states.

## Product boundaries

The offer data is explicitly illustrative. The page submits no requests, contacts no providers, and does not represent live escrow or identity verification. Early-access calls to action continue to the existing waitlist. Login and legal routes remain available. Existing metadata, favicon, social-card configuration, and canonical URL are retained.

## Motion and responsiveness

Native scrolling is preserved; there is no scroll hijacking. Scroll listeners are passive and scheduled with requestAnimationFrame. Reduced-motion preferences disable decorative motion, reveal transforms, and animated programmatic scrolling. Reveal content is visible by default before enhancement. Images below the fold are lazy-loaded.

Desktop and mobile checks covered the hero demo, chapter changes, role selection, image loading, FAQ disclosure, mobile menu, and Escape focus return. Width checks at 1440px, 390px, and 320px found no document-level horizontal overflow.

## Verification

- ESLint passes.
- Next.js production build passes, including prerendering.
- 21st deterministic review found informational hardcoded-color advisories; no other rule categories were reported. The brand base uses existing product tokens; local accent and illustration colors are intentionally scoped to this landing experience.
- Reference search was unavailable without a 21st login. No external generated component was imported.

Saved visual previews are in `output/design-previews/landing-desktop.png` and `landing-mobile.png`.

This change is local and has not been pushed or deployed.
