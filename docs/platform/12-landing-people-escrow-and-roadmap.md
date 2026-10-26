# Landing refinement: people, escrow, and what comes next

## Changes

The existing Requote design system is retained. The hero's orbit lines, layered decorative frame, handwritten annotation, corner arrows, heading underline, decorative captions, and extra example-selector pills are removed. Surplus section labels, role chips, numeric image overlays, and duplicate introductory sections are removed from the rendered page. Functional product-step controls and the minimum explanation needed to identify illustrative content remain.

New sections in `components/landing/landing-details.tsx`, with scoped styles in `landing-details.css`:

- People: three selectable perspectives change the photo, narrative, and role-aware waitlist link. On a phone, selection brings the changed image into view.
- Milestone escrow: a four-step conceptual walkthrough covers agreement, partner-based funding, delivery/review, and conditional release. It also explains the planned evidence and human-review path for disagreements.
- Product development: expandable explanations cover the request assistant, matching/comparison, provider business tools, multi-role professional networking, and communications.

The main landing component also uses the new photography in its audience panels and expands the category rail to six categories. Navigation and footer links expose escrow and the development direction. The page continues to direct public conversion actions to the waitlist.

Escrow, verification, dispute review, AI, matching, and communication features are described as planned, not live services. The walkthrough does not collect payments, authorise transfers, or promise a guarantee. No timelines, payment-partner commitments, or customer testimonials are invented.

## Imagery

Two new editorial assets were generated with the built-in image tool, inspected, then converted to optimised WebP for the project. No existing image was overwritten. These are illustrative people, not claimed customers, team members, or endorsements.

| Asset | Project path | Approximate size |
| --- | --- | --- |
| Collaboration scene | `public/people/collaboration.webp` | 145 KB |
| Photographer portrait | `public/people/photographer.webp` | 85 KB |

Original generated PNGs are retained in the Codex generated-images directory. The website references only the project-local WebP files.

### Collaboration prompt

Use case: photorealistic-natural. Asset type: premium editorial photograph for Requote's Nigerian professional-network landing page. Primary request: three adult Black Nigerian professionals, two women and one man, collaboratively reviewing architectural project drawings around a light oak table in an airy contemporary Lagos creative studio. Candid engaged conversation, one person naturally gesturing toward the plan, the others listening; natural hands and anatomy. Plants, a simple laptop, subtle workshop materials in the background. Warm daylight, honest skin texture, understated cream and navy clothing, lived-in human warmth rather than posed stock photography. Wide landscape composition with people centrally framed, suitable for responsive crops. Professional editorial photography, 35mm lens, subtle film grain, believable everyday detail. No text, no logos, no watermark, no interface, no testimonials, no giant smiles or staged handshake.

### Photographer prompt

Use case: photorealistic-natural. Asset type: editorial people photography for Requote, a Nigerian professional marketplace landing page. Primary request: a confident adult Black Nigerian woman photographer holding a professional camera naturally in both hands, pausing between work in a beautiful sunlit creative studio. Candid three-quarter portrait from waist up, thoughtful warm expression, linen shirt in an understated neutral tone, camera strap, short natural textured hair. Background softly blurred with a few studio tools and warm timber furniture. Premium editorial photography, realistic skin and material texture, soft side daylight, natural anatomy and physically correct camera grip, welcoming and professional, not posed corporate stock. Wide landscape frame, subject centrally placed so portrait and landscape crops both work. No text, no logo, no watermark, no interface, no testimonial or endorsement.

## Interaction and accessibility

All selection controls use native buttons and exposed pressed states. Feature disclosures use native details/summary. Existing keyboard navigation, visible focus, native scrolling, and reduced-motion support are preserved. Mobile image and escrow navigation respect reduced-motion preferences. Images are lazy-loaded with declared dimensions, and text remains HTML rather than being baked into an image.

## Verification

ESLint, Next.js production build, and existing auth/home unit tests are run for this revision. Browser checks cover the clean hero, all escrow stages, perspective switching and image loading, native feature disclosures, category navigation, and mobile/narrow-screen overflow. The 21st review reports informational color advisories but no errors or warnings; reference search remains unavailable without sign-in.

Preview screenshots are saved in `output/design-previews/landing-refined-hero.png`, `landing-refined-people.png`, and `landing-refined-escrow.png`. This is local work; it has not been pushed or deployed.
