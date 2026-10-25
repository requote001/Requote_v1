"use client";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  AUTH_PREVIEW_EMAIL_KEY,
  AUTH_PREVIEW_KEY,
  authPreviewHref,
  safeAuthReturnPath,
} from "@/lib/auth-preview";
import { AuthPreviewStates, AuthSubmit, PasswordField } from "./auth-controls";

export function MockAuthForm({
  mode,
  nextPath,
  state = "default",
}: {
  mode: "login" | "signup" | "recovery";
  nextPath?: string;
  state?: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState("");
  const signup = mode === "signup";
  const recovery = mode === "recovery";
  const path = recovery
    ? "/forgot-password"
    : signup
      ? "/create-account"
      : "/login";
  const target = safeAuthReturnPath(nextPath);
  const message =
    notice ||
    (state === "error"
      ? "We couldn’t complete that request. Check your details and try again. This is an example error state."
      : "");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const fields: Record<string, string> = {};
    if (signup && !name.trim()) fields.name = "Enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      fields.email = "Enter a valid email address.";
    if (!recovery && password.length < (signup ? 8 : 6))
      fields.password =
        "Use at least " + (signup ? 8 : 6) + " characters for this preview.";
    if (signup && !agreed)
      fields.terms = "Select the agreement to continue the preview.";
    setErrors(fields);
    setNotice("");
    if (Object.keys(fields).length) {
      document.getElementById("auth-" + Object.keys(fields)[0])?.focus();
      return;
    }
    setBusy(true);
    // Simulate the pending design state without sending any credentials.
    await new Promise((resolve) => setTimeout(resolve, 450));
    try {
      window.sessionStorage.setItem(AUTH_PREVIEW_EMAIL_KEY, email.trim());
      if (recovery) {
        window.location.assign(
          authPreviewHref("/forgot-password", target, "sent"),
        );
        return;
      }
      let existing: Record<string, unknown> = {};
      try {
        const stored = JSON.parse(
          window.localStorage.getItem(AUTH_PREVIEW_KEY) || "{}",
        );
        if (
          !signup &&
          typeof stored.email === "string" &&
          stored.email.toLowerCase() === email.trim().toLowerCase()
        )
          existing = stored;
      } catch {
        /* A damaged preview can start with fresh local state. */
      }
      window.localStorage.setItem(
        AUTH_PREVIEW_KEY,
        JSON.stringify({
          ...existing,
          authenticated: true,
          name: name.trim() || existing.name || "Requote member",
          email: email.trim(),
          role: existing.role || "Client",
          profileComplete: signup ? false : (existing.profileComplete ?? false),
          emailVerified: signup ? false : (existing.emailVerified ?? false),
        }),
      );
      window.location.assign(
        signup ? authPreviewHref("/verify-email", target) : target,
      );
    } catch {
      setNotice(
        "Your browser couldn’t save this preview. Enable browser storage and try again.",
      );
      setBusy(false);
    }
  }

  return (
    <>
      {!recovery && (
        <nav className="auth-account-switch" aria-label="Account access">
          <Link
            href={authPreviewHref("/login", nextPath)}
            aria-current={!signup ? "page" : undefined}
          >
            Log in
          </Link>
          <Link
            href={authPreviewHref("/create-account", nextPath)}
            aria-current={signup ? "page" : undefined}
          >
            Create account
          </Link>
        </nav>
      )}
      <form
        className="auth-design-form"
        onSubmit={submit}
        noValidate
        aria-label={
          recovery ? "Password recovery" : signup ? "Create account" : "Log in"
        }
      >
        {signup && (
          <div className="auth-field">
            <label htmlFor="auth-name">Full name</label>
            <input
              id="auth-name"
              autoComplete="name"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "auth-name-error" : undefined}
            />
            {errors.name && (
              <p id="auth-name-error" className="auth-field-error">
                {errors.name}
              </p>
            )}
          </div>
        )}
        <div className="auth-field">
          <label htmlFor="auth-email">Email address</label>
          <input
            id="auth-email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "auth-email-error" : undefined}
          />
          {errors.email && (
            <p id="auth-email-error" className="auth-field-error">
              {errors.email}
            </p>
          )}
        </div>
        {!recovery && (
          <PasswordField
            id="auth-password"
            value={password}
            onChange={setPassword}
            newPassword={signup}
            error={errors.password}
            hint={
              signup
                ? "At least 8 characters. Use a sample password for this preview."
                : undefined
            }
            recoveryHref={
              !signup
                ? authPreviewHref("/forgot-password", nextPath)
                : undefined
            }
          />
        )}
        {signup && (
          <>
            <p className="auth-role-note">
              <span aria-hidden="true">↗</span> One account. Choose your roles
              during setup.
            </p>
            <div>
              <label className="auth-consent">
                <input
                  id="auth-terms"
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  aria-invalid={!!errors.terms}
                  aria-describedby={
                    errors.terms ? "auth-terms-error" : undefined
                  }
                />
                <span>
                  I agree to the <Link href="/terms">Terms of Service</Link> and{" "}
                  <Link href="/privacy">Privacy Policy</Link>.
                </span>
              </label>
              {errors.terms && (
                <p className="auth-field-error" id="auth-terms-error">
                  {errors.terms}
                </p>
              )}
            </div>
          </>
        )}
        {message && (
          <p className="auth-feedback auth-feedback--error" role="alert">
            {message}
          </p>
        )}
        <AuthSubmit busy={busy}>
          {busy
            ? "Please wait…"
            : recovery
              ? "Preview recovery email"
              : signup
                ? "Create preview account"
                : "Log in to preview"}
        </AuthSubmit>
        {!recovery && (
          <>
            <div className="auth-design-divider">
              <span>or continue with</span>
            </div>
            <div className="auth-provider-buttons">
              <button
                type="button"
                onClick={() =>
                  setNotice(
                    "Google sign-in will be available when the authentication provider is connected. No account was created.",
                  )
                }
              >
                <span aria-hidden="true" className="auth-google-mark">
                  G
                </span>
                Google
              </button>
              <button
                type="button"
                onClick={() =>
                  setNotice(
                    "LinkedIn sign-in will be available when the authentication provider is connected. No account was created.",
                  )
                }
              >
                <span aria-hidden="true" className="auth-linkedin-mark">
                  in
                </span>
                LinkedIn
              </button>
            </div>
            <p className="auth-secondary-prompt">
              {signup ? "Already have an account?" : "New to Requote?"}{" "}
              <Link
                href={authPreviewHref(
                  signup ? "/login" : "/create-account",
                  nextPath,
                )}
              >
                {signup ? "Log in" : "Create an account"}
              </Link>
            </p>
          </>
        )}
        {recovery && (
          <Link
            className="auth-back-link"
            href={authPreviewHref("/login", nextPath)}
          >
            ← Back to log in
          </Link>
        )}
      </form>
      <AuthPreviewStates
        path={path}
        nextPath={nextPath}
        active={state}
        states={[
          ["default", "Default"],
          ["error", "Service error"],
        ]}
      />
    </>
  );
}
