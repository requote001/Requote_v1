"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { WAITLIST_ROLES, type WaitlistRole } from "@/lib/waitlist";
import {
  waitlistRoleOptions,
  waitlistInterests,
  waitlistInterestLabels,
  waitlistIntent,
  waitlistFieldIssues,
  waitlistPayload,
  requestWaitlistJoin,
  rememberWaitlistJoin,
} from "@/lib/waitlist-form";

export function WaitlistForm() {
  const query = useSearchParams();
  const initialRole =
    WAITLIST_ROLES.find((value) => value === query.get("role")) || "requester";
  const preview = query.get("preview") === "1";
  const [role, setRole] = useState<WaitlistRole>(initialRole);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [interests, setInterests] = useState<
    Partial<Record<WaitlistRole, string>>
  >({});
  const [consent, setConsent] = useState(false);
  const [issues, setIssues] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [joined, setJoined] = useState(
    preview && query.get("state") === "success",
  );
  const submitting = useRef(false);
  const successRef = useRef<HTMLHeadingElement>(null);
  const intent = waitlistIntent(query);

  function clearIssue(key: string) {
    setIssues((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const values = {
      fullName,
      email,
      phone,
      city,
      role,
      profileInterest: interests[role] || "",
      consent,
    };
    const fields = waitlistFieldIssues(values);
    setIssues(fields);
    setError("");
    if (Object.keys(fields).length) {
      document.getElementById("waitlist-" + Object.keys(fields)[0])?.focus();
      return;
    }
    const website =
      (
        event.currentTarget.elements.namedItem(
          "website",
        ) as HTMLInputElement | null
      )?.value || "";
    submitting.current = true;
    setPending(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      if (preview) {
        // Isolated visual QA: never submits to the endpoint or writes a marker.
        if (query.get("state") === "error")
          throw new Error(
            "Example connection issue. No signup was submitted.",
          );
      } else {
        await requestWaitlistJoin(
          waitlistPayload(values, query, website),
          fetch,
          controller.signal,
        );
        try {
          rememberWaitlistJoin(window.localStorage, role);
        } catch {
          /* Browser storage is optional. */
        }
      }
      setJoined(true);
      requestAnimationFrame(() => successRef.current?.focus());
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "We couldn’t confirm your place. Please try again.",
      );
    } finally {
      clearTimeout(timeout);
      submitting.current = false;
      setPending(false);
    }
  }

  if (joined)
    return (
      <div className="waitlist-confirmation">
        {preview && (
          <p className="waitlist-preview" role="note">
            Design preview · No signup has been created.
          </p>
        )}
        <div className="waitlist-confirmation-icon" aria-hidden="true">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
          >
            <path d="m5 12 4 4L19 6" />
          </svg>
        </div>
        <p className="waitlist-label">
          {preview ? "CONFIRMATION DESIGN" : "YOU’RE ON THE LIST"}
        </p>
        <h2 id="waitlist-form-title" tabIndex={-1} ref={successRef}>
          A good place
          <br />
          to begin.
        </h2>
        <p>
          {preview
            ? "This is how your confirmation will look. "
            : "Your place on the Requote waitlist is confirmed. "}
          We’ll share early-access news and next steps at{" "}
          <strong>
            {email.trim().toLowerCase() || "preview@requote.example.invalid"}
          </strong>
          .
        </p>
        <ol className="waitlist-next-steps">
          <li>
            <span>01</span>
            <div>
              <strong>You’re part of the beginning.</strong>
              <p>Access will open in stages, starting in Nigeria.</p>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              <strong>We’ll keep you in the loop.</strong>
              <p>Look out for updates from Requote about what comes next.</p>
            </div>
          </li>
        </ol>
        {intent !== "general" && (
          <p className="waitlist-context-note">
            Joining the waitlist doesn’t publish a request. Any saved draft
            stays on the device where you created it.
          </p>
        )}
        <Link href="/" className="waitlist-submit">
          Explore Requote <span aria-hidden="true">↗</span>
        </Link>
        <p className="waitlist-small-note">
          No account or password has been created.
        </p>
      </div>
    );

  return (
    <form
      className="waitlist-signup"
      onSubmit={submit}
      noValidate
      aria-labelledby="waitlist-form-title"
      aria-busy={pending}
    >
      {preview && (
        <p className="waitlist-preview" role="note">
          Design preview · Nothing will be submitted.
        </p>
      )}
      <div className="waitlist-form-heading">
        <p className="waitlist-label">EARLY ACCESS · NIGERIA</p>
        <h2 id="waitlist-form-title">
          Your next chapter
          <br />
          starts here.
        </h2>
        <p>Join the waitlist. We’ll let you know when it’s your turn.</p>
      </div>
      {intent !== "general" && (
        <p className="waitlist-context-note">
          {intent === "draft"
            ? "Here for your request draft?"
            : "Ready to share a request?"}{" "}
          Join early access to hear when accounts and publishing open. Joining
          won’t publish your request.
        </p>
      )}
      {Object.keys(issues).length > 0 && (
        <div className="waitlist-error-summary" role="alert">
          <strong>Please check the highlighted details.</strong>
          <ul>
            {Object.entries(issues).map(([key, message]) => (
              <li key={key}>
                <a href={"#waitlist-" + key}>{message}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <fieldset className="waitlist-controls" disabled={pending}>
        <legend className="waitlist-sr-only">Your early-access details</legend>
        <div className="waitlist-identity-fields">
          <label className="waitlist-field" htmlFor="waitlist-fullName">
            <span>Full name</span>
            <input
              id="waitlist-fullName"
              type="text"
              autoComplete="name"
              placeholder="Your full name"
              maxLength={100}
              value={fullName}
              required
              aria-invalid={Boolean(issues.fullName)}
              aria-describedby={
                issues.fullName ? "waitlist-fullName-error" : undefined
              }
              onChange={(event) => {
                setFullName(event.target.value);
                clearIssue("fullName");
              }}
            />
            {issues.fullName && (
              <small
                id="waitlist-fullName-error"
                className="waitlist-field-error"
              >
                {issues.fullName}
              </small>
            )}
          </label>
          <label className="waitlist-field" htmlFor="waitlist-email">
            <span>Email address</span>
            <input
              id="waitlist-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              maxLength={254}
              value={email}
              required
              aria-invalid={Boolean(issues.email)}
              aria-describedby={
                issues.email ? "waitlist-email-error" : undefined
              }
              onChange={(event) => {
                setEmail(event.target.value);
                clearIssue("email");
              }}
            />
            {issues.email && (
              <small id="waitlist-email-error" className="waitlist-field-error">
                {issues.email}
              </small>
            )}
          </label>
        </div>
        <fieldset
          className="waitlist-roles"
          id="waitlist-role"
          tabIndex={-1}
          aria-describedby="waitlist-role-description"
        >
          <legend>How would you like to use Requote?</legend>
          <div className="waitlist-role-options">
            {waitlistRoleOptions.map((option) => (
              <label
                className={role === option.value ? "is-selected" : ""}
                key={option.value}
              >
                <input
                  type="radio"
                  name="role"
                  value={option.value}
                  checked={role === option.value}
                  onChange={() => {
                    setRole(option.value);
                    clearIssue("role");
                  }}
                />
                <span>{option.title}</span>
              </label>
            ))}
          </div>
          <p id="waitlist-role-description">
            {waitlistRoleOptions.find((option) => option.value === role)?.copy}
          </p>
        </fieldset>
        <details className="waitlist-optional">
          <summary>
            Add a little more context <span>Optional</span>
            <svg
              aria-hidden="true"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </summary>
          <div className="waitlist-optional-fields">
            <div className="waitlist-identity-fields">
              <label className="waitlist-field" htmlFor="waitlist-city">
                <span>City or area</span>
                <input
                  id="waitlist-city"
                  autoComplete="address-level2"
                  placeholder="e.g. Ikeja, Lagos"
                  maxLength={100}
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                />
              </label>
              <label className="waitlist-field" htmlFor="waitlist-phone">
                <span>Phone number</span>
                <input
                  id="waitlist-phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+234"
                  maxLength={30}
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                />
              </label>
            </div>
            <label className="waitlist-field" htmlFor="waitlist-interest">
              <span>{waitlistInterestLabels[role]}</span>
              <select
                id="waitlist-interest"
                value={interests[role] || ""}
                onChange={(event) =>
                  setInterests((current) => ({
                    ...current,
                    [role]: event.target.value,
                  }))
                }
              >
                <option value="">Select an option</option>
                {waitlistInterests[role].map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <p className="waitlist-small-note">
              These details help us understand who we’re building for.
            </p>
          </div>
        </details>
        <div className="waitlist-trap" aria-hidden="true">
          <label htmlFor="waitlist-website">Company website</label>
          <input
            id="waitlist-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <div>
          <label className="waitlist-consent" htmlFor="waitlist-consent">
            <input
              id="waitlist-consent"
              type="checkbox"
              checked={consent}
              required
              aria-invalid={Boolean(issues.consent)}
              aria-describedby={
                issues.consent ? "waitlist-consent-error" : undefined
              }
              onChange={(event) => {
                setConsent(event.target.checked);
                clearIssue("consent");
              }}
            />
            <span>
              I agree to receive early-access and launch updates from Requote.
              See our <Link href="/privacy">Privacy Policy</Link>.
            </span>
          </label>
          {issues.consent && (
            <p id="waitlist-consent-error" className="waitlist-field-error">
              {issues.consent}
            </p>
          )}
        </div>
        {error && (
          <p className="waitlist-service-error" role="alert">
            {error} Your entries have been kept so you can retry.
          </p>
        )}
        <button className="waitlist-submit" type="submit" disabled={pending}>
          {pending ? "Saving your place…" : "Join the waitlist"}
          {pending ? (
            <span className="waitlist-spinner" aria-hidden="true" />
          ) : (
            <span aria-hidden="true">↗</span>
          )}
        </button>
        <p className="waitlist-small-note waitlist-reassurance">
          <svg
            aria-hidden="true"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <rect x="5" y="10" width="14" height="11" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          </svg>
          No password. No payment details. Just a place to start.
        </p>
      </fieldset>
    </form>
  );
}
