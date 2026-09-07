import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata: Metadata = {
  title: "Verify your email",
  robots: { index: false, follow: false },
};

export default function VerifyEmailPage() {
  return (
    <AuthShell
      eyebrow="One more step"
      title="Verify your email"
      description="Confirm your address before receiving offers or managing protected transactions."
    >
      <div className="auth-success">
        <span>✉</span>
        <h2>Verification preview</h2>
        <p>
          Production verification will send a secure, expiring link to the
          address used during registration.
        </p>
        <Link className="product-primary-button" href="/login">
          Continue to log in
        </Link>
      </div>
    </AuthShell>
  );
}
