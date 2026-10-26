import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { MockAuthForm } from "@/components/auth/mock-auth-form";

export const metadata: Metadata = {
  title: "Create your account",
  description: "Create your Requote workspace.",
  robots: { index: false, follow: false },
};

type CreateAccountPageProps = {
  searchParams: Promise<{ next?: string; state?: string }>;
};

export default async function CreateAccountPage({
  searchParams,
}: CreateAccountPageProps) {
  const { next, state } = await searchParams;

  return (
    <AuthShell
      eyebrow="Start something good"
      title="Make your next move."
      description="Create an account. Build a profile around you."
      panel={{
        eyebrow: "One account, many paths",
        title: "More ways to work. One place to begin.",
        description:
          "Find the right expertise, put your skills to work, or build your next team. There’s room for every part of what you do.",
        items: [
          "Start with a few simple details.",
          "Choose one or more roles during setup.",
          "Build your profile at your own pace.",
        ],
        footer: "Clients · Providers · Employers · Professionals · Investors",
      }}
    >
      <MockAuthForm mode="signup" nextPath={next} state={state} />
    </AuthShell>
  );
}
