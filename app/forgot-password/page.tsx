import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { MockAuthForm } from "@/components/auth/mock-auth-form";

export const metadata: Metadata = {
  title: "Reset your password",
  description: "Reset your Requote password.",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Get back to your workspace."
      description="Enter your email and we will show the next step in this preview recovery flow."
    >
      <MockAuthForm mode="recovery" />
    </AuthShell>
  );
}
