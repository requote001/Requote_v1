# Requote Account Setup — Complete Stitch/UI Prompt

Copy the prompt below into Stitch. Generate one connected, clickable account setup experience with desktop and mobile frames, role branches, and the required states.

## Prompt

Design the complete account creation and first-time account setup experience for Requote, a trust-first professional network and request-and-offer marketplace launching in Nigeria.

This is not a single registration form. Design a guided, resumable onboarding journey that first creates one Requote account, then asks which role or roles the person wants to use, then collects only the information needed for those roles. Users may add or complete other roles later from their profile checklist. A user should not need separate accounts for being both a requester and a provider.

Create a coherent multi-screen flow, not a collage of unrelated forms. Show how the user moves forward, goes back, skips optional steps, saves progress, and reaches the Requote Home feed with a useful “finish setup later” checklist.

## Product and design principles

- Requote is a professional network and request-and-offer marketplace. The initial core is clients/requesters and providers; employers/professionals are adjacent paths, and investors/partners have an interest path until a dedicated product is approved.
- One account can have multiple roles. Account identity and role profiles are separate concepts.
- Minimize setup friction. Ask for essentials first and progressive-disclose deeper information.
- Never ask the user to create the same account credentials again during profile setup.
- Do not request banking information from every user during signup.
- Do not request card details, bank PINs, OTPs, online banking passwords, or payment credentials in Requote onboarding.
- Provider payout setup is a later, optional, provider-only task and must use the chosen payment provider’s secure hosted onboarding or tokenized flow. The product design should show the handoff/state, not an in-house form collecting raw banking credentials.
- Requesters add a payment method only when they are ready to fund a specific accepted deal through the selected payment provider.
- Do not ask for NIN, BVN, identity document images, or company registration evidence unless a real verification provider, policy, lawful purpose, and secure flow have been approved. Show verification as a later step that may be required before relevant actions.
- Do not claim a person is verified, insured, trusted, guaranteed, or eligible for escrow just because they completed a profile.
- Keep marketing consent separate from required terms/privacy acknowledgement.
- Do not invent fees, refunds, payment protections, identity rules, or eligibility promises.

## Brand system

Use Requote’s current visual language:

- Ink Navy #12203D for important text and trust surfaces.
- Signal Blue #2F5FE0 for primary actions and active states.
- Sky Tint #A9C1F5 for subtle supporting accents.
- Paper #F6F8FC and white for calm surfaces.
- Ember #FF6A3D only for restrained emphasis, not as the dominant color.
- Headings similar to Hanken Grotesk; interface text similar to Plus Jakarta Sans.
- Comfortable spacing, clean form groups, clear progress, restrained borders/shadows, and no excessive gradients or glass effects.
- Use the approved Requote logo asset/wordmark. Do not redraw the mark.
- All fields, steps, and actions must have clear labels, visible focus, accessible error text, and mobile-friendly touch targets.

## Flow overview

Create this path:

Welcome → Create account → Verify email → Basic identity → Choose roles → Role-specific setup → Review and privacy choices → Home feed with setup checklist.

Returning users use a separate Sign in path and must not be sent through account creation again. Include Forgot password and verification-resend states.

Show a persistent step indicator such as “Step 2 of 5” for the core onboarding path. Role-specific steps may add to the progress but should remain short. Include Back, Continue, Save and exit, and Skip for optional sections where appropriate. Save draft progress server-side only after the account exists; do not claim it is saved before then.

## Screens to design

### Screen 1 — Welcome / choose entry

Create a clean entry screen with Requote logo, a short value proposition, and two distinct actions:

- Create account
- Sign in

Supporting copy should describe Requote as a place to connect needs, skills, and opportunities through clearer professional relationships. Do not promise guaranteed work or transactions.

Add links to Terms and Privacy. Include a subtle help/contact link.

### Screen 2 — Create account

Fields:

- Full name.
- Email address.
- Password, entered once.
- Show/hide password control.
- Password requirements displayed before or while typing.
- Required acknowledgement of Terms and Privacy, with links.
- Separate optional marketing updates checkbox, unchecked by default.

Actions:

- Create account.
- Continue with an approved identity provider only if that method is actually selected for implementation; otherwise omit social login buttons.
- Link to Sign in.

Do not ask for profile picture, bank details, organization documents, role-specific data, or phone at this step.

Create validation states for missing name, invalid email, weak password, password mismatch if a confirmation field is used, terms not accepted, duplicate account with safe wording, loading, and server error that preserves entered non-secret fields.

### Screen 3 — Verify email

Show the email address being verified, a clear explanation, a six-digit code entry or confirmation-link state depending on the selected auth design, and actions:

- Verify email / Continue.
- Resend email with cooldown.
- Change email.
- Sign out/use another account.

Include invalid/expired code, resend success, delivery delay, and network error states. Never show an email verification as successful until the auth provider confirms it.

Phone verification is not part of the default signup path. If shown as an optional later contact-security step, explain why it is requested and provide Skip for now unless policy requires it for a specific action.

### Screen 4 — Basic identity

