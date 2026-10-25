"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ChangeEvent,
  type ReactNode,
} from "react";
import { useSearchParams } from "next/navigation";
import {
  AUTH_PREVIEW_KEY,
  authPreviewHref,
  safeAuthReturnPath,
} from "@/lib/auth-preview";
import {
  SETUP_ROLES,
  SETUP_STEPS,
  PROFESSIONAL_LEVELS,
  normaliseSetup,
  setupIssues,
  allSetupIssues,
  changeSetupRole,
  visibleRoleFields,
  setupRoleLabel,
  readSetupDraft,
  writeSetupDraft,
  completeLocalSetup,
  avatarFileIssue,
  type SetupForm,
  type SetupRole,
} from "@/lib/account-setup";
import "./account-setup-flow.css";

const fixtureEmail = "alex@requote.example.invalid";
const descriptions = [
  "Start with the essentials. Your photo and headline can wait.",
  "Tell people what you do, what you’ve learned, and where you want to go.",
  "You don’t have to fit into one box. Select every role that fits you.",
  "Keep email confirmation separate from identity verification.",
  "A final look at your details, roles, and visibility preferences.",
];

function returnDestination(value: string | null) {
  const url = new URL(safeAuthReturnPath(value), "https://requote.invalid");
  if (
    ["/account-setup", "/login", "/create-account", "/verify-email"].includes(
      url.pathname,
    )
  )
    return "/home";
  if (["/home", "/profile"].includes(url.pathname))
    url.searchParams.delete("profile");
  return url.pathname + url.search + url.hash;
}

