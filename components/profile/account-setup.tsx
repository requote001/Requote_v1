"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type MockMember = {
  authenticated?: boolean;
  name?: string;
  email?: string;
  role?: string;
  profileComplete?: boolean;
  location?: string;
  headline?: string;
  about?: string;
  isAvailable?: boolean;
  publicProfile?: boolean;
  professionalFocus?: string;
  professionalLevel?: string;
  professionalOverview?: string;
  emailVerified?: boolean;
};

type SetupForm = {
  name: string;
  location: string;
  headline: string;
  role: string;
  about: string;
  isAvailable: boolean;
  publicProfile: boolean;
  professionalFocus: string;
  professionalLevel: string;
  professionalOverview: string;
  emailVerified: boolean;
};

const roles = [
  ["Client", "Post a clear request and compare relevant offers."],
  ["Provider", "Show your expertise and respond to useful work."],
  ["Employer", "Build teams around real business needs."],
  ["Professional", "Find opportunities with a clearer fit."],
  ["Investor", "Follow and support the work network."],
] as const;

const professionalLevels = [
  "Entry level / learning",
  "Early career professional",
  "Mid-level professional",
  "Senior specialist",
  "Founder / business owner",
  "Executive / team leader",
  "Established business",
];

const steps = ["About you", "Professional overview", "Your role", "Confirm email", "Review"];

function safeReturnPath(path: string | null) {
  return path?.startsWith("/") && !path.startsWith("//") ? path : "/home";
}

