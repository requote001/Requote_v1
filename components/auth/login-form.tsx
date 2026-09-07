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

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email.includes("@") || password.length < 8) {
      setError("Enter a valid email and a password of at least 8 characters.");
      return;
    }

    setPending(true);
    try {
      const derivedName = email
        .split("@")[0]
        .split(/[._-]/)
        .filter(Boolean)
        .map((part) => (part[0]?.toUpperCase() ?? "") + part.slice(1))
        .join(" ");

      setPreviewSession({
        name: derivedName || "Requote User",
        email: email.trim().toLowerCase(),
        role: "requester",
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
          Use any valid email and an 8+ character password. No real account or
          payment profile is created.
        </span>
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
        <span className="field-label-row">
          Password
          <Link href="/forgot-password">Forgot password?</Link>
        </span>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="At least 8 characters"
          minLength={8}
          required
        />
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
        {pending ? "Continuing…" : "Log in"}
      </button>

      <p className="auth-form__switch">
        New to Requote?{" "}
        <Link
          href={
            "/create-account" +
            (searchParams.get("next")
              ? "?next=" +
                encodeURIComponent(safeNextPath(searchParams.get("next")))
              : "")
          }
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}
