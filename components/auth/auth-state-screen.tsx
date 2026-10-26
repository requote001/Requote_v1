"use client";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import {
  AUTH_PREVIEW_EMAIL_KEY,
  AUTH_PREVIEW_KEY,
  authPreviewHref,
  maskPreviewEmail,
  safeAuthReturnPath,
} from "@/lib/auth-preview";
import { AuthPreviewStates, AuthSubmit, PasswordField } from "./auth-controls";

type Kind = "verification" | "recovery" | "reset" | "callback";

export function AuthStateScreen({
  kind,
  state,
  nextPath,
}: {
  kind: Kind;
  state: string;
  nextPath?: string;
}) {
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const target = safeAuthReturnPath(nextPath);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        setEmail(window.sessionStorage.getItem(AUTH_PREVIEW_EMAIL_KEY) || "");
      } catch {
        /* The illustration can work without browser storage. */
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  function resend() {
    setCooldown(30);
    setNotice(
      "Preview only: no email was sent. In the connected flow, a new link will be sent to your address.",
    );
  }
  function continueSetup() {
    try {
      const member = JSON.parse(
        window.localStorage.getItem(AUTH_PREVIEW_KEY) || "{}",
      );
      if (!member.authenticated) {
        window.location.assign(authPreviewHref("/create-account", target));
        return;
      }
      window.localStorage.setItem(
        AUTH_PREVIEW_KEY,
        JSON.stringify({ ...member, emailVerified: true }),
      );
      window.location.assign(
        new URL(target, "https://requote.invalid").pathname === "/account-setup"
          ? target
          : "/account-setup?return=" + encodeURIComponent(target),
      );
    } catch {
      setNotice(
        "Your browser couldn’t update the local preview. Please allow browser storage and try again.",
      );
    }
  }
  async function reset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const fields: Record<string, string> = {};
    if (password.length < 8) fields.password = "Use at least 8 characters.";
    if (password !== confirmation || !confirmation)
      fields.confirmation = "The two passwords must match.";
    setErrors(fields);
    if (Object.keys(fields).length) {
      document.getElementById("reset-" + Object.keys(fields)[0])?.focus();
      return;
    }
    setBusy(true);
    await new Promise((resolve) => setTimeout(resolve, 450));
    // Only the design state changes. Passwords are never sent or persisted.
    window.location.assign(
      authPreviewHref("/reset-password", target, "success"),
    );
  }

  const resetReady = kind === "reset" && state === "ready";
  const positive =
    state === "verified" || state === "success" || state === "complete";
  const warning =
    state === "expired" || state === "error" || state === "invalid";
  const route =
    kind === "verification"
      ? "/verify-email"
      : kind === "recovery"
        ? "/forgot-password"
        : kind === "reset"
          ? "/reset-password"
          : "/auth/callback";
  return (
    <div className="auth-state-screen">
      {!resetReady && (
        <div
          className={
            "auth-state-icon" +
            (positive ? " is-positive" : warning ? " is-warning" : "")
          }
          aria-hidden="true"
        >
          {positive ? (
            "✓"
          ) : warning ? (
            "!"
          ) : (
            <svg
              width="27"
              height="27"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="3" y="5" width="18" height="14" rx="3" />
              <path d="m4 7 8 6 8-6" />
            </svg>
          )}
        </div>
      )}
      {kind === "verification" && (
        <>
          {state === "verified" ? (
            <>
              <p className="auth-state-copy">
                Your email-confirmed screen is ready to review. Continue to set
                up your profile and choose the roles that fit you.
              </p>
              <button
                className="auth-submit"
                onClick={continueSetup}
                type="button"
              >
                Continue setup preview <span aria-hidden="true">→</span>
              </button>
              <p className="auth-field-hint">
                This confirms the local demo only. Real verification will come
                from Supabase.
              </p>
            </>
          ) : (
            <>
              <p className="auth-state-copy">
                {state === "expired" ? (
                  "That verification link has expired. Request a fresh link to continue."
                ) : state === "error" ? (
                  "We couldn’t confirm this link. Check that you opened the latest link, or try requesting a new one."
                ) : (
                  <>
                    Open the verification link sent to{" "}
                    <strong>
                      {email ? maskPreviewEmail(email) : "your email address"}
                    </strong>{" "}
                    to continue setting up your account.
                  </>
                )}
              </p>
              <div className="auth-next-steps">
                <span>01</span>
                <p>Check your inbox and spam folder.</p>
                <span>02</span>
                <p>Open the latest Requote verification email.</p>
                <span>03</span>
                <p>Follow the link to return to your setup.</p>
              </div>
              <button
                type="button"
                className="auth-submit"
                disabled={cooldown > 0}
                onClick={resend}
              >
                {cooldown
                  ? "Try again in " + cooldown + "s"
                  : "Resend verification email"}
                <span aria-hidden="true">↗</span>
              </button>
              <p className="auth-secondary-prompt">
                Wrong address?{" "}
                <Link href={authPreviewHref("/create-account", nextPath)}>
                  Start with another email
                </Link>
              </p>
            </>
          )}
        </>
      )}
      {kind === "recovery" && (
        <>
          <p className="auth-state-copy">
            If an account exists for{" "}
            <strong>
              {email ? maskPreviewEmail(email) : "that email address"}
            </strong>
            , the connected product will send a password recovery link.
          </p>
          <p className="auth-help-note">
            This is the recovery confirmation preview. No email has been sent.
          </p>
          <button
            type="button"
            className="auth-outline-action"
            disabled={cooldown > 0}
            onClick={resend}
          >
            {cooldown
              ? "Try again in " + cooldown + "s"
              : "Resend recovery link"}
          </button>
          <Link
            className="auth-back-link"
            href={authPreviewHref("/login", nextPath)}
          >
            ← Back to log in
          </Link>
        </>
      )}
      {kind === "reset" &&
        (resetReady ? (
          <form
            className="auth-design-form"
            noValidate
            onSubmit={reset}
            aria-label="Reset password preview"
          >
            <PasswordField
              id="reset-password"
              label="New password"
              value={password}
              onChange={setPassword}
              newPassword
              error={errors.password}
              hint="At least 8 characters. Use a sample password here."
            />
            <PasswordField
              id="reset-confirmation"
              label="Confirm new password"
              value={confirmation}
              onChange={setConfirmation}
              newPassword
              error={errors.confirmation}
            />
            <AuthSubmit busy={busy}>
              {busy ? "Please wait…" : "Preview password reset"}
            </AuthSubmit>
            <p className="auth-field-hint">
              No password will be saved or changed in this preview.
            </p>
          </form>
        ) : state === "success" ? (
          <>
            <p className="auth-state-copy">
              This is the completed password-reset screen. In the connected
              product, you can now sign in with your new password.
            </p>
            <p className="auth-help-note">
              Preview complete. No actual password was changed.
            </p>
            <Link
              className="auth-submit"
              href={authPreviewHref("/login", nextPath)}
            >
              Back to log in <span aria-hidden="true">→</span>
            </Link>
          </>
        ) : (
          <>
            <p className="auth-state-copy">
              This recovery link is no longer valid. Request a new one to reset
              your password.
            </p>
            <Link
              className="auth-submit"
              href={authPreviewHref("/forgot-password", nextPath)}
            >
              Request a new link <span aria-hidden="true">→</span>
            </Link>
          </>
        ))}
      {kind === "callback" && (
        <>
          <p className="auth-state-copy">
            {state === "complete"
              ? "This is the successful sign-in handoff preview. Your live provider callback will securely complete this step when authentication is connected."
              : "We couldn’t complete this sign-in. Authentication is not connected in this design preview. Return to log in and choose a preview path."}
          </p>
          <Link
            className="auth-submit"
            href={authPreviewHref("/login", nextPath)}
          >
            Return to log in <span aria-hidden="true">→</span>
          </Link>
        </>
      )}
      {notice && (
        <p className="auth-feedback" role="status">
          {notice}
        </p>
      )}
      <p className="auth-state-support">
        Need a hand? <a href="mailto:info@requote.cc">Contact support</a>
      </p>
      <AuthPreviewStates
        path={route}
        nextPath={nextPath}
        active={state}
        states={
          kind === "verification"
            ? [
                ["pending", "Pending"],
                ["verified", "Verified"],
                ["expired", "Expired"],
                ["error", "Error"],
              ]
            : kind === "reset"
              ? [
                  ["ready", "New password"],
                  ["success", "Complete"],
                  ["expired", "Expired link"],
                ]
              : kind === "callback"
                ? [
                    ["error", "Error"],
                    ["complete", "Complete"],
                  ]
                : [
                    ["default", "Email form"],
                    ["sent", "Confirmation"],
                  ]
        }
      />
    </div>
  );
}
