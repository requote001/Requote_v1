import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { MockAuthForm } from "@/components/auth/mock-auth-form";

export const metadata: Metadata = {
  title: "Create your account",
  description: "Create your Requote workspace.",
  robots: { index: false, follow: false },
};

type CreateAccountPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function CreateAccountPage({
  searchParams,
}: CreateAccountPageProps) {
  const { next } = await searchParams;

  return (
    <AuthShell
      eyebrow="Create your workspace"
      title="Start with the context that matters."
      description="Create one Requote account and shape it around the work, people, and opportunities you want to move toward."
      panel={{
        eyebrow: "One account, many paths",
        title: "Start with one role. Add more when you are ready.",
        description:
          "Your first profile choice helps us prepare the right experience. You can refine it later as your work changes.",
        items: [
          "Choose the path closest to your next move.",
          "Complete the essentials at your own pace.",
          "Keep requests, offers, and opportunities connected.",
        ],
        footer: "Preview experience — account creation is currently mocked.",
      }}
    >
      <MockAuthForm mode="signup" nextPath={next} />
    </AuthShell>
  );
}