Ask for the minimum reusable account information:

- Display name (pre-filled from full name, editable).
- Profile photo/avatar (optional, with upload, crop, replace, remove, and initials fallback).
- Country (default Nigeria only if confidently inferred; user can change).
- State/city or service location, with searchable selection and “I work remotely / multiple locations” where relevant.
- Optional short introduction, with a helpful character limit.

Do not require photo or biography to enter Home. Include privacy note explaining what is public and what is private. Do not display phone/email publicly by default.

### Screen 5 — Choose role(s)

Title: “How will you use Requote?”

Supporting copy: “Choose one path to start. You can add other roles later using this same account.”

Use accessible selectable cards with a short description and a visually distinct selected state. Allow selecting multiple roles without confusing users about the default active role.

Role choices:

1. Client / requester — “I need products or services.”
2. Provider — “I offer products, services, or skilled work.”
3. Employer — “I hire people or source project talent.”
4. Professional / employee — “I want to present my skills and find work.”
5. Investor / partner — “I want to explore investment or ecosystem partnerships.”

Also include:

- “I do more than one of these” helper.
- “I’m not sure yet” option that allows a general account and defers role selection.
- A note that changing roles does not create another account.
- A role selector review showing selected roles and asking which should be active first.

If multiple roles are chosen, create a shared account identity and separate role-profile steps. Avoid asking the user to repeat their name, email, avatar, or location unnecessarily.

### Screen 6A — Client / requester setup

Collect only information that helps the user post a good request:

- Requesting as: individual or organization (organization name optional unless the user selects organization).
- Main interest/category selections: agriculture, fabrication/welding, construction/skilled trades, digital/technology, logistics/delivery, professional services, and “Other”.
- Typical request location or service location; allow remote/multiple locations.
- Optional preferences: product, service, or both.

Do not ask for bank information, card details, or payment credentials here. Explain that a payment method will be requested only when the user chooses an offer and is ready to fund that deal through the approved payment flow.

Primary action: Continue. Secondary: Skip optional details.

### Screen 6B — Provider setup

Ask the provider whether they operate as:

- Individual professional / sole operator.
- Registered business / organization.

Fields for all providers:

- Public provider/display name.
- Main service/product categories and subcategories.
- Short description of services/products.
- Areas served: city/state, travel radius or multiple locations, and remote/online availability.
- Availability: available now, available from a date, or not currently available.
- Preferred request types or project sizes (optional).
- Portfolio/work samples (optional now, add later).

Additional optional organization fields when registered business is selected:

- Business/organization name.
- Website or business social link.
- Business description.
- Registration number only as an optional future verification field, clearly marked “not required for basic setup” until verification policy exists.

Show a trust checklist as future or optional setup, not completed badges: add work samples, add service area, complete verification when available, set payout method when payments are enabled.

Do not show “Verified” or request identity documents unless the real verification flow is approved.

Do not ask for bank account details during basic provider setup. Add a clearly separated later checklist item “Set up payouts” with copy: “You can add payout details through our payment partner before receiving a payout.” The screen should show a secure-provider handoff state, not fields for card PIN, bank login, or OTP.

### Screen 6C — Employer setup

Ask whether the employer represents an organization or is an individual hiring for a project.

Fields:

- Organization/employer name (required only for organization mode).
- Employer type/industry.
- Hiring or project categories.
- Typical work location and remote/hybrid/on-site preference.
- Hiring intent: full-time, contract/project, temporary, or exploring.
- Optional organization website.
- Optional team size band; do not ask for sensitive financial information.

Business registration and organization verification are later optional/conditional tasks, not basic account requirements. Clearly distinguish a draft employer profile from any verified employer status.

### Screen 6D — Professional / employee setup

Fields:

- Professional headline or role title.
- Skills and categories.
- Short bio/about.
- Experience level or years of experience (optional and user-entered).
- Work preference: full-time, contract/project, part-time, freelance, or open to opportunities.
- Location, remote/hybrid/on-site preference, and availability.
- Portfolio link or work samples (optional).
- CV/resume upload (optional; explain visibility and control; private by default unless user chooses to attach it to an application).

Do not request references, government ID, salary history, or bank details during basic setup.

### Screen 6E — Investor / partner setup

Keep this path an interest/profile flow rather than presenting an investor portal that does not exist.

Fields:

- Investor/partner type: individual investor, fund/firm, strategic partner, advisor, or other.
- Name and organization/firm (if applicable).
- Role/title.
- Areas of interest: marketplace, technology, financial inclusion, logistics, skills/workforce, or other.
- Optional investment stage or partnership focus.
- Optional check-size range only if the user voluntarily shares it; make clear it is private and can be skipped.
- Preferred follow-up channel, using the account email by default.
- Optional note to Requote team.

Do not request bank details, proof of funds, confidential financial statements, or identity documents at onboarding. Do not imply investment solicitation, guaranteed access, or a live investor dashboard.

### Screen 6F — Multiple roles / all roles

When the user selects multiple roles, show a short role checklist and let them complete one path at a time:

