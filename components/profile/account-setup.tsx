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
};

type SetupForm = {
  name: string;
  location: string;
  headline: string;
  role: string;
  about: string;
  isAvailable: boolean;
  publicProfile: boolean;
};

const roles = [
  ["Client", "Post a clear request and compare relevant offers."],
  ["Provider", "Show your expertise and respond to useful work."],
  ["Employer", "Build teams around real business needs."],
  ["Professional", "Find opportunities with a clearer fit."],
  ["Investor", "Follow and support the work network."],
] as const;

const steps = ["About you", "Your role", "Profile context", "Review"];

function safeReturnPath(path: string | null) {
  return path?.startsWith("/") && !path.startsWith("//") ? path : "/home";
}

export function AccountSetup() {
  const searchParams = useSearchParams();
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [form, setForm] = useState<SetupForm>({
    name: "",
    location: "",
    headline: "",
    role: "Client",
    about: "",
    isAvailable: true,
    publicProfile: true,
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
        });
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
    if (step === 1 && !form.role) {
      setError("Choose the role that best fits your current focus.");
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
          <div className="account-setup-aside__note"><b>✦</b><p>You control what is public. Contact details remain private until a conversation has context.</p></div>
        </aside>

        <section className="account-setup-card" aria-labelledby="account-setup-title">
          <div className="account-setup-card__heading"><p>STEP {step + 1} OF {steps.length}</p><h2 id="account-setup-title">{steps[step]}</h2><span>{step === 0 && "Start with the essentials people need to recognise you."}{step === 1 && "Choose the lens that should shape your Requote experience."}{step === 2 && "Set a few boundaries around how your profile appears."}{step === 3 && "Check the details that will shape your starting profile."}</span></div>

          {step === 0 && <div className="account-setup-fields"><label>Display name<input autoComplete="name" value={form.name} onChange={(event) => updateField("name", event.target.value)} placeholder="Your name or business name" /></label><label>Location<input autoComplete="address-level2" value={form.location} onChange={(event) => updateField("location", event.target.value)} placeholder="City, Country" /></label><label>Profile headline <small>Optional</small><input value={form.headline} onChange={(event) => updateField("headline", event.target.value)} placeholder="e.g. Building clear, reliable digital products" /></label></div>}

          {step === 1 && <div className="account-setup-roles" role="radiogroup" aria-label="Your role">{roles.map(([role, description]) => <button className={form.role === role ? "is-selected" : ""} type="button" role="radio" aria-checked={form.role === role} key={role} onClick={() => updateField("role", role)}><i>{form.role === role ? "✓" : ""}</i><span><strong>{role}</strong><small>{description}</small></span></button>)}</div>}

          {step === 2 && <div className="account-setup-fields"><label>About you <small>Optional</small><textarea value={form.about} onChange={(event) => updateField("about", event.target.value)} placeholder="Share the work, opportunities, or conversations you want people to understand." rows={5} /></label><label className="account-setup-choice"><input type="checkbox" checked={form.isAvailable} onChange={(event) => updateField("isAvailable", event.target.checked)} /><span><strong>Open to relevant opportunities</strong><small>Show that you are available for work, requests, or conversations that fit.</small></span></label><label className="account-setup-choice"><input type="checkbox" checked={form.publicProfile} onChange={(event) => updateField("publicProfile", event.target.checked)} /><span><strong>Make my profile discoverable</strong><small>Show your name, public role, and chosen work context to Requote members.</small></span></label></div>}

          {step === 3 && <div className="account-setup-review"><div><span>Name</span><strong>{form.name}</strong></div><div><span>Location</span><strong>{form.location}</strong></div><div><span>Role</span><strong>{form.role}</strong></div><div><span>Headline</span><strong>{form.headline || "Not added yet"}</strong></div><div><span>Availability</span><strong>{form.isAvailable ? "Open to relevant opportunities" : "Paused"}</strong></div><div><span>Profile visibility</span><strong>{form.publicProfile ? "Discoverable to Requote members" : "Private"}</strong></div><p>This is an interactive product preview. Your setup is stored locally in this browser, not yet in a live account service.</p></div>}

          {error && <p className="account-setup-error" role="alert">{error}</p>}
          <footer className="account-setup-actions"><button className="account-setup-back" type="button" disabled={step === 0} onClick={() => { setError(""); setStep((current) => Math.max(current - 1, 0)); }}>Back</button>{step < steps.length - 1 ? <button className="account-setup-next" type="button" onClick={goForward}>Continue <span>→</span></button> : <button className="account-setup-next" type="button" onClick={finishSetup}>Finish setup <span>→</span></button>}</footer>
        </section>
      </main>
    </div>
  );
}
