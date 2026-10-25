import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { MockAuthForm } from "@/components/auth/mock-auth-form";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your Requote workspace.",
  robots: { index: false, follow: false },
};

type LoginPageProps = {
  searchParams: Promise<{ next?: string; state?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next, state } = await searchParams;

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Good to see you again."
      description="Log in to your Requote workspace."
      panel={{
        eyebrow: "A clearer work network",
        title: "Your next connection starts here.",
        description:
          "The work you need. The expertise you bring. A better way to bring them together.",
        items: [
          "Clear requests, with the context that matters.",
          "Offers you can compare with confidence.",
          "One profile for the ways you work.",
        ],
        footer:
          "Built for people, independent professionals, and growing teams.",
      }}
    >
      <MockAuthForm mode="login" nextPath={next} state={state} />
    </AuthShell>
  );
}
