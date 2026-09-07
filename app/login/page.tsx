import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to save or publish your Requote request.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Log in to Requote"
      description="Continue your request, review offers, and manage protected transactions."
    >
      <Suspense
        fallback={
          <div className="auth-form-skeleton">Loading secure form…</div>
        }
      >
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
