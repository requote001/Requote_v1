import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthStateScreen } from "@/components/auth/auth-state-screen";

export const metadata: Metadata = {
  title: "Verify your email",
  robots: { index: false, follow: false },
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string; next?: string }>;
}) {
  const { state: input, next } = await searchParams;
  const state =
    input && ["pending", "verified", "expired", "error"].includes(input)
      ? input
      : "pending";
  const title =
    state === "verified"
      ? "You’re ready for the next step."
      : state === "expired"
        ? "Let’s get you a fresh link."
        : state === "error"
          ? "Let’s try that again."
          : "Check your email.";
  return (
    <AuthShell
      eyebrow="Confirm your email"
      title={title}
      description={
        state === "verified"
          ? "Next, make your profile your own."
          : "A small step toward your Requote workspace."
      }
    >
      <AuthStateScreen
        key={state}
        kind="verification"
        state={state}
        nextPath={next}
      />
    </AuthShell>
  );
}
