import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthStateScreen } from "@/components/auth/auth-state-screen";

export const metadata: Metadata = {
  title: "Choose a new password",
  robots: { index: false, follow: false },
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string; next?: string }>;
}) {
  const { state: input, next } = await searchParams;
  const state = input === "ready" || input === "success" ? input : "expired";
  return (
    <AuthShell
      eyebrow="Account recovery"
      title={
        state === "ready"
          ? "A fresh start."
          : state === "success"
            ? "You’re all set."
            : "This link has expired."
      }
      description={
        state === "ready"
          ? "Choose a new password for your account."
          : state === "success"
            ? "Your password-reset completion preview."
            : "Request a new recovery link to continue."
      }
    >
      <AuthStateScreen key={state} kind="reset" state={state} nextPath={next} />
    </AuthShell>
  );
}
