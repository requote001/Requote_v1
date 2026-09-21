import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { MockAuthForm } from "@/components/auth/mock-auth-form";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your Requote workspace.",
  robots: { index: false, follow: false },
};

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Pick up where your next move begins."
      description="Sign in to keep requests, conversations, opportunities, and profile setup in one clear place."
      panel={{
        eyebrow: "A clearer work network",
        title: "Bring the right context to every connection.",
        description:
          "Requote is designed to make the next step easier to understand, whether you are hiring, providing, building, or exploring.",
        items: [
          "Keep your work and opportunities in one workspace.",
          "Move from a clear brief to a better conversation.",
          "Build a profile that reflects what you can do.",
        ],
        footer: "Preview experience — authentication is currently mocked.",
      }}
    >
      <MockAuthForm mode="login" nextPath={next} />
    </AuthShell>
  );
}
