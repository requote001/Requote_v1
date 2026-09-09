"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import type { WaitlistIntent, WaitlistRole } from "@/lib/waitlist";

const providerCategories = [
  "Agriculture",
  "Fabrication & Welding",
  "Construction & Skilled Trades",
  "Digital & Technology Services",
  "Logistics & Delivery",
  "Professional Services",
  "Other",
];

type ApiResponse = {
  success?: boolean;
  message?: string;
};

export function WaitlistForm() {
  const searchParams = useSearchParams();
  const initialRole: WaitlistRole =
    searchParams.get("role") === "provider" ? "provider" : "requester";
  const intent: WaitlistIntent = ["draft", "published"].includes(
    searchParams.get("intent") ?? "",
  )
    ? (searchParams.get("intent") as WaitlistIntent)
    : "general";

  const [role, setRole] = useState<WaitlistRole>(initialRole);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [serviceCategory, setServiceCategory] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [joined, setJoined] = useState(false);

  const contextMessage = useMemo(() => {
    if (intent === "draft") {
      return "Your request draft is saved on this device. Join the waitlist and we’ll let you know when accounts open.";
    }
    if (intent === "published") {
      return "Your request is ready. Join the waitlist and we’ll invite you when publishing opens.";
    }
    return "No password is needed. Tell us how you plan to use Requote and we’ll keep you informed.";
  }, [intent]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (fullName.trim().length < 2 || !email.includes("@") || !consent) {
      setError(
        "Enter your name and a valid email, then confirm that we may contact you.",
      );
      return;
    }

    setPending(true);
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          role,
          city,
          serviceCategory: role === "requester" ? "" : serviceCategory,
          source: searchParams.get("source") ?? "website",
          utmSource: searchParams.get("utm_source") ?? "",
          utmCampaign: searchParams.get("utm_campaign") ?? "",
          intent,
          consent,
          website: (event.currentTarget.elements.namedItem(
            "website",
          ) as HTMLInputElement | null)?.value,
        }),
      });
      const result = (await response.json()) as ApiResponse;

      if (!response.ok || !result.success) {
        throw new Error(result.message || "We could not save your place.");
      }

      window.localStorage.setItem(
        "requote_waitlist",
        JSON.stringify({ role, joinedAt: new Date().toISOString() }),
      );
      setJoined(true);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "We could not save your place. Please try again.",
      );
    } finally {
      setPending(false);
    }
  }

  if (joined) {
    return (
      <div className="auth-success waitlist-success" role="status">
        <span aria-hidden="true">✓</span>
        <div>
          <p className="product-kicker">Place confirmed</p>
          <h2>You’re on the Requote waitlist.</h2>
        </div>
        <p>
          We’ll contact you at <strong>{email.trim().toLowerCase()}</strong> with
          launch updates and the next steps for early access.
        </p>
        {intent !== "general" && (
          <p className="waitlist-saved-note">
            Your request remains saved privately on this device until account
            access and publishing become available.
          </p>
        )}
        <Link className="product-primary-button" href="/">
          Return to Requote
        </Link>
      </div>
    );
  }

  return (
    <form className="auth-form waitlist-form" onSubmit={submit} noValidate>
      <div className="waitlist-context">
        <span aria-hidden="true">✦</span>
        <p>{contextMessage}</p>
      </div>

      <fieldset className="role-picker waitlist-role-picker">
        <legend>How do you plan to use Requote?</legend>
        <label className={role === "requester" ? "is-selected" : ""}>
          <input
            type="radio"
            name="role"
            value="requester"
            checked={role === "requester"}
            onChange={() => setRole("requester")}
          />
          <span>
            <strong>I need something</strong>
            <small>Post requests and compare offers.</small>
          </span>
        </label>
        <label className={role === "provider" ? "is-selected" : ""}>
          <input
            type="radio"
            name="role"
            value="provider"
            checked={role === "provider"}
            onChange={() => setRole("provider")}
          />
          <span>
            <strong>I provide services</strong>
            <small>Find requests and submit offers.</small>
          </span>
        </label>
      </fieldset>

      <div className="form-grid form-grid--two">
        <label>
          Full name
          <input
            type="text"
            autoComplete="name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Your full name"
            maxLength={100}
            required
          />
        </label>
        <label>
          Phone number <span className="optional">Optional</span>
          <input
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="+234"
            maxLength={30}
          />
        </label>
      </div>

      <label>
        Email address
        <input
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          maxLength={254}
          required
        />
      </label>

      <div className="form-grid form-grid--two">
        <label>
          City or area <span className="optional">Optional</span>
          <input
            type="text"
            autoComplete="address-level2"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            placeholder="e.g. Ikeja, Lagos"
            maxLength={100}
          />
        </label>

        {role !== "requester" && (
          <label>
            Main service <span className="optional">Optional</span>
            <select
              value={serviceCategory}
              onChange={(event) => setServiceCategory(event.target.value)}
            >
              <option value="">Select a category</option>
              {providerCategories.map((category) => (
                <option value={category} key={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <label className="waitlist-honeypot" aria-hidden="true">
        Company website
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </label>

      <label className="checkbox-field">
        <input
          type="checkbox"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          required
        />
        <span>
          I agree that Requote may contact me about early access and launch
          updates. See the <Link href="/privacy">Privacy Policy</Link>.
        </span>
      </label>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <button
        className="product-primary-button"
        type="submit"
        disabled={pending}
      >
        {pending ? "Saving your place…" : "Join the waitlist"}
      </button>

      <p className="waitlist-privacy-note">
        We only collect what we need to manage early access. No password or
        payment information is required.
      </p>
    </form>
  );
}
