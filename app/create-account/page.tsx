import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create an account",
  description:
    "Create a Requote account to post requests or respond as a provider.",
  robots: { index: false, follow: false },
};

export default function CreateAccountPage() {
  return (
    <AuthShell
      eyebrow="Create your account"
      title="Start with one Requote account"
      description="Request what you need and provide services from the same trusted profile."
    >
      <Suspense
        fallback={
          <div className="auth-form-skeleton">Loading account form…</div>
        }
      >
        <RegisterForm />
      </Suspense>
    </AuthShell>
  );
}
