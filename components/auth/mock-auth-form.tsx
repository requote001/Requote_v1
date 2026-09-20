"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

type AuthMode = "login" | "signup" | "recovery";

type MockAuthFormProps = {
  mode: AuthMode;
  nextPath?: string;
};

const roles = [
  ["Client", "Post a request and compare offers."],
  ["Provider", "Share your expertise and respond to work."],
  ["Employer", "Build teams around real business needs."],
  ["Professional", "Find opportunities with a clearer fit."],
  ["Investor", "Follow and support the work network."],
] as const;

function safeNextPath(path?: string) {
  return path?.startsWith("/") && !path.startsWith("//") ? path : "/home";
}

export function MockAuthForm({ mode, nextPath }: MockAuthFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Client");
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const isSignup = mode === "signup";
  const isRecovery = mode === "recovery";

  function authenticate(name: string, address: string, selectedRole: string) {
    window.localStorage.setItem(
      "requote_mock_auth",
      JSON.stringify({
        authenticated: true,
        name: name || "Requote member",
        email: address,
        role: selectedRole,
      }),
    );
    window.location.assign(safeNextPath(nextPath));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!email.trim()) {
      setError("Enter an email address to continue.");
      return;
    }

    if (isRecovery) {
      setNotice(
        "In the production flow, a recovery link would be sent to this address.",
      );
      return;
    }

    if (password.length < 6) {
      setError("Use at least 6 characters for this preview password.");
      return;
    }

    authenticate(fullName, email.trim(), role);
  }

  function continueWith(provider: string) {
    setError("");
    authenticate("Requote member", `${provider.toLowerCase()}@example.com`, role);
  }

  if (notice) {
    return (
      <div className="auth-success">
        <span aria-hidden="true">✓</span>
        <div>
          <h2>Check your inbox next.</h2>
          <p>{notice}</p>
        </div>
        <Link className="product-primary-button" href="/login">
          Return to login
        </Link>
      </div>
    );
  }

  return (
    <>
      {!isRecovery && (
        <div className="auth-mode-switch" role="tablist" aria-label="Account action">
          <Link
            className={!isSignup ? "is-active" : ""}
            href={nextPath ? `/login?next=${encodeURIComponent(nextPath)}` : "/login"}
            role="tab"
            aria-selected={!isSignup}
          >
            Log in
          </Link>
          <Link
            className={isSignup ? "is-active" : ""}
            href={
              nextPath
                ? `/create-account?next=${encodeURIComponent(nextPath)}`
                : "/create-account"
            }
            role="tab"
            aria-selected={isSignup}
          >
            Create account
          </Link>
        </div>
      )}

      <form className="auth-form mock-auth-form" onSubmit={handleSubmit}>
        {isSignup && (
          <label>
            Full name
            <input
              autoComplete="name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Your name"
              required
            />
          </label>
        )}

        <label>
          Email address
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@company.com"
            required
          />
        </label>

        {!isRecovery && (
          <label>
            <span className="field-label-row">
              <span>Password</span>
              {!isSignup && <Link href="/forgot-password">Forgot password?</Link>}
            </span>
            <span className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete={isSignup ? "new-password" : "current-password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 6 characters"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </span>
          </label>
        )}

        {isSignup && (
          <fieldset className="mock-role-picker">
            <legend>Start with the path closest to you</legend>
            <div>
              {roles.map(([roleName, description]) => (
                <label className={role === roleName ? "is-selected" : ""} key={roleName}>
                  <input
                    type="radio"
                    name="role"
                    value={roleName}
                    checked={role === roleName}
                    onChange={(event) => setRole(event.target.value)}
                  />
                  <span>
                    <strong>{roleName}</strong>
                    <small>{description}</small>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {isSignup && (
          <label className="checkbox-field">
            <input type="checkbox" required />
            <span>
              I agree to the <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy Policy</Link>.
            </span>
          </label>
        )}

        {error && <p className="form-error" role="alert">{error}</p>}

        <button className="product-primary-button" type="submit">
          {isRecovery ? "Send recovery link" : isSignup ? "Create account" : "Log in"}
        </button>

        {!isRecovery && (
          <>
            <div className="auth-divider"><span>or continue with</span></div>
            <div className="mock-social-actions">
              <button type="button" onClick={() => continueWith("Google")}>Google</button>
              <button type="button" onClick={() => continueWith("LinkedIn")}>LinkedIn</button>
            </div>
            <p className="auth-form__switch">
              {isSignup ? "Already have an account? " : "Don’t have an account? "}
              <Link href={isSignup ? "/login" : "/create-account"}>
                {isSignup ? "Log in" : "Create account"}
              </Link>
            </p>
          </>
        )}

        {isRecovery && (
          <p className="auth-form__switch">
            Remembered your password? <Link href="/login">Return to login</Link>
          </p>
        )}
      </form>
    </>
  );
}
