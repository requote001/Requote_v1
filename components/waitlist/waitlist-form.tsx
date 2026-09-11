"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import {
  WAITLIST_ROLES,
  type WaitlistIntent,
  type WaitlistRole,
} from "@/lib/waitlist";

const roleOptions: Array<{
  value: WaitlistRole;
  title: string;
  copy: string;
}> = [
  {
    value: "requester",
    title: "A client",
    copy: "I need a product or service.",
  },
  {
    value: "provider",
    title: "A provider",
    copy: "I offer products or services.",
  },
  {
    value: "employer",
    title: "An employer",
    copy: "I want to build a capable team.",
  },
  {
    value: "employee",
    title: "A professional",
    copy: "I am looking for meaningful work.",
  },
  {
    value: "investor",
    title: "An investor",
    copy: "I want to explore Requote’s growth.",
  },
  {
    value: "both",
    title: "More than one",
    copy: "I have more than one role in the network.",
  },
];

const interestOptions: Record<WaitlistRole, string[]> = {
  requester: [
    "Business procurement",
    "Personal projects",
    "Ongoing operational needs",
    "Other",
  ],
  provider: [
    "Agriculture",
    "Fabrication & Welding",
    "Construction & Skilled Trades",
    "Digital & Technology Services",
    "Logistics & Delivery",
    "Professional Services",
    "Other",
  ],
  employer: [
    "Full-time hiring",
    "Contract or project talent",
    "Operations and field teams",
    "Specialist roles",
    "Other",
  ],
  employee: [
    "Skilled trades",
    "Digital and technology",
    "Operations and logistics",
    "Professional services",
    "Other",
  ],
  investor: [
    "Early-stage investment",
    "Strategic partnership",
    "Market and growth research",
    "Advisory and ecosystem support",
    "Other",
  ],
  both: [
    "Products and services",
    "Work and talent",
    "Partnership and investment",
    "Other",
  ],
};

const interestLabels: Record<WaitlistRole, string> = {
  requester: "What do you usually need help with?",
  provider: "What do you provide?",
  employer: "What are you looking to hire for?",
  employee: "What is your career area?",
  investor: "What is your interest in Requote?",
  both: "What are you most interested in?",
};

type ApiResponse = {
  success?: boolean;
  message?: string;
};

export function WaitlistForm() {
  const searchParams = useSearchParams();
  const roleFromQuery = searchParams.get("role");
  const initialRole =
    WAITLIST_ROLES.find((candidate) => candidate === roleFromQuery) ??
    "requester";
  const intent: WaitlistIntent = ["draft", "published"].includes(
    searchParams.get("intent") ?? "",
  )
    ? (searchParams.get("intent") as WaitlistIntent)
    : "general";

  const [role, setRole] = useState<WaitlistRole>(initialRole);
  const [showOptionalDetails, setShowOptionalDetails] = useState(
    initialRole !== "requester",
  );
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [profileInterest, setProfileInterest] = useState("");
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
          serviceCategory: role === "provider" ? profileInterest : "",
          profileInterest,
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
      {intent !== "general" && (
        <div className="waitlist-context">
          <span aria-hidden="true">✦</span>
          <p>{contextMessage}</p>
        </div>
      )}

      <fieldset className="role-picker waitlist-role-picker">
        <legend>I’m joining as</legend>
        {roleOptions.map((option) => (
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
                setProfileInterest("");
                setShowOptionalDetails(option.value !== "requester");
              }}
            />
            <span>
              <strong>{option.title}</strong>
              <small>{option.copy}</small>
            </span>
          </label>
        ))}
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
      </div>

      {showOptionalDetails ? (
        <div
          className="form-grid form-grid--two waitlist-form__optional-fields"
          id="waitlist-optional-details"
        >
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
          <label className="waitlist-form__service-field">
            {interestLabels[role]} <span className="optional">Optional</span>
            <select
              value={profileInterest}
              onChange={(event) => setProfileInterest(event.target.value)}
            >
              <option value="">Select an option</option>
              {interestOptions[role].map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
      ) : (
        <button
          className="waitlist-form__details-toggle"
          type="button"
          aria-expanded="false"
          aria-controls="waitlist-optional-details"
          onClick={() => setShowOptionalDetails(true)}
        >
          <span aria-hidden="true">+</span> Add optional contact details
        </button>
      )}

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
