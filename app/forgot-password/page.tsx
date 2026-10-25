import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { MockAuthForm } from "@/components/auth/mock-auth-form";
import { AuthStateScreen } from "@/components/auth/auth-state-screen";

export const metadata: Metadata = {
  title: "Reset your password",
  description: "Reset your Requote password.",
  robots: { index: false, follow: false },
};

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; state?: string }>;
}) {
  const { next, state } = await searchParams;
  return (
    <AuthShell
      eyebrow="Account recovery"
      title={state === "sent" ? "Check your inbox." : "Forgot your password?"}
      description={
        state === "sent"
          ? "Your next step is a recovery link."
          : "It happens. Let’s help you get back in."
      }
    >
      {state === "sent" ? (
        <AuthStateScreen kind="recovery" state="sent" nextPath={next} />
      ) : (
        <MockAuthForm mode="recovery" nextPath={next} state={state} />
      )}
    </AuthShell>
  );
}
