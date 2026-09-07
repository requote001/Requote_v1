"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { AuthShell } from "@/components/auth/auth-shell";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (email.includes("@")) setSent(true);
  }

  return (
    <AuthShell
      eyebrow="Account recovery"
      title={sent ? "Check your inbox" : "Reset your password"}
      description={
        sent
          ? "If this email belongs to an account, reset instructions will be sent when production email is connected."
          : "Enter the email connected to your Requote account."
      }
    >
      {sent ? (
        <div className="auth-success">
          <span>✓</span>
          <p>This preview does not send a real email.</p>
          <Link className="product-primary-button" href="/login">
            Return to log in
          </Link>
        </div>
      ) : (
        <form className="auth-form" onSubmit={submit}>
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
          <button className="product-primary-button" type="submit">
            Send reset instructions
          </button>
          <p className="auth-form__switch">
            Remembered it? <Link href="/login">Return to log in</Link>
          </p>
        </form>
      )}
    </AuthShell>
  );
}
