import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthStateScreen } from "@/components/auth/auth-state-screen";

export const metadata: Metadata = {
  title: "Sign-in handoff",
  robots: { index: false, follow: false },
};

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string; next?: string }>;
}) {
  const { state: input, next } = await searchParams;
  const state = input === "complete" ? input : "error";
  return (
    <AuthShell
      eyebrow="Sign-in handoff"
      title={
        state === "complete"
          ? "Your workspace is next."
          : "We couldn’t finish signing you in."
      }
      description={
        state === "complete"
          ? "A clear handoff back to Requote."
          : "You can return to log in and try again."
      }
    >
      <AuthStateScreen
        key={state}
        kind="callback"
        state={state}
        nextPath={next}
      />
    </AuthShell>
  );
}
