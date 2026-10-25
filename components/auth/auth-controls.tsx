"use client";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { authPreviewHref } from "@/lib/auth-preview";
export function PasswordField({
  id,
  label = "Password",
  value,
  onChange,
  newPassword = false,
  error,
  hint,
  recoveryHref,
}: {
  id: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  newPassword?: boolean;
  error?: string;
  hint?: string;
  recoveryHref?: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="auth-field">
      <div className="auth-field__label">
        <label htmlFor={id}>{label}</label>
        {recoveryHref && <Link href={recoveryHref}>Forgot password?</Link>}
      </div>
      <div className="auth-password-field">
        <input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete={newPassword ? "new-password" : "current-password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={
            newPassword ? "Create a password" : "Enter your password"
          }
          aria-invalid={!!error}
          aria-describedby={
            error ? `${id}-error` : hint ? `${id}-hint` : undefined
          }
        />
        <button
          type="button"
          aria-label={
            visible
              ? `Hide ${label.toLowerCase()}`
              : `Show ${label.toLowerCase()}`
          }
          aria-pressed={visible}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
      {error ? (
        <p className="auth-field-error" id={`${id}-error`}>
          {error}
        </p>
      ) : (
        hint && (
          <p className="auth-field-hint" id={`${id}-hint`}>
            {hint}
          </p>
        )
      )}
    </div>
  );
}
export function AuthSubmit({
  children,
  busy = false,
}: {
  children: ReactNode;
  busy?: boolean;
}) {
  return (
    <button
      className="auth-submit"
      type="submit"
      disabled={busy}
      aria-busy={busy}
    >
      <span>{children}</span>
      <span aria-hidden="true" className={busy ? "auth-submit__spinner" : ""}>
        {busy ? "" : "→"}
      </span>
    </button>
  );
}
export function AuthPreviewStates({
  path,
  states,
  active,
  nextPath,
}: {
  path: string;
  states: [string, string][];
  active: string;
  nextPath?: string;
}) {
  return (
    <details className="auth-preview-states">
      <summary>Explore design states</summary>
      <nav aria-label="Design preview states">
        {states.map(([state, label]) => (
          <Link
            key={state}
            href={authPreviewHref(path, nextPath, state)}
            aria-current={active === state ? "page" : undefined}
          >
            {label}
          </Link>
        ))}
      </nav>
      <p>
        Interface examples only. These controls do not change a real account.
      </p>
    </details>
  );
}
