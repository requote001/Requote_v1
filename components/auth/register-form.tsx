"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  getPendingRequest,
  setPreviewSession,
  submitPreviewRequest,
} from "@/lib/preview-session";

function safeNextPath(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/";
}

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole =
    searchParams.get("role") === "provider" ? "provider" : "requester";
  const [role, setRole] = useState<"requester" | "provider">(initialRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (
      name.trim().length < 2 ||
      !email.includes("@") ||
      password.length < 8 ||
      !accepted
    ) {
      setError(
        "Complete the required details and accept the Terms and Privacy Policy.",
      );
      return;
    }

    setPending(true);
    try {
      setPreviewSession({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
      });

      const request = getPendingRequest();
      if (request) {
        const saved = await submitPreviewRequest(request);
        router.replace(
          "/post-a-request/complete?id=" +
            encodeURIComponent(saved.id) +
            "&status=" +
            saved.status,
        );
        return;
      }

      router.replace(safeNextPath(searchParams.get("next")));
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "We could not continue this request.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      <div className="preview-notice">
        <strong>Product preview</strong>
        <span>
          This screen demonstrates onboarding only. It does not create a
          production identity or verification record.
        </span>
      </div>

      <fieldset className="role-picker">
        <legend>What would you like to do first?</legend>
        <label className={role === "requester" ? "is-selected" : ""}>
          <input
            type="radio"
            name="role"
            value="requester"
            checked={role === "requester"}
            onChange={() => setRole("requester")}
          />
          <span>
            <strong>Request something</strong>
            <small>Post a need and compare offers.</small>
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
            <strong>Provide something</strong>
            <small>Find work and submit offers.</small>
          </span>
        </label>
      </fieldset>

      <div className="form-grid form-grid--two">
        <label>
          Full name
          <input
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your full name"
            required
          />
        </label>
        <label>
          Phone number
          <input
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="+234"
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
          required
        />
      </label>

      <label>
        Password
        <input
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="At least 8 characters"
          minLength={8}
          required
        />
      </label>

      <label className="checkbox-field">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(event) => setAccepted(event.target.checked)}
          required
        />
        <span>
          I agree to the <Link href="/terms">Terms</Link> and{" "}
          <Link href="/privacy">Privacy Policy</Link>.
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
        {pending ? "Creating preview…" : "Create account"}
      </button>

      <p className="auth-form__switch">
        Already have an account? <Link href="/login">Log in</Link>
      </p>
    </form>
  );
}