export function AccountSetup() {
  const params = useSearchParams();
  const isolated = params.get("preview") === "1";
  const emailState = params.get("emailStatus") || "pending";
  const returnPath = returnDestination(params.get("return"));
  const setupHref = "/account-setup?return=" + encodeURIComponent(returnPath);
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<SetupForm>(() => normaliseSetup());
  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [issues, setIssues] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [savedAt, setSavedAt] = useState("");
  const [dirty, setDirty] = useState(false);
  const [done, setDone] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [photoBusy, setPhotoBusy] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const mounted = useRef(false);
  const unsaved = useRef(false);
  const verified = isolated ? emailState === "verified" : emailVerified;

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const member = isolated
          ? { authenticated: true, email: fixtureEmail, name: "Alex Morgan" }
          : JSON.parse(localStorage.getItem(AUTH_PREVIEW_KEY) || "null");
        if (!member?.authenticated || !member.email) {
          window.location.replace(authPreviewHref("/login", setupHref));
          return;
        }
        setEmail(member.email);
        setForm(normaliseSetup(member));
        setEmailVerified(member.emailVerified === true);
        try {
          const draft = readSetupDraft(localStorage, member.email);
          if (draft) {
            setForm(draft.form);
            setStep(draft.step);
            setSavedAt(draft.savedAt);
            setNotice("Your saved setup is ready to continue.");
          }
        } catch {
          setError(
            "We couldn’t load your saved draft. Your existing profile is unchanged. Enter your details again and save a new draft.",
          );
        }
        setReady(true);
      } catch {
        setError(
          "Browser storage is unavailable. Allow local storage, then reload to continue the setup preview.",
        );
        setReady(true);
      }
    });
    return () => cancelAnimationFrame(frame);
    // Fixture-status links change only the illustration, never the draft.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isolated]);

  useEffect(() => {
    if (mounted.current && ready) titleRef.current?.focus();
    mounted.current = ready;
  }, [step, ready, done]);
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);
  useEffect(() => {
    unsaved.current = dirty;
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      if (!unsaved.current) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function update<Key extends keyof SetupForm>(
    key: Key,
    value: SetupForm[Key],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    setDirty(true);
    setNotice("");
    setIssues((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  }
  function move(next: number) {
    setIssues({});
    setError("");
    setNotice("");
    setStep(next);
  }
  function save(nextStep = step) {
    try {
      if (!isolated) {
        const current = JSON.parse(
          localStorage.getItem(AUTH_PREVIEW_KEY) || "null",
        );
        if (
          !current?.authenticated ||
          current.email?.toLowerCase() !== email.toLowerCase()
        )
          throw new Error(
            "Your preview account changed. Sign in again before saving.",
          );
      }
      const draft = writeSetupDraft(localStorage, email, form, nextStep);
      setSavedAt(draft.savedAt);
      setDirty(false);
      unsaved.current = false;
      setError("");
      setNotice("Progress saved in this browser. You can return to it later.");
      return true;
    } catch (failure) {
      setError(
        failure instanceof Error && failure.message.includes("account changed")
          ? failure.message
          : "Your progress couldn’t be saved. Your entries are still here. Check browser storage or try a smaller photo, then retry.",
      );
      return false;
    }
  }
  function flag(fields: Record<string, string>) {
    setIssues(fields);
    requestAnimationFrame(() =>
      document.getElementById("setup-" + Object.keys(fields)[0])?.focus(),
    );
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (photoBusy || !email) return;
    setError("");
    setNotice("");
    const fields =
      step === 4
        ? allSetupIssues(form, verified)
        : setupIssues(form, step, verified);
    if (Object.keys(fields).length) {
      if (step === 4) {
        const first = [0, 1, 2, 3].find(
          (index) => Object.keys(setupIssues(form, index, verified)).length,
        );
        if (first !== undefined) setStep(first);
      }
      flag(fields);
      return;
    }
    if (step < 4) {
      if (save(step + 1)) {
        setIssues({});
        setStep(step + 1);
      }
      return;
    }
    try {
      if (isolated) {
        if (!save(4)) return;
        setDone(true);
        setDirty(false);
        return;
      }
      // Local UI preview only. Re-read the account and its email state before
      // finishing; query fixtures never authorize or verify a real account.
      completeLocalSetup(localStorage, AUTH_PREVIEW_KEY, email, form);
      setDirty(false);
      unsaved.current = false;
      window.location.assign(returnPath);
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : "Setup couldn’t be saved. Please try again.",
      );
    }
  }
  async function choosePhoto(file?: File) {
    if (!file) return;
    const issue = avatarFileIssue(file.type, file.size);
    if (issue) {
      setIssues((current) => ({ ...current, photo: issue }));
      return;
    }
    setPhotoBusy(true);
    try {
      const data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      await new Promise<void>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve();
        image.onerror = reject;
        image.src = data;
      });
      update("avatarDataUrl", data);
      setIssues((current) => {
        const next = { ...current };
        delete next.photo;
        return next;
      });
    } catch {
      setIssues((current) => ({
        ...current,
        photo: "This image couldn’t be opened. Try another JPG, PNG, or WebP.",
      }));
    } finally {
      setPhotoBusy(false);
    }
  }
  function refreshEmail() {
    try {
      if (isolated) {
        setNotice(
          "This is an isolated design fixture. Use the email-state links below to review each screen.",
        );
        return;
      }
      const latest = JSON.parse(
        localStorage.getItem(AUTH_PREVIEW_KEY) || "null",
      );
      if (
        !latest?.authenticated ||
        latest.email?.toLowerCase() !== email.toLowerCase()
      )
        throw new Error();
      setEmailVerified(latest.emailVerified === true);
      setIssues({});
      setNotice(
        latest.emailVerified
          ? "The local preview is email-confirmed. Live verification is not connected."
          : "This preview email is not confirmed yet. No email has been sent.",
      );
    } catch {
      setError(
        "We couldn’t check this preview account. Sign in again before continuing.",
      );
    }
  }
  function field(
    key: keyof SetupForm,
    label: string,
    options: {
      optional?: boolean;
      placeholder?: string;
      multiline?: boolean;
      max?: number;
      choices?: readonly string[];
      autocomplete?: string;
    } = {},
  ) {
    const id = "setup-" + key;
    const common = {
      id,
      value: String(form[key]),
      "aria-invalid": Boolean(issues[key]),
      "aria-describedby": issues[key] ? id + "-error" : undefined,
      onChange: (
        event: ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
      ) => update(key, event.target.value),
      required: !options.optional,
    };
    return (
      <label className="setup-field" htmlFor={id}>
        <span>
          {label}
          {options.optional && <small>Optional</small>}
        </span>
        {options.choices ? (
          <select {...common}>
            <option value="">Choose the closest fit</option>
            {options.choices.map((choice) => (
              <option key={choice}>{choice}</option>
            ))}
          </select>
        ) : options.multiline ? (
          <textarea
            {...common}
            placeholder={options.placeholder}
            rows={4}
            maxLength={options.max}
          />
        ) : (
          <input
            {...common}
            placeholder={options.placeholder}
            maxLength={options.max}
            autoComplete={options.autocomplete || "off"}
          />
        )}
        <FieldError id={id} error={issues[key]} />
      </label>
    );
  }

  if (!ready)
    return (
      <main
        className="account-setup-loading"
        aria-label="Loading account setup"
      >
        <span />
        <span />
        <span />
      </main>
    );
  return (
    <div className="account-setup-page setup-v2">
      <header className="account-setup-topbar">
        <Link
          className="account-setup-brand"
          href={isolated ? "/" : "/home"}
          aria-label="Requote home"
        >
          <img src="/requote-logo.png" alt="Requote" />
        </Link>
        <div className="account-setup-progress-label">
          <span>Account setup</span>
          <b>{step + 1} of 5</b>
        </div>
        <button
          className="account-setup-exit"
          type="button"
          disabled={!email || photoBusy}
          onClick={() => {
            if (save()) {
              if (isolated)
                setNotice("Preview saved. Your real account has not changed.");
              else window.location.assign(returnPath);
            }
          }}
        >
          Save & leave
        </button>
      </header>
      <div className="setup-preview-note">
        {isolated
          ? "Isolated design preview · No account changes. Saved only in this browser."
          : "Local account preview · Saved only in this browser. Live account services are not connected."}
      </div>
      <main className="account-setup-shell">
        <aside className="account-setup-aside">
          <p>YOUR NEXT CHAPTER</p>
          <h1>
            A little context.
            <br /> A better connection.
          </h1>
          <span>
            One profile for everything you bring. Set your direction, choose
            your roles, and make room for the right conversations.
          </span>
          <ol aria-label="Account setup steps">
            {SETUP_STEPS.map((label, index) => {
              const complete =
                Object.keys(setupIssues(form, index, verified)).length === 0 &&
                index < 4;
              return (
                <li
                  key={label}
                  className={
                    index === step ? "is-active" : complete ? "is-complete" : ""
                  }
                >
                  <button
                    type="button"
                    aria-label={`Step ${index + 1}: ${label}`}
                    aria-current={index === step ? "step" : undefined}
                    onClick={() => move(index)}
                  >
                    <i aria-hidden="true">
                      {complete && index !== step ? "✓" : `0${index + 1}`}
                    </i>
                    <span>{label}</span>
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="account-setup-aside__note">
            <b aria-hidden="true">◇</b>
            <p>
              Build your profile now. Verify your identity later. No bank
              details, identity documents, or payment setup needed here.
            </p>
          </div>
        </aside>
        <section
          className="account-setup-card"
          aria-labelledby="account-setup-title"
        >
          {done ? (
            <div className="setup-success">
              <span aria-hidden="true">✓</span>
              <p>DESIGN PREVIEW COMPLETE</p>
              <h2 id="account-setup-title" ref={titleRef} tabIndex={-1}>
                Everything has its place.
              </h2>
              <p>
                {form.name}, your {form.roles.map(setupRoleLabel).join(", ")}{" "}
                setup is ready for review. No real account was changed and no
                email was sent.
              </p>
              <button
                className="account-setup-next"
                type="button"
                onClick={() => {
                  setDone(false);
                  move(4);
                }}
              >
                Review your preview
              </button>
              <Link href="/">Back to Requote</Link>
            </div>
          ) : (
            <form noValidate onSubmit={submit}>
              <div className="account-setup-card__heading">
                <p>STEP {step + 1} OF 5</p>
                <h2 id="account-setup-title" ref={titleRef} tabIndex={-1}>
                  {SETUP_STEPS[step]}
                </h2>
                <span>{descriptions[step]}</span>
              </div>
              {error && (
                <p className="setup-alert" role="alert">
                  {error}
                </p>
              )}
              {Object.keys(issues).length > 0 && (
                <div className="setup-alert" role="alert">
                  <strong>A little more detail is needed.</strong>
                  <ul>
                    {Object.entries(issues).map(([key, value]) => (
                      <li key={key}>
                        <a href={"#setup-" + key}>{value}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {step === 0 && (
                <div className="account-setup-fields">
                  <div className="setup-photo">
                    <div className="setup-photo-avatar">
                      {form.avatarDataUrl ? (
                        <img
                          src={form.avatarDataUrl}
                          alt="Your chosen profile photo"
                        />
                      ) : (
                        <span aria-hidden="true">
                          {form.name
                            .trim()
                            .split(/\s+/)
                            .slice(0, 2)
                            .map((part) => part[0])
                            .join("")
                            .toUpperCase() || "You"}
                        </span>
                      )}
                    </div>
                    <div>
                      <strong>
                        Profile photo <small>Optional</small>
                      </strong>
                      <label
                        className="setup-photo-button"
                        htmlFor="setup-photo"
                      >
                        {photoBusy ? "Opening image…" : "Choose photo"}
                        <input
                          id="setup-photo"
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          disabled={photoBusy}
                          onChange={(event) => {
                            void choosePhoto(event.target.files?.[0]);
                            event.target.value = "";
                          }}
                          aria-describedby="setup-photo-hint setup-photo-error"
                        />
                      </label>
                      {form.avatarDataUrl && (
                        <button
                          type="button"
                          className="setup-text-button"
                          onClick={() => update("avatarDataUrl", "")}
                        >
                          Remove
                        </button>
                      )}
                      <p id="setup-photo-hint">
                        JPG, PNG, or WebP · Up to 500 KB.
                        <br />
                        Stored locally for this preview, not uploaded.
                      </p>
                      <FieldError id="setup-photo" error={issues.photo} />
                    </div>
                  </div>
                  {field("name", "Display name", {
                    placeholder: "Your name",
                    max: 100,
                    autocomplete: "name",
                  })}
                  {field("location", "City and country", {
                    placeholder: "e.g. Lagos, Nigeria",
                    max: 120,
                    autocomplete: "address-level2",
                  })}
                  {field("headline", "Short headline", {
                    optional: true,
                    placeholder: "e.g. Product designer helping growing teams",
                    max: 140,
                  })}
                </div>
              )}
              {step === 1 && (
                <div className="account-setup-fields">
                  {field("professionalFocus", "What do you do?", {
                    placeholder:
                      "Your profession, expertise, or business focus",
                    max: 160,
                  })}
                  {field("professionalLevel", "Professional level", {
                    choices: PROFESSIONAL_LEVELS,
                  })}
                  {field("professionalOverview", "Your story so far", {
                    optional: true,
                    multiline: true,
                    placeholder:
                      "Share the work, experience, and outcomes you want people to know about.",
                    max: 1200,
                  })}
                  {field("skills", "Skills and strengths", {
                    optional: true,
                    placeholder: "e.g. Research, project delivery, fabrication",
                    max: 300,
                  })}
                  <p className="setup-field-hint">
                    Separate skills with commas. No CV or proof of work is
                    required.
                  </p>
                  <label className="account-setup-choice">
                    <input
                      type="checkbox"
                      checked={form.isAvailable}
                      onChange={(event) =>
                        update("isAvailable", event.target.checked)
                      }
                    />
                    <span>
                      <strong>Open to relevant opportunities</strong>
                      <small>
                        Show that you welcome work, requests, or conversations
                        that fit.
                      </small>
                    </span>
                  </label>
                  <label className="account-setup-choice">
                    <input
                      type="checkbox"
                      checked={form.publicProfile}
                      onChange={(event) =>
                        update("publicProfile", event.target.checked)
                      }
                    />
                    <span>
                      <strong>Discoverable to Requote members</strong>
                      <small>
                        Share your name, headline, location, roles, and
                        overview. Email stays private. Off by default in this
                        preview.
                      </small>
                    </span>
                  </label>
                </div>
              )}
              {step === 2 && (
                <div className="setup-role-content">
                  <fieldset
                    id="setup-roles"
                    tabIndex={-1}
                    className="setup-role-selector"
                    aria-describedby={
                      issues.roles ? "setup-roles-error" : undefined
                    }
                  >
                    <legend>How would you like to use Requote?</legend>
                    <p>
                      Select one or more. You can add or remove roles later.
                    </p>
                    <div className="setup-role-grid">
                      {SETUP_ROLES.map((role) => (
                        <label
                          key={role.id}
                          className={
                            form.roles.includes(role.id) ? "is-selected" : ""
                          }
                        >
                          <input
                            type="checkbox"
                            checked={form.roles.includes(role.id)}
                            onChange={() => {
                              setForm((current) =>
                                changeSetupRole(current, role.id),
                              );
                              setDirty(true);
                              setIssues({});
                              setNotice("");
                            }}
                          />
                          <span>
                            <strong>{role.label}</strong>
                            <small>{role.description}</small>
                          </span>
                        </label>
                      ))}
                    </div>
                    <FieldError id="setup-roles" error={issues.roles} />
                  </fieldset>
                  {form.roles.length > 0 && (
                    <label className="setup-field" htmlFor="setup-primaryRole">
                      <span>Primary role</span>
                      <select
                        id="setup-primaryRole"
                        value={form.primaryRole}
                        onChange={(event) =>
                          update("primaryRole", event.target.value as SetupRole)
                        }
                      >
                        {form.roles.map((role) => (
                          <option key={role} value={role}>
                            {setupRoleLabel(role)}
                          </option>
                        ))}
                      </select>
                      <small>
                        Your starting point in the feed. Switch between your
                        selected roles at any time.
                      </small>
                      <FieldError
                        id="setup-primaryRole"
                        error={issues.primaryRole}
                      />
                    </label>
                  )}
                  {form.roles.map((role) => (
                    <fieldset key={role} className="setup-role-details">
                      <legend>
                        {setupRoleLabel(role)} details
                        {role === form.primaryRole && <small>Primary</small>}
                      </legend>
                      <div className="account-setup-fields">
                        {visibleRoleFields(role, form.roleDetails[role]).map(
                          (config) => {
                            const key = `${role}.${config.key}`,
                              id = "setup-" + key;
                            const common = {
                              id,
                              value: form.roleDetails[role][config.key] || "",
                              "aria-invalid": Boolean(issues[key]),
                              "aria-describedby": issues[key]
                                ? id + "-error"
                                : config.hint
                                  ? id + "-hint"
                                  : undefined,
                              required: config.required,
                              onChange: (
                                event: ChangeEvent<
                                  | HTMLInputElement
                                  | HTMLTextAreaElement
                                  | HTMLSelectElement
                                >,
                              ) => {
                                update("roleDetails", {
                                  ...form.roleDetails,
                                  [role]: {
                                    ...form.roleDetails[role],
                                    [config.key]: event.target.value,
                                  },
                                });
                                setIssues((current) => {
                                  const next = { ...current };
                                  delete next[key];
                                  return next;
                                });
                              },
                            };
                            return (
                              <label
                                className="setup-field"
                                key={key}
                                htmlFor={id}
                              >
                                <span>
                                  {config.label}
                                  {!config.required && <small>Optional</small>}
                                </span>
                                {config.kind === "select" ? (
                                  <select {...common}>
                                    <option value="">Select an option</option>
                                    {config.options?.map((option) => (
                                      <option key={option}>{option}</option>
                                    ))}
                                  </select>
                                ) : config.kind === "textarea" ? (
                                  <textarea
                                    {...common}
                                    rows={3}
                                    maxLength={1200}
                                    placeholder={config.placeholder}
                                  />
                                ) : (
                                  <input
                                    {...common}
                                    maxLength={300}
                                    placeholder={config.placeholder}
                                  />
                                )}
                                {config.hint && (
                                  <small id={id + "-hint"}>{config.hint}</small>
                                )}
                                <FieldError id={id} error={issues[key]} />
                              </label>
                            );
                          },
                        )}
                      </div>
                      {role === "provider" && (
                        <p className="setup-field-hint">
                          Payout setup comes later through a secure payment
                          partner. Don’t enter bank or card details here.
                        </p>
                      )}
                      {role === "investor" && (
                        <p className="setup-field-hint">
                          These interests shape your profile, not an investment
                          account or a commitment to invest.
                        </p>
                      )}
                    </fieldset>
                  ))}
                  <p className="setup-field-hint">
                    Unselected role details stay in your local draft so you can
                    switch back. Only selected roles appear on your completed
                    preview profile.
                  </p>
                </div>
              )}
              {step === 3 && (
                <div
                  className="account-setup-email"
                  id="setup-email"
                  tabIndex={-1}
                >
                  <div
                    className={
                      "account-setup-email__status" +
                      (verified ? " is-verified" : "")
                    }
                  >
                    <i aria-hidden="true">{verified ? "✓" : "@"}</i>
                    <div>
                      <small>
                        {verified
                          ? "EMAIL CONFIRMED · PREVIEW"
                          : "EMAIL CONFIRMATION NEEDED"}
                      </small>
                      <strong>{email || "No preview account found"}</strong>
                      <span>
                        Your email is private. It isn’t shown on your public
                        profile.
                      </span>
                    </div>
                  </div>
                  <p className="setup-email-copy">
                    {verified
                      ? "The email-confirmed state is ready. Review your profile next. This is a local preview, not proof of a verified email."
                      : isolated && emailState === "expired"
                        ? "This example link has expired. In the connected product, request a fresh link and open the latest email."
                        : isolated && emailState === "error"
                          ? "This example verification check failed. In the connected product, retry the check or request a new link."
                          : "In the connected product, open the latest verification link in your inbox, then return here to check your status."}
                  </p>
                  <div className="setup-email-actions">
                    <button
                      type="button"
                      className="setup-secondary"
                      onClick={refreshEmail}
                    >
                      Refresh status
                    </button>
                    {!verified && (
                      <button
                        type="button"
                        className="setup-secondary"
                        disabled={cooldown > 0}
                        onClick={() => {
                          setCooldown(30);
                          setNotice(
                            "Email delivery is not connected. No email was sent. You can review the verification design preview instead.",
                          );
                        }}
                      >
                        {cooldown > 0
                          ? `Try again in ${cooldown}s`
                          : "Resend verification"}
                      </button>
                    )}
                  </div>
                  {!isolated && !verified && (
                    <button
                      type="button"
                      className="setup-text-button"
                      onClick={() => {
                        if (save())
                          window.location.assign(
                            authPreviewHref("/verify-email", setupHref),
                          );
                      }}
                    >
                      Open verification design preview →
                    </button>
                  )}
                  <div className="setup-deferred">
                    <strong>Identity verification is separate.</strong>
                    <p>
                      No ID document is needed for setup. An optional
                      name-verification action lives on your profile and is not
                      completed by confirming your email.
                    </p>
                  </div>
                  {isolated && (
                    <nav
                      className="setup-fixture-links"
                      aria-label="Email design fixtures"
                    >
                      <span>DESIGN STATES</span>
                      {["pending", "verified", "expired", "error"].map(
                        (state) => (
                          <Link
                            key={state}
                            aria-current={
                              emailState === state ? "page" : undefined
                            }
                            href={
                              "/account-setup?preview=1&emailStatus=" + state
                            }
                            scroll={false}
                            onClick={() => {
                              setIssues({});
                              setNotice("");
                            }}
                          >
                            {state}
                          </Link>
                        ),
                      )}
                    </nav>
                  )}
                </div>
              )}
              {step === 4 && (
                <div className="setup-review-list">
                  <Review title="The essentials" onEdit={() => move(0)}>
                    <dl>
                      <dt>Name</dt>
                      <dd>{form.name || "Not added"}</dd>
                      <dt>Location</dt>
                      <dd>{form.location || "Not added"}</dd>
                      <dt>Headline</dt>
                      <dd>{form.headline || "Not added"}</dd>
                      <dt>Photo</dt>
                      <dd>
                        {form.avatarDataUrl
                          ? "Added to local preview"
                          : "Not added"}
                      </dd>
                    </dl>
                  </Review>
                  <Review
                    title="Your professional context"
                    onEdit={() => move(1)}
                  >
                    <dl>
                      <dt>Focus</dt>
                      <dd>{form.professionalFocus || "Not added"}</dd>
                      <dt>Experience</dt>
                      <dd>{form.professionalLevel || "Not added"}</dd>
                      <dt>Overview</dt>
                      <dd>{form.professionalOverview || "Not added"}</dd>
                      <dt>Skills</dt>
                      <dd>{form.skills || "Not added"}</dd>
                      <dt>Availability</dt>
                      <dd>
                        {form.isAvailable
                          ? "Open to relevant opportunities"
                          : "Not displayed"}
                      </dd>
                      <dt>Visibility</dt>
                      <dd>
                        {form.publicProfile
                          ? "Discoverable to members"
                          : "Not discoverable"}
                      </dd>
                    </dl>
                  </Review>
                  <Review title="Roles and details" onEdit={() => move(2)}>
                    {form.roles.length ? (
                      form.roles.map((role) => (
                        <div key={role} className="setup-review-role">
                          <strong>
                            {setupRoleLabel(role)}
                            {role === form.primaryRole ? " · Primary" : ""}
                          </strong>
                          <dl>
                            {visibleRoleFields(role, form.roleDetails[role])
                              .filter(
                                (config) => form.roleDetails[role][config.key],
                              )
                              .map((config) => (
                                <div key={config.key}>
                                  <dt>{config.label}</dt>
                                  <dd>{form.roleDetails[role][config.key]}</dd>
                                </div>
                              ))}
                          </dl>
                        </div>
                      ))
                    ) : (
                      <p>No roles selected yet.</p>
                    )}
                  </Review>
                  <Review title="Email and identity" onEdit={() => move(3)}>
                    <dl>
                      <dt>Email</dt>
                      <dd>{email}</dd>
                      <dt>Email status</dt>
                      <dd>
                        {verified
                          ? "Confirmed in local preview"
                          : "Confirmation needed"}
                      </dd>
                      <dt>Identity</dt>
                      <dd>Separate check · Not changed by setup</dd>
                    </dl>
                  </Review>
                  <p className="setup-field-hint">
                    Completing setup updates this browser’s preview only. No
                    account service, upload, email, identity check, or payout
                    service is connected.
                  </p>
                </div>
              )}
              {notice && (
                <p className="setup-status" role="status">
                  {notice}
                </p>
              )}
              <div className="setup-save-row">
                <span aria-live="polite">
                  {dirty
                    ? "Unsaved changes"
                    : savedAt && !Number.isNaN(Date.parse(savedAt))
                      ? "Saved · " +
                        new Date(savedAt).toLocaleTimeString("en-NG", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Not saved yet"}
                </span>
                <button
                  type="button"
                  className="setup-text-button"
                  disabled={!email || photoBusy}
                  onClick={() => save()}
                >
                  Save progress
                </button>
              </div>
              <footer className="account-setup-actions">
                <button
                  className="account-setup-back"
                  type="button"
                  disabled={step === 0}
                  onClick={() => move(step - 1)}
                >
                  Back
                </button>
                <button
                  className="account-setup-next"
                  type="submit"
                  disabled={!email || photoBusy}
                >
                  {step === 4
                    ? isolated
                      ? "Complete design preview"
                      : "Finish setup preview"
                    : "Save & continue"}
                  <span aria-hidden="true"> →</span>
                </button>
              </footer>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}

function FieldError({ id, error }: { id: string; error?: string }) {
  return error ? (
    <span className="setup-field-error" id={id + "-error"}>
      {error}
    </span>
  ) : null;
}
function Review({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: ReactNode;
}) {
  return (
    <section className="setup-review-section">
      <header>
        <h3>{title}</h3>
        <button
          className="setup-text-button"
          type="button"
          onClick={onEdit}
          aria-label={"Edit " + title.toLowerCase()}
        >
          Edit
        </button>
      </header>
      {children}
    </section>
  );
}