export function AccountSetup() {
  const searchParams = useSearchParams();
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const [form, setForm] = useState<SetupForm>({
    name: "",
    location: "",
    headline: "",
    role: "Client",
    about: "",
    isAvailable: true,
    publicProfile: true,
    professionalFocus: "",
    professionalLevel: "",
    professionalOverview: "",
    emailVerified: false,
  });

  const returnPath = safeReturnPath(searchParams.get("return"));

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const stored = window.localStorage.getItem("requote_mock_auth");
      if (!stored) {
        window.location.replace("/login?next=/account-setup");
        return;
      }

      try {
        const member = JSON.parse(stored) as MockMember;
        if (!member.authenticated) {
          window.location.replace("/login?next=/account-setup");
          return;
        }
        setForm({
          name: member.name || "",
          location: member.location || "Lagos, Nigeria",
          headline: member.headline || "",
          role: member.role || "Client",
          about: member.about || "",
          isAvailable: member.isAvailable ?? true,
          publicProfile: member.publicProfile ?? true,
          professionalFocus: member.professionalFocus || "",
          professionalLevel: member.professionalLevel || "",
          professionalOverview: member.professionalOverview || "",
          emailVerified: member.emailVerified ?? false,
        });
        setEmail(member.email || "your email address");
        setReady(true);
      } catch {
        window.location.replace("/login?next=/account-setup");
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  function updateField<Key extends keyof SetupForm>(key: Key, value: SetupForm[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function goForward() {
    setError("");
    if (step === 0 && (!form.name.trim() || !form.location.trim())) {
      setError("Add your name and location to continue.");
      return;
    }
    if (step === 1 && (!form.professionalFocus.trim() || !form.professionalLevel)) {
      setError("Tell us what you do and choose the level that best describes your experience.");
      return;
    }
    if (step === 2 && !form.role) {
      setError("Choose the role that best fits your current focus.");
      return;
    }
    if (step === 3 && !form.emailVerified) {
      setError("Confirm your email address before finishing setup.");
      return;
    }
    setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  function finishSetup() {
    const stored = window.localStorage.getItem("requote_mock_auth");
    if (!stored) return;

    try {
      const member = JSON.parse(stored) as MockMember;
      window.localStorage.setItem(
        "requote_mock_auth",
        JSON.stringify({
          ...member,
          authenticated: true,
          profileComplete: true,
          name: form.name.trim(),
          location: form.location.trim(),
          headline: form.headline.trim(),
          role: form.role,
          about: form.about.trim(),
          isAvailable: form.isAvailable,
          publicProfile: form.publicProfile,
          professionalFocus: form.professionalFocus.trim(),
          professionalLevel: form.professionalLevel,
          professionalOverview: form.professionalOverview.trim(),
          emailVerified: form.emailVerified,
        }),
      );
      window.location.assign(returnPath);
    } catch {
      setError("We could not save this preview setup. Please try again.");
    }
  }

  if (!ready) {
    return <main className="account-setup-loading" aria-label="Loading account setup"><span /><span /><span /></main>;
  }

  return (
    <div className="account-setup-page">
      <header className="account-setup-topbar">
        <Link className="account-setup-brand" href="/" aria-label="Requote home"><img src="/requote-logo.png" alt="Requote" /></Link>
        <div className="account-setup-progress-label"><span>Account setup</span><b>{step + 1} of {steps.length}</b></div>
        <Link className="account-setup-exit" href="/home?profile=true">Finish later</Link>
      </header>

      <main className="account-setup-shell">
        <aside className="account-setup-aside">
          <p>SET UP YOUR ACCOUNT</p>
          <h1>A little context creates a better start.</h1>
          <span>Choose what people should understand before they decide to connect, work with you, or send an opportunity.</span>
          <ol aria-label="Account setup steps">{steps.map((label, index) => <li className={index === step ? "is-active" : index < step ? "is-complete" : ""} key={label}><i>{index < step ? "✓" : `0${index + 1}`}</i><span>{label}</span></li>)}</ol>
          <div className="account-setup-aside__note"><b>✦</b><p>You control what is public. We confirm your email before your profile is ready to share; contact details remain private.</p></div>
        </aside>

        <section className="account-setup-card" aria-labelledby="account-setup-title">
          <div className="account-setup-card__heading"><p>STEP {step + 1} OF {steps.length}</p><h2 id="account-setup-title">{steps[step]}</h2><span>{step === 0 && "Start with the essentials people need to recognise you."}{step === 1 && "Give people useful context about what you do and the experience you bring."}{step === 2 && "Choose the lens that should shape your Requote experience."}{step === 3 && "Confirm the email address we will use for important account updates."}{step === 4 && "Check the details that will shape your starting profile."}</span></div>

          {step === 0 && <div className="account-setup-fields"><label>Display name<input autoComplete="name" value={form.name} onChange={(event) => updateField("name", event.target.value)} placeholder="Your name or business name" /></label><label>Location<input autoComplete="address-level2" value={form.location} onChange={(event) => updateField("location", event.target.value)} placeholder="City, Country" /></label><label>Short profile headline <small>Optional</small><input value={form.headline} onChange={(event) => updateField("headline", event.target.value)} placeholder="e.g. Building clear, reliable digital products" /></label></div>}

          {step === 1 && <div className="account-setup-fields"><label>What do you do?<input value={form.professionalFocus} onChange={(event) => updateField("professionalFocus", event.target.value)} placeholder="e.g. Product designer for early-stage teams" /></label><label>Professional level<select value={form.professionalLevel} onChange={(event) => updateField("professionalLevel", event.target.value)}><option value="">Choose the closest fit</option>{professionalLevels.map((level) => <option key={level}>{level}</option>)}</select></label><label>Professional overview <small>Optional</small><textarea value={form.professionalOverview} onChange={(event) => updateField("professionalOverview", event.target.value)} placeholder="Share the experience, work, outcomes, or areas you want people to understand." rows={5} /></label><label className="account-setup-choice"><input type="checkbox" checked={form.isAvailable} onChange={(event) => updateField("isAvailable", event.target.checked)} /><span><strong>Open to relevant opportunities</strong><small>Show that you are available for work, requests, or conversations that fit.</small></span></label><label className="account-setup-choice"><input type="checkbox" checked={form.publicProfile} onChange={(event) => updateField("publicProfile", event.target.checked)} /><span><strong>Make my profile discoverable</strong><small>Show your name, public role, and chosen work context to Requote members.</small></span></label></div>}

          {step === 2 && <div className="account-setup-roles" role="radiogroup" aria-label="Your role">{roles.map(([role, description]) => <button className={form.role === role ? "is-selected" : ""} type="button" role="radio" aria-checked={form.role === role} key={role} onClick={() => updateField("role", role)}><i>{form.role === role ? "✓" : ""}</i><span><strong>{role}</strong><small>{description}</small></span></button>)}</div>}

          {step === 3 && <div className="account-setup-email"><div className={`account-setup-email__status ${form.emailVerified ? "is-verified" : ""}`}><i>{form.emailVerified ? "✓" : "@"}</i><div><small>{form.emailVerified ? "EMAIL CONFIRMED" : "EMAIL TO CONFIRM"}</small><strong>{email}</strong><span>{form.emailVerified ? "This address can receive important Requote account updates." : "We use this address for account security and relevant updates."}</span></div></div>{form.emailVerified ? <p className="account-setup-email__confirmed">Your email is confirmed. You can continue to review your profile.</p> : !verificationSent ? <button type="button" onClick={() => { setError(""); setVerificationSent(true); }}>Send verification email <span>→</span></button> : <div className="account-setup-email__sent"><strong>Verification link sent</strong><p>In the live product, you will confirm through the secure link sent to your inbox. Use the preview control below to continue this demo.</p><button type="button" onClick={() => { setError(""); updateField("emailVerified", true); }}>Confirm email in preview <span>→</span></button></div>}</div>}

          {step === 4 && <div className="account-setup-review"><div><span>Name</span><strong>{form.name}</strong></div><div><span>Location</span><strong>{form.location}</strong></div><div><span>What you do</span><strong>{form.professionalFocus}</strong></div><div><span>Professional level</span><strong>{form.professionalLevel}</strong></div><div><span>Role</span><strong>{form.role}</strong></div><div><span>Email</span><strong>{form.emailVerified ? "Confirmed" : "Not confirmed"}</strong></div><div><span>Availability</span><strong>{form.isAvailable ? "Open to relevant opportunities" : "Paused"}</strong></div><div><span>Profile visibility</span><strong>{form.publicProfile ? "Discoverable to Requote members" : "Private"}</strong></div><p>This is an interactive product preview. Your setup is stored locally in this browser, not yet in a live account service.</p></div>}

          {error && <p className="account-setup-error" role="alert">{error}</p>}
          <footer className="account-setup-actions"><button className="account-setup-back" type="button" disabled={step === 0} onClick={() => { setError(""); setStep((current) => Math.max(current - 1, 0)); }}>Back</button>{step < steps.length - 1 ? <button className="account-setup-next" type="button" onClick={goForward}>Continue <span>→</span></button> : <button className="account-setup-next" type="button" onClick={finishSetup}>Finish setup <span>→</span></button>}</footer>
        </section>
      </main>
    </div>
  );
}