- Shared identity fields are already completed once.
- Each role has its own completion status.
- User chooses the first active role.
- User may finish the other role profiles now or later.
- Do not force a huge combined form or require a person to “set up everything” before seeing Home.
- Show a preview of what each role profile makes public.
- Let the user pause after one role and continue to Home with remaining roles marked incomplete.

Example multi-role completion screen: “You’re set up as a Client. Provider profile 2 steps left. Employer profile not started.” Each row has a Continue/Set up later action.

### Screen 7 — Review and privacy

Show a concise review of:

- Account identity and verified email state.
- Selected roles and active role.
- Public profile preview for each completed role.
- Private information, such as email and phone, clearly labelled private.
- Any optional profile fields still incomplete.

Provide Edit actions that return to the relevant step. Provide separate consent controls:

- Required Terms and Privacy acknowledgement.
- Optional marketing email consent, off by default.
- Optional profile visibility choices, with plain-language explanation.

Do not label privacy notice acceptance as marketing consent.

### Screen 8 — Setup complete / next step

Show a reassuring completion screen tailored to the active role:

- Client: “Your account is ready. Describe what you need when you’re ready.” Button: “Go to Home” and secondary “Post a request”.
- Provider: “Your provider profile is started.” Button: “Go to Home” and secondary “Add a work sample”.
- Employer: “Your employer profile is started.” Button: “Go to Home” and secondary “Complete organization profile”.
- Professional: “Your professional profile is started.” Button: “Go to Home” and secondary “Add skills or work samples”.
- Investor/partner: “Thanks for sharing your interest.” Button: “Go to Home” and secondary “Review your interest details”.
- Multi-role: show the active role as ready and the other role checklists as optional next steps.

Clearly indicate if this is account setup only versus full payment/identity verification. Do not show success badges that imply completed KYC or payout setup.

## Home feed setup checklist

After onboarding, show a compact, dismissible checklist on the Home feed:

- Complete profile basics.
- Add role-specific skills/categories.
- Add a profile image or work sample (optional).
- Verify a contact method if required.
- Set up payout method (providers only, later, through payment partner).
- Add a payment method (requester only, at the moment of funding a deal).
- Complete identity/business verification (only if/when the approved provider is integrated and required).

Checklist items must show status: Not started, In progress, Complete, or Not needed. Explain which actions unlock or require each item.

## Shared interaction and validation requirements

- Back and Continue controls on each step.
- Save and exit after account creation.
- Resume incomplete onboarding after next sign-in.
- Skip optional steps without losing entered data.
- Inline validation and a page-level summary when appropriate.
- Preserve non-secret input after recoverable errors.
- Password fields must never be prefilled or displayed in profile settings.
- Email/phone updates require fresh verification.
- Confirm before discarding meaningful edits.
- Support keyboard navigation, screen readers, reduced motion, and 44px mobile touch targets.
- Use progress labels that reflect actual required steps; do not imply skipped optional fields are blocking.

## Responsive deliverables

Create desktop and mobile variants for the entire flow. Mobile should use a compact header, single-column fields, sticky bottom Continue action where useful, and an accessible progress indicator. Role cards should stack naturally, and multi-role selection should remain easy to understand.

## Required prototype states

Include at least:

1. Create-account validation error.
2. Email verification pending and resend success.
3. Basic profile with avatar skipped.
4. Role selection with one role selected.
5. Multi-role selection with Client + Provider selected.
6. Provider individual versus registered-business branch.
7. Employer organization versus individual-project branch.
8. Professional profile with optional private CV upload.
9. Investor interest form with optional fields skipped.
10. Payout setup deferred with secure provider handoff placeholder.
11. Setup complete with unfinished optional role profiles.
12. Home feed checklist with one action in progress.
13. Offline/API error and retry.
14. Returning user sign-in and password-recovery states.

## Component deliverables

Use reusable, clearly named components:

- AuthShell
- AccountCredentialForm
- EmailVerificationStep
- OnboardingProgress
- BasicProfileForm
- RoleSelectionCard
- RoleProfileStep
- OrganizationModeSelector
- AvatarUploader
- CategoryMultiSelect
- LocationSelector
- PrivacyVisibilityControl
- OptionalStepCard
- ProviderPayoutHandoff
- HomeSetupChecklist
- InlineValidationMessage
- MobileStickyActionBar

## Do not design or imply

- A mandatory bank setup screen for every role.
- Raw bank PIN, OTP, online banking login, or card credentials collected by Requote.
- A second password form after signup.
- Mandatory profile photo or CV.
- Verification badges without a real verification provider.
- Completed jobs, reviews, ratings, escrow, investment dashboards, or payment history unless real data/services exist.
- Role-specific flows as separate user accounts.
- Required marketing consent.

## Final quality bar

The complete design should make a new user feel that account setup is understandable and safe. The user should be able to create an account, choose one or more roles, complete the essentials for one role, and reach Home without being forced to provide banking, identity, or business documentation prematurely.

End with clickable navigation between all major screens, meaningful form states, and a clean handoff that a Next.js/React team can implement incrementally.

## End prompt
